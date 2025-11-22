import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, BookOpen, History, Bot, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage, generateSessionId, ChatMessage as APIChatMessage } from "@/services/chatApi";
import ReactMarkdown from "react-markdown";

type GreetingStyle = "short" | "medium" | "ultra";
const greetingStyles = ["short", "medium", "ultra"] as const;
const pickRandomGreetingStyle = (): GreetingStyle =>
	greetingStyles[Math.floor(Math.random() * greetingStyles.length)];

const getGreeting = (style: GreetingStyle): string => {
	switch (style) {
		case "short":
			return `

Hi! 👋 I'm ALEX — your IELTS Reading Mentor.  
Ready to improve your reading skills, understand passages, and build confidence?  
Tell me what you want to work on today. 😊`;
		case "ultra":
			return `

Hey there! 😊 I’m ALEX — your friendly IELTS Reading Mentor.
No stress, no pressure — just a supportive guide to help you understand passages, fix mistakes, beat timing problems, and grow your confidence.
Drop a question, share your answer, or tell me what you’re struggling with.  
We’ll improve your reading step by step. 💪📚`;
		default:
			return `

Hello! 👋 I’m ALEX — your Personal IELTS Reading Mentor.
I can help you with:
• Explanations of your answers  
• Hints and clues  
• Reading strategies  
• Practice and confidence-building  
Drag a question here or tell me what you'd like to focus on today. 😊`;
	}
};

type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

export default function ReadingTutor() {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: crypto.randomUUID(),
			role: "assistant",
			content: getGreeting(pickRandomGreetingStyle()),
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [sessionId] = useState(() => generateSessionId());
	const listRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const hasText = input.trim().length > 0;

	type StructuredMatchingData = {
		context: string[];
		title: string;
		paragraphs: Array<{ label: string; text: string }>;
		headings: string[];
		cta: string | null;
	};

	// Parse a Matching Headings-style message into structured blocks
	const parseStructuredMatchingHeadings = (content: string): StructuredMatchingData | null => {
		const lines = content.split(/\r?\n/).map((l) => l.trimEnd());
		const text = lines.join("\n");

		const passageIdx = text.search(/(^|\n)Passage:/i);
		const headingsIdx = text.search(/(^|\n)List of Headings:/i);

		if (passageIdx === -1 || headingsIdx === -1 || headingsIdx < passageIdx) {
			return null;
		}

		const before = text.slice(0, passageIdx).trim();
		const afterPassage = text.slice(passageIdx).replace(/^Passage:\s*/i, "");

		// Title = up to first newline from after 'Passage:'
		const firstNl = afterPassage.indexOf("\n");
		const title = (firstNl === -1 ? afterPassage : afterPassage.slice(0, firstNl)).trim();
		const passageBody = (firstNl === -1 ? "" : afterPassage.slice(firstNl + 1)).trim();

		// Extract passage body up to List of Headings
		const passageBodyOnly = passageBody.slice(0, passageBody.search(/(^|\n)List of Headings:/i)).trim();

		// Paragraphs labeled "Paragraph A/B/C" (fallback: split by blank lines)
		const paraMatches = [...passageBodyOnly.matchAll(/Paragraph\s+([A-Z])\s*\n([\s\S]*?)(?=\nParagraph\s+[A-Z]\s*\n|$)/gi)];
		let paragraphs: Array<{ label: string; text: string }> = [];
		if (paraMatches.length > 0) {
			paragraphs = paraMatches.map((m) => ({
				label: m[1].toUpperCase(),
				text: m[2].trim(),
			}));
		} else {
			// Fallback: split by double newlines into up to 3 paragraphs and label A, B, C
			const parts = passageBodyOnly.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).slice(0, 3);
			paragraphs = parts.map((p, idx) => ({
				label: String.fromCharCode(65 + idx), // A, B, C
				text: p,
			}));
		}

		// Headings section
		const headingsSection = text.slice(headingsIdx).replace(/(^|\n)List of Headings:\s*/i, "");
		// CTA: find "Match the Headings" line (optional)
		const ctaMatch = headingsSection.match(/(^|\n)(Match the Headings[\s\S]*?$)/i);
		const cta = ctaMatch ? ctaMatch[2].trim() : null;
		const headingsOnly = (ctaMatch ? headingsSection.slice(0, ctaMatch.index).trim() : headingsSection.trim());

		// Extract heading lines: roman numerals or bullets
		const headingLines = headingsOnly
			.split(/\r?\n/)
			.map((l) => l.trim())
			.filter(Boolean)
			.map((l) => l.replace(/^(?:[ivxlcdm]+\s*[).]|[-*]\s*)\s*/i, ""));

		const context = before ? before.split(/\r?\n/).filter(Boolean) : [];

		if (!title || paragraphs.length === 0 || headingLines.length === 0) {
			return null;
		}

		return {
			context,
			title,
			paragraphs,
			headings: headingLines,
			cta,
		};
	};

	// Collapse extra gaps and auto-number lines after common headers
	const formatAssistantContent = (raw: string): string => {
		// Collapse 3+ blank lines into 2
		const collapsed = raw.replace(/\n{3,}/g, '\n\n');
		// Auto-number immediately after headers until the first blank line
		return collapsed.replace(
			/(Statements?|Questions?|True\/False\/Not Given|T\/F\/NG):\s*\n([\s\S]+)/i,
			(_, header: string, rest: string) => {
				const lines = rest.split('\n');
				let end = lines.findIndex((l) => !l.trim());
				if (end === -1) end = lines.length;
				const numbered = lines.slice(0, end).map((line, i) => {
					// Keep existing bullets/numbers
					if (/^\s*([-*]|\d+\.)\s+/.test(line)) return line;
					if (!line.trim()) return line;
					return `${i + 1}. ${line.trim()}`;
				});
				const remaining = lines.slice(end);
				return `${header}:\n` + [...numbered, ...remaining].join('\n');
			}
		);
	};

	// Structured AI UI for matching-headings messages
	function StructuredAiMessage({ data }: { data: StructuredMatchingData }) {
		return (
			<div className="space-y-3">
				{data.context.length > 0 && (
					<div className="ai-section text-xs text-muted-foreground">
						{data.context.map((line, idx) => (
							<p key={idx} className={idx === 0 ? "" : "mt-1"}>{line}</p>
						))}
					</div>
				)}

				<div className="ai-section ai-card">
					<div className="ai-card-title">
						<span role="img" aria-label="passage">📄</span>
						<span>{data.title}</span>
					</div>
					<div className="ai-card-scroll chat-content">
						{data.paragraphs.map((p) => (
							<div key={p.label} className="mb-2">
								<div className="ai-paragraph-label">Paragraph {p.label}</div>
								<p className="mt-1">{p.text}</p>
							</div>
						))}
					</div>
				</div>

				<div className="ai-section">
					<div className="font-semibold mb-1">List of Headings</div>
					<ol className="list-[lower-roman] pl-6 space-y-2">
						{data.headings.map((h, idx) => (
							<li key={idx}>{h}</li>
						))}
					</ol>
				</div>

				{data.cta && <div className="ai-cta">{data.cta}</div>}
			</div>
		);
	}

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [messages, isLoading]);

	const send = async () => {
		if (!input.trim() || isLoading) return;
		const userMsg: ChatMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content: input.trim(),
		};
		setMessages((m) => [...m, userMsg]);
		setInput("");

		setIsLoading(true);
		try {
			// Prepare messages for API (strip local ids)
			const apiMessages: APIChatMessage[] = [...messages, userMsg].map((m) => ({
				role: m.role,
				content: m.content,
			}));

			const resp = await sendChatMessage({
				session_id: sessionId,
				messages: apiMessages,
				dropped_question_id: null,
			});

			setMessages((m) => [
				...m,
				{
					id: crypto.randomUUID(),
					role: "assistant",
					content: resp.content,
				},
			]);
		} catch (e) {
			setMessages((m) => [
				...m,
				{
					id: crypto.randomUUID(),
					role: "assistant",
					content:
						"Sorry, I encountered an error talking to the tutor. Please ensure the backend on port 8001 is running and try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const quickStarts = [
		{
			label: "Find headings fast",
			text: "Show me a 3-step method for Matching Headings.",
			Icon: Sparkles,
		},
		{
			label: "T/F/NG tips",
			text: "How do I avoid traps in True/False/Not Given?",
			Icon: BookOpen,
		},
		{
			label: "Time management",
			text: "Give me a 20-min plan per slide with checkpoints.",
			Icon: History,
		},
	] as const;

	return (
		<div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
			{/* Header */}
			<div className="flex-shrink-0 px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-20">
				<div className="flex items-center gap-3.5">
					<div className="relative">
						<div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
						<div className="relative p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
							<Sparkles className="h-4 w-4 text-white" />
						</div>
					</div>
					<div>
						<h3 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base">Reading Mentor</h3>
						<div className="flex items-center gap-1.5">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
							</span>
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400">Online & Ready</p>
						</div>
					</div>
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex-1 overflow-hidden relative">
				<ScrollArea
					ref={listRef as any}
					className="h-full p-4 sm:p-6"
				>
					<div className="space-y-6 pb-4">
						{messages.map((m) => (
							<div
								key={m.id}
								className={cn(
									"flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
									m.role === "user" ? "justify-end" : "justify-start"
								)}
							>
								{/* Avatar for Assistant */}
								{m.role === "assistant" && (
									<div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
										<div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
											<Bot className="h-4 w-4 text-white" />
										</div>
									</div>
								)}

								<div
									className={cn(
										"flex flex-col max-w-[85%] sm:max-w-[75%]",
										m.role === "user" ? "items-end" : "items-start"
									)}
								>
									<div
										className={cn(
											"px-5 py-4 rounded-2xl shadow-sm text-[15px] leading-relaxed",
											m.role === "user"
												? "bg-blue-600 text-white rounded-tr-sm shadow-blue-500/10"
												: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm"
										)}
									>
										{(() => {
											if (m.role === "assistant") {
												const parsed = parseStructuredMatchingHeadings(m.content);
												if (parsed) {
													return <StructuredAiMessage data={parsed} />;
												}
											}
											return (
												<div className="chat-content whitespace-pre-wrap break-words">
													<ReactMarkdown
														components={{
															p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
															strong: ({ children }) => (
																<strong className={cn("font-semibold", m.role === "user" ? "text-white" : "text-indigo-600 dark:text-indigo-400")}>
																	{children}
																</strong>
															),
															ul: ({ children }) => <ul className="list-disc pl-4 mb-3 space-y-1.5">{children}</ul>,
															ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-1.5">{children}</ol>,
															li: ({ children }) => <li className="pl-1">{children}</li>,
														}}
													>
														{m.role === "assistant"
															? formatAssistantContent(m.content)
															: m.content}
													</ReactMarkdown>
												</div>
											);
										})()}
									</div>
								</div>

								{/* Avatar for User */}
								{m.role === "user" && (
									<div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mt-1 ring-2 ring-white dark:ring-slate-900">
										<UserIcon className="h-4 w-4 text-white" />
									</div>
								)}
							</div>
						))}

						{isLoading && (
							<div className="flex gap-4 justify-start animate-in fade-in duration-300">
								<div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
									<div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
										<Bot className="h-4 w-4 text-white" />
									</div>
								</div>
								<div className="bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-800">
									<div className="flex space-x-1.5 items-center h-full">
										<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
										<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
										<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
									</div>
								</div>
							</div>
						)}

						{messages.length === 0 && (
							<div className="py-8 px-4">
								<div className="text-center mb-8">
									<h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Welcome to IELTS Reading Mentor</h2>
									<p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
										Ask anything about IELTS Reading strategies, question types, or paste a paragraph to analyze.
									</p>
								</div>
								<div className="grid gap-3 sm:grid-cols-3 max-w-3xl mx-auto">
									{quickStarts.map(({ label, text, Icon }) => (
										<Button
											key={label}
											variant="outline"
											className="justify-start h-auto py-4 px-4 text-left bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
											onClick={() => {
												setInput(text);
												setTimeout(() => inputRef.current?.focus(), 0);
											}}
										>
											<div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
												<Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0.5">{label}</div>
												<div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{text}</div>
											</div>
										</Button>
									))}
								</div>
							</div>
						)}
					</div>
				</ScrollArea>
			</div>

			{/* Input Area */}
			<div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
				<div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-[24px] border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all duration-300 shadow-sm">
					<Textarea
						ref={inputRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask me anything..."
						className="min-h-[48px] max-h-[150px] border-none bg-transparent resize-none focus-visible:ring-0 p-3.5 text-[15px] shadow-none placeholder:text-slate-400"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								send();
							}
						}}
					/>
					<Button
						onClick={send}
						disabled={!input.trim()}
						size="icon"
						className={cn(
							"mb-1 mr-1 h-10 w-10 rounded-full transition-all duration-300",
							hasText
								? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transform hover:scale-105 active:scale-95"
								: "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
						)}
					>
						<Send className="h-4 w-4 ml-0.5" />
					</Button>
				</div>
				<div className="mt-3 text-[10px] text-center text-slate-400 font-medium opacity-60">
					This tutor may be inaccurate. Please verify important information.
				</div>
			</div>
		</div>
	);
}



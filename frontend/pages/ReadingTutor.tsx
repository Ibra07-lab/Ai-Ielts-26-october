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
		<div className="min-h-[calc(100vh-96px)] bg-[radial-gradient(ellipse_at_top,rgba(240,245,255,0.7),transparent_60%)]">
			<div className="mx-auto max-w-5xl px-4 pt-6 pb-0">
				{/* Main column */}
				<div className="relative">
					<ScrollArea
						ref={listRef as any}
						className="rounded-xl border bg-white/70 dark:bg-gray-900/40 dark:border-gray-800 backdrop-blur p-4 pb-28 h-[calc(100vh-160px)] reading-scroll"
					>
						<div className="space-y-1">
							{messages.map((m) => (
								<div
									key={m.id}
									className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
								>
									<div
										className={cn(
											"flex items-start gap-1 max-w-[80%]",
											m.role === "user" ? "flex-row-reverse" : "flex-row"
										)}
									>
										<div
											className={cn(
												"h-7 w-7 mt-1 rounded-full flex items-center justify-center text-white",
												m.role === "user"
													? "bg-gradient-to-br from-blue-500 to-blue-600"
													: "bg-gradient-to-br from-purple-400 to-purple-500"
											)}
										>
											{m.role === "user" ? (
												<UserIcon className="h-4 w-4" />
											) : (
												<Bot className="h-4 w-4" />
											)}
										</div>
										<div
											className={cn(
												"rounded-lg px-3 py-2 text-sm leading-4",
												m.role === "user"
													? "bg-blue-600 text-white"
													: "bg-muted/50 dark:bg-gray-800/70 border dark:border-gray-700 text-foreground"
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
																p: ({ children }) => <p className="my-1">{children}</p>,
																strong: ({ children }) => (
																	<strong className="text-amber-600 dark:text-amber-300 font-semibold">
																		{children}
																	</strong>
																),
																ol: ({ children }) => {
																	const renderListAsCards = false;
																	return renderListAsCards ? (
																		<ol className="list-cards">{children}</ol>
																	) : (
																		<ol>{children}</ol>
																	);
																},
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
								</div>
							))}
							{isLoading && (
								<div className="flex gap-1 items-start">
									<div className="h-7 w-7 mt-1 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-purple-400 to-purple-500">
										<Bot className="h-4 w-4" />
									</div>
									<div
										className={cn(
											"max-w-[80%] text-sm leading-4",
											"bg-muted/50 dark:bg-gray-800/70 border rounded-lg px-3 py-2 dark:border-gray-700"
										)}
									>
										<div className="flex items-center gap-1" aria-live="polite">
											<span className="sr-only">Thinking…</span>
											<div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" />
											<div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:150ms]" />
											<div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:300ms]" />
										</div>
									</div>
								</div>
							)}
							{messages.length === 0 && (
								<div className="py-4">
									<p className="text-sm text-muted-foreground text-center">
										Ask anything about IELTS Reading strategies, question types, or paste a paragraph to analyze.
									</p>
									<div className="mt-4 grid gap-3 sm:grid-cols-3">
										{quickStarts.map(({ label, text, Icon }) => (
											<Button
												key={label}
												variant="outline"
												className="justify-start h-auto py-3 px-3 text-left"
												onClick={() => {
													setInput(text);
													setTimeout(() => inputRef.current?.focus(), 0);
												}}
											>
												<Icon className="h-4 w-4 mr-2 text-primary" />
												<div>
													<div className="text-sm font-medium">{label}</div>
													<div className="text-xs text-muted-foreground">{text}</div>
												</div>
											</Button>
										))}
									</div>
								</div>
							)}
						</div>
					</ScrollArea>

					{/* Fixed Composer */}
					<div className="fixed inset-x-0 bottom-0 z-20 bg-white/90 dark:bg-gray-900/80 border-t">
						<div className="mx-auto max-w-5xl px-4 py-3 relative">
							<div className="relative">
								<Textarea
									ref={inputRef}
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Ask me anything..."
									className="pr-14 min-h-14 max-h-40 resize-none border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 focus-visible:ring-1 focus-visible:ring-blue-600"
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
									size="sm"
									aria-label="Send message"
									className={cn(
										"absolute right-2 bottom-2 h-9 w-9 rounded-full p-0 transition-colors",
										hasText
											? "bg-blue-600 hover:bg-blue-700 text-white"
											: "bg-gray-200 dark:bg-gray-700 text-gray-500"
									)}
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
							<div className="mt-2 text-[11px] text-muted-foreground">
								This tutor may be inaccurate. Please verify important information.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}



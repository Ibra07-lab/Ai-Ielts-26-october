import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, BookOpen, History, Bot, User as UserIcon, Clock, ArrowUp, ChevronRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage, streamChatMessage, generateSessionId, ChatMessage as APIChatMessage } from "@/services/chatApi";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";

type GreetingStyle = "short" | "medium" | "ultra";
const greetingStyles = ["short", "medium", "ultra"] as const;
const pickRandomGreetingStyle = (): GreetingStyle =>
	greetingStyles[Math.floor(Math.random() * greetingStyles.length)];

const getGreeting = (style: GreetingStyle): string => {
	switch (style) {
		case "short":
			return `Hi! 👋 I'm ALEX — your IELTS Reading Mentor. Ready to improve your reading skills, understand passages, and build confidence? Tell me what you want to work on today. 😊`;
		case "ultra":
			return `Hey there! 😊 I'm ALEX — your friendly IELTS Reading Mentor. No stress, no pressure — just a supportive guide to help you understand passages, fix mistakes, beat timing problems, and grow your confidence. Drop a question, share your answer, or tell me what you're struggling with. We'll improve your reading step by step. 💪📚`;
		default:
			return `Hello! 👋 I'm ALEX — your Personal IELTS Reading Mentor. I can help you with explanations of your answers, hints and clues, reading strategies, and practice. Drag a question here or tell me what you'd like to focus on today. 😊`;
	}
};

type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

export default function ReadingTutor() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [sessionId] = useState(() => generateSessionId());
	const listRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const hasText = input.trim().length > 0;
	const [streamingEnabled, setStreamingEnabled] = useState(true);

	const isLanding = messages.length === 0;

	const suggestions = [
		{ text: "Explain True/False/Not Given logic", icon: Sparkles },
		{ text: "How do I find headings faster?", icon: BookOpen },
		{ text: "Give me a practice passage", icon: Sparkles },
		{ text: "Typical Reading exam timing", icon: Clock },
	];

	type StructuredMatchingData = {
		context: string[];
		title: string;
		paragraphs: Array<{ label: string; text: string }>;
		headings: string[];
		cta: string | null;
	};

	const parseStructuredMatchingHeadings = (content: string): StructuredMatchingData | null => {
		const lines = content.split(/\r?\n/).map((l) => l.trimEnd());
		const text = lines.join("\n");
		const passageIdx = text.search(/(^|\n)Passage:/i);
		const headingsIdx = text.search(/(^|\n)List of Headings:/i);

		if (passageIdx === -1 || headingsIdx === -1 || headingsIdx < passageIdx) return null;

		const afterPassage = text.slice(passageIdx).replace(/^Passage:\s*/i, "");
		const firstNl = afterPassage.indexOf("\n");
		const title = (firstNl === -1 ? afterPassage : afterPassage.slice(0, firstNl)).trim();
		const passageBody = (firstNl === -1 ? "" : afterPassage.slice(firstNl + 1)).trim();
		const passageBodyOnly = passageBody.slice(0, passageBody.search(/(^|\n)List of Headings:/i)).trim();

		const paraMatches = [...passageBodyOnly.matchAll(/Paragraph\s+([A-Z])\s*\n([\s\S]*?)(?=\nParagraph\s+[A-Z]\s*\n|$)/gi)];
		let paragraphs: Array<{ label: string; text: string }> = [];
		if (paraMatches.length > 0) {
			paragraphs = paraMatches.map((m) => ({ label: m[1].toUpperCase(), text: m[2].trim() }));
		} else {
			const parts = passageBodyOnly.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).slice(0, 3);
			paragraphs = parts.map((p, idx) => ({ label: String.fromCharCode(65 + idx), text: p }));
		}

		const headingsSection = text.slice(headingsIdx).replace(/(^|\n)List of Headings:\s*/i, "");
		const ctaMatch = headingsSection.match(/(^|\n)(Match the Headings[\s\S]*?$)/i);
		const cta = ctaMatch ? ctaMatch[2].trim() : null;
		const headingsOnly = (ctaMatch ? headingsSection.slice(0, ctaMatch.index).trim() : headingsSection.trim());
		const headingLines = headingsOnly.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => l.replace(/^(?:[ivxlcdm]+\s*[).]|[-*]\s*)\s*/i, ""));
		const before = text.slice(0, passageIdx).trim();
		const context = before ? before.split(/\r?\n/).filter(Boolean) : [];

		if (!title || paragraphs.length === 0 || headingLines.length === 0) return null;
		return { context, title, paragraphs, headings: headingLines, cta };
	};

	const formatAssistantContent = (raw: string): string => {
		const collapsed = raw.replace(/\n{3,}/g, '\n\n');
		return collapsed.replace(/(Statements?|Questions?|True\/False\/Not Given|T\/F\/NG):\s*\n([\s\S]+)/i, (_, header, rest) => {
			const lines = rest.split('\n');
			let end = lines.findIndex((l: string) => !l.trim());
			if (end === -1) end = lines.length;
			const numbered = lines.slice(0, end).map((line: string, i: number) => {
				if (/^\s*([-*]|\d+\.)\s+/.test(line)) return line;
				if (!line.trim()) return line;
				return `${i + 1}. ${line.trim()}`;
			});
			return `${header}:\n` + [...numbered, ...lines.slice(end)].join('\n');
		});
	};

	function StructuredAiMessage({ data }: { data: StructuredMatchingData }) {
		return (
			<div className="space-y-3">
				{data.context.length > 0 && (
					<div className="ai-section text-xs text-muted-foreground">
						{data.context.map((line, idx) => <p key={idx} className={idx === 0 ? "" : "mt-1"}>{line}</p>)}
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
						{data.headings.map((h, idx) => <li key={idx}>{h}</li>)}
					</ol>
				</div>
				{data.cta && <div className="ai-cta">{data.cta}</div>}
			</div>
		);
	}

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [messages, isLoading]);

	const send = async (overrideInput?: string) => {
		const textToSend = (typeof overrideInput === 'string' ? overrideInput : input).trim();
		if (!textToSend || isLoading) return;

		const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: textToSend };

		if (messages.length === 0) {
			const greeting: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: getGreeting(pickRandomGreetingStyle()) };
			setMessages([greeting, userMsg]);
		} else {
			setMessages((m) => [...m, userMsg]);
		}

		setInput("");
		setIsLoading(true);
		try {
			const apiMessages: APIChatMessage[] = (messages.length === 0 ? [
				{ role: "assistant" as const, content: getGreeting(pickRandomGreetingStyle()) },
				{ role: "user" as const, content: textToSend }
			] : [...messages, userMsg]).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

			if (streamingEnabled) {
				const assistantId = crypto.randomUUID();
				setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);
				let buffer = "";
				let isStreaming = true;
				const flushInterval = setInterval(() => {
					if (buffer.length > 0) {
						const toFlush = buffer;
						buffer = "";
						setMessages((m) => m.map((msg) => msg.id === assistantId ? { ...msg, content: msg.content + toFlush } : msg));
					}
					if (!isStreaming) clearInterval(flushInterval);
				}, 80);

				try {
					await streamChatMessage({ session_id: sessionId, messages: apiMessages, dropped_question_id: null }, (chunk) => { buffer += chunk; });
				} finally {
					isStreaming = false;
					if (buffer.length > 0) setMessages((m) => m.map((msg) => msg.id === assistantId ? { ...msg, content: msg.content + buffer } : msg));
					clearInterval(flushInterval);
				}
			} else {
				const resp = await sendChatMessage({ session_id: sessionId, messages: apiMessages, dropped_question_id: null });
				setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: resp.content }]);
			}
		} catch (e) {
			setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="h-full flex flex-col relative overflow-hidden bg-premium-dark">
			<div className="absolute top-[-10%] left-[-5%] mesh-blob bg-indigo-500/10 dark:bg-indigo-500/5" />
			<div className="absolute bottom-[-10%] right-[-5%] mesh-blob bg-teal-500/10 dark:bg-teal-500/5" />

			<div className={cn(
				"absolute top-[10%] right-[10%] pointer-events-none rotate-12 select-none transition-opacity duration-700",
				isLanding ? "opacity-[0.02] dark:opacity-[0.03]" : "opacity-0"
			)}>
				<BookOpen className="w-[400px] h-[400px]" />
			</div>

			<div className="flex-1 flex flex-col relative z-10 max-w-4xl mx-auto w-full h-full">

				<div className={cn(
					"flex-1 overflow-hidden transition-all duration-1000 ease-in-out flex flex-col",
					isLanding ? "max-h-0 opacity-0" : "opacity-100"
				)}>
					<ScrollArea ref={listRef as any} className="flex-1 px-4 sm:px-6">
						<div className="space-y-6 py-6 mx-auto w-full">
							{messages.map((m) => (
								<div key={m.id} className={cn("flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500", m.role === "user" ? "justify-end" : "justify-start")}>
									{m.role === "assistant" && <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1 ring-1 ring-black/5"><div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5"><Bot className="h-3.5 w-3.5 text-white" /></div></div>}
									<div className={cn("flex flex-col max-w-[85%] sm:max-w-[85%]", m.role === "user" ? "items-end" : "items-start")}>
										<div className={cn("px-5 py-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[15px] leading-relaxed", m.role === "user" ? "bg-blue-600 text-white rounded-tr-sm shadow-blue-500/10" : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm")}>
											{(() => {
												if (m.role === "assistant") {
													const parsed = parseStructuredMatchingHeadings(m.content);
													if (parsed) return <StructuredAiMessage data={parsed} />;
												}
												return (
													<div className="chat-content whitespace-pre-wrap break-words">
														<ReactMarkdown components={{ p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>, ul: ({ children }) => <ul className="list-disc pl-4 mb-3 space-y-1.5">{children}</ul>, ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-1.5">{children}</ol>, li: ({ children }) => <li className="pl-1">{children}</li> }}>
															{m.role === "assistant" ? formatAssistantContent(m.content) : m.content}
														</ReactMarkdown>
													</div>
												);
											})()}
										</div>
									</div>
									{m.role === "user" && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md mt-1 ring-2 ring-white"><UserIcon className="h-3.5 w-3.5 text-white" /></div>}
								</div>
							))}
							{isLoading && <div className="flex gap-4 justify-start animate-in fade-in duration-300"><div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm"><div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5"><Bot className="h-3.5 w-3.5 text-white" /></div></div><div className="bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100"><div className="flex space-x-1.5 items-center h-full"><div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div></div></div></div>}
							<div className="h-4" />
						</div>
					</ScrollArea>
				</div>

				<div className={cn("transition-all duration-700 ease-in-out", isLanding ? "flex-1" : "h-0")} />

				<div className={cn(
					"space-y-6 text-center px-4 transition-all duration-700 ease-in-out overflow-hidden flex-shrink-0",
					isLanding ? "max-h-[500px] opacity-100 mb-10" : "max-h-0 opacity-0 mb-0"
				)}>
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
						<Sparkles className="h-3 w-3 fill-current" />
						AI Reading Mentor
					</div>
					<h1 className="text-5xl sm:text-6xl font-black text-[#111827] dark:text-white tracking-tight leading-[1.1] drop-shadow-sm">
						What can I <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">help</span> with?
					</h1>
				</div>

				<div className={cn(
					"w-full px-4 transition-all duration-700 ease-in-out z-20 flex-shrink-0",
					!isLanding && "pb-6 pt-2"
				)}>
					<div className="relative group max-w-xl mx-auto w-full">
						<div className={cn(
							"absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] blur transition duration-1000",
							isLanding ? "opacity-10 group-focus-within:opacity-20" : "opacity-0"
						)}></div>
						<div className={cn(
							"relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white dark:border-slate-800 transition-all flex items-center overflow-hidden",
							isLanding ? "rounded-[28px] p-2 pr-4 min-h-[72px]" : "rounded-[24px] p-1.5 pr-3 min-h-[56px] border border-slate-700/50"
						)}>
							<Input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder={isLanding ? "Ask ALEX anything about IELTS Reading..." : "Ask a follow-up question..."}
								className={cn(
									"border-none shadow-none focus-visible:ring-0 bg-transparent h-auto dark:text-white dark:placeholder:text-slate-500 font-medium transition-all",
									isLanding ? "text-lg py-5 pl-7" : "text-base py-3 pl-4"
								)}
								onKeyDown={(e) => e.key === "Enter" && send()}
							/>
							<div className="flex items-center gap-2.5">
								<Button
									size="icon"
									className={cn(
										"rounded-full transition-all duration-500",
										input.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 scale-100' : 'bg-gray-100 dark:bg-slate-800 text-gray-300 scale-95 opacity-50',
										isLanding ? "h-12 w-12" : "h-9 w-9"
									)}
									disabled={!input.trim()}
									onClick={() => send()}
								>
									{isLanding ? <ArrowUp className="h-6 w-6" /> : <Send className="h-4 w-4" />}
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className={cn(
					"flex flex-col items-center gap-6 mt-10 px-4 transition-all duration-700 ease-in-out overflow-hidden flex-shrink-0",
					isLanding ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 mt-0"
				)}>
					<p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em]">Suggested topics</p>
					<div className="flex flex-wrap justify-center gap-4">
						{suggestions.map((item, i) => (
							<button key={i} onClick={() => send(item.text)} className="search-chip group">
								<div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
									<item.icon className="h-4 w-4" />
								</div>
								<span className="font-semibold text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white">{item.text}</span>
								<ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all text-blue-500" />
							</button>
						))}
					</div>
				</div>

				<div className={cn("transition-all duration-700 ease-in-out", isLanding ? "flex-1" : "h-0")} />
			</div>
		</div>
	);
}

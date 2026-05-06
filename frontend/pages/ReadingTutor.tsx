import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, BookOpen, History, Bot, User as UserIcon, Clock, ArrowUp, ChevronRight, MessageSquare, Target, Trophy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage, streamChatMessage, generateSessionId, startTrainingSession, ChatMessage as APIChatMessage } from "@/services/chatApi";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from "../contexts/UserContext";
import backend from "@/backend";



type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

type TrainingState = {
	skill: string;
	accuracy: number;
	totalAttempted: number;
	correct: number;
	studentId: string;
};

type SessionResult = {
	skill: string;
	mistake_pattern: string;
	diagnostic_score: number;
	drill_score: number;
	simulation_score: number;
	total_correct: number;
	total_questions: number;
	accuracy: number;
	recommendation: string;
};

const SKILL_LABELS: Record<string, string> = {
	tfng: "True / False / Not Given",
	matching_headings: "Matching Headings",
	multiple_choice: "Multiple Choice",
};

export default function ReadingTutor() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [usageLimits, setUsageLimits] = useState<{ readingCreditsUsed: number; readingCreditsLimit: number; readingCreditsRemaining: number } | null>(null);
	const [sessionId] = useState(() => generateSessionId());
	const listRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const hasText = input.trim().length > 0;
	const [streamingEnabled, setStreamingEnabled] = useState(true);

	// ========== TRAINING SESSION STATE ==========
	const location = useLocation();
	const trainingState = location.state as TrainingState | undefined;
	const isTrainingSession = !!trainingState?.skill;
	const [isTrainingInit, setIsTrainingInit] = useState(false);
	const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
	const { user } = useUser();

	const fetchUsage = async () => {
		if (!user?.id) return;
		try {
			const limits = await backend.ielts.getEssayLimits(user.id);
			setUsageLimits({
				readingCreditsUsed: limits.readingCreditsUsed,
				readingCreditsLimit: limits.readingCreditsLimit,
				readingCreditsRemaining: limits.readingCreditsRemaining,
			});
		} catch (err) {
			console.error("Failed to fetch usage limits:", err);
		}
	};

	useEffect(() => {
		fetchUsage();
	}, [user?.id]);

	// Auto-start training session when navigated with training state
	useEffect(() => {
		if (!isTrainingSession || messages.length > 0) return;
		const init = async () => {
			setIsTrainingInit(true);
			try {
				const response = await startTrainingSession({
					userId: user?.id || "",
					session_id: sessionId,
					skill: trainingState.skill,
					student_id: trainingState.studentId,
					accuracy: trainingState.accuracy,
					total_attempted: trainingState.totalAttempted,
					correct: trainingState.correct,
					recent_errors: [],
				});
				setMessages([{ id: crypto.randomUUID(), role: "assistant", content: response.first_message }]);
			} catch (err) {
				console.error("Failed to start training:", err);
				setMessages([{ id: crypto.randomUUID(), role: "assistant", content: "Sorry, I couldn't start the training session. Please make sure the AI server is running and try again." }]);
			} finally {
				setIsTrainingInit(false);
			}
		};
		init();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Parse :::SESSION_RESULT::: from AI responses
	const parseSessionResult = (content: string): SessionResult | null => {
		const match = content.match(/:::SESSION_RESULT\s*\n?([\s\S]*?)\n?:::/);
		if (!match) return null;
		try { return JSON.parse(match[1].trim()); } catch { return null; }
	};

	const stripResultBlock = (content: string): string =>
		content.replace(/:::SESSION_RESULT[\s\S]*?:::/g, "").trim();
	// ========== END TRAINING STATE ==========

	const isLanding = messages.length === 0 && !isTrainingSession;

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

	// Sanitize AI response: trim and collapse excessive newlines
	const sanitizeContent = (raw: string): string => {
		let processed = raw.trim();
		// Collapse 3+ newlines to 2
		processed = processed.replace(/\n{3,}/g, '\n\n');
		// Collapse double newlines to single (markdown <p> handles spacing)
		processed = processed.replace(/\n\n/g, '\n');
		// Restore double newlines before bold headings (** at line start)
		processed = processed.replace(/\n(\*\*[A-Z])/g, '\n\n$1');
		return processed;
	};

	const formatAssistantContent = (raw: string): string => {
		// First sanitize the content
		let collapsed = sanitizeContent(raw);

		// Fix loose lists: "1. \n Text" -> "1. Text"
		collapsed = collapsed.replace(/^(\d+\.|[-*])\s+\n\s*/gm, '$1 ');

		// Remove blank lines BEFORE list items to keep lists compact
		collapsed = collapsed.replace(/\n\s*\n(?=\s*(?:\d+\.|[-*]|•)\s)/g, '\n');

		// Remove blank lines BETWEEN consecutive list items
		collapsed = collapsed.replace(/(\n\s*(?:\d+\.|[-*]|•)\s[^\n]+)\n\s*\n(?=\s*(?:\d+\.|[-*]|•)\s)/g, '$1\n');

		// The training prompt outputs highly structured text that doesn't need aggressive numbering.
		if (isTrainingSession) {
			return collapsed;
		}

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

		setMessages((m) => [...m, userMsg]);

		setInput("");
		setIsLoading(true);
		try {
			const apiMessages: APIChatMessage[] = [...messages, userMsg].map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

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
					await streamChatMessage({ userId: user?.id || "", session_id: sessionId, messages: apiMessages, dropped_question_id: null }, (chunk) => { buffer += chunk; });
				} finally {
					isStreaming = false;
					if (buffer.length > 0) setMessages((m) => m.map((msg) => msg.id === assistantId ? { ...msg, content: msg.content + buffer } : msg));
					clearInterval(flushInterval);
				}
			} else {
				const resp = await sendChatMessage({ userId: user?.id || "", session_id: sessionId, messages: apiMessages, dropped_question_id: null });
				setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: resp.content }]);
			}
			// Refresh credits after message
			fetchUsage();
		} catch (e) {
			setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
		} finally {
			setIsLoading(false);
			// Check for session result after streaming completes
			if (isTrainingSession) {
				setMessages((prev) => {
					const last = prev[prev.length - 1];
					if (last?.role === "assistant") {
						const result = parseSessionResult(last.content);
						if (result) setSessionResult(result);
					}
					return prev;
				});
			}
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

				{/* Training Mode Banner */}
				{isTrainingSession && (
					<div className="px-4 pt-3 pb-1 flex-shrink-0">
						<div className="flex items-center gap-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/30 dark:border-indigo-700/30 rounded-xl px-4 py-2.5">
							<Target className="h-4 w-4 text-indigo-500" />
							<span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
								{SKILL_LABELS[trainingState?.skill || ""] || trainingState?.skill} Training Session
							</span>
							<span className="text-xs text-indigo-500/70 dark:text-indigo-400/60">
								• {trainingState?.accuracy}% accuracy • {trainingState?.correct}/{trainingState?.totalAttempted} correct
							</span>
							<div className="ml-auto">
								{usageLimits && (
									<Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-700/50">
										{usageLimits.readingCreditsLimit === -1 ? (
											"Unlimited Credits"
										) : (
											`${usageLimits.readingCreditsRemaining} credits remaining`
										)}
									</Badge>
								)}
							</div>
						</div>
					</div>
				)}

				{!isTrainingSession && (
					<div className="px-4 pt-3 pb-1 flex-shrink-0 flex justify-end">
						{usageLimits && (
							<Badge variant="secondary" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400">
								{usageLimits.readingCreditsLimit === -1 ? (
									"Unlimited Credits"
								) : (
									`${usageLimits.readingCreditsRemaining} credits remaining`
								)}
							</Badge>
						)}
					</div>
				)}

				<div className={cn(
					"flex-1 overflow-hidden transition-all duration-1000 ease-in-out flex flex-col",
					isLanding ? "max-h-0 opacity-0" : "opacity-100"
				)}>
					<ScrollArea ref={listRef as any} className="flex-1 px-4 sm:px-6">
						<div className="space-y-6 py-6 mx-auto w-full">
							{messages.map((m) => (
								(m.role === "user" || (m.role === "assistant" && m.content.trim())) ? (
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
														<div className="chat-content break-words">
															<ReactMarkdown components={{ p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>, ul: ({ children }) => <ul className="list-disc pl-4 mb-3 space-y-1.5">{children}</ul>, ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-1.5">{children}</ol>, li: ({ children }) => <li className="pl-1">{children}</li> }}>
																{m.role === "assistant" ? stripResultBlock(formatAssistantContent(m.content)) : m.content}
															</ReactMarkdown>
														</div>
													);
												})()}
											</div>
										</div>
										{m.role === "user" && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md mt-1 ring-2 ring-white"><UserIcon className="h-3.5 w-3.5 text-white" /></div>}
									</div>
								) : null
							))}
							{isLoading && (messages.length === 0 || messages[messages.length - 1].role !== "assistant" || !messages[messages.length - 1].content.trim()) && (
								<div className="flex gap-4 justify-start animate-in fade-in duration-300">
									<div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
										<div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
											<Bot className="h-3.5 w-3.5 text-white" />
										</div>
									</div>
									<div className="bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100">
										<div className="flex space-x-1.5 items-center h-full">
											<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
											<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
											<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
										</div>
									</div>
								</div>
							)}
							<div className="h-4" />
						</div>
					</ScrollArea>
				</div>

				<div className={cn("transition-all duration-700 ease-in-out", isLanding ? "flex-[0.5] sm:flex-[1.5]" : "h-0")} />

				<div className={cn(
					"space-y-3 sm:space-y-6 text-center px-4 transition-all duration-700 ease-in-out overflow-hidden flex-shrink-0",
					isLanding ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 mb-0"
				)}>
					<div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-50/80 dark:bg-slate-800 border border-blue-100/50 dark:border-slate-700 text-blue-600 dark:text-blue-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
						<Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
						AI Reading Mentor
					</div>
					<h1 className="text-2xl sm:text-5xl font-black text-[#111827] dark:text-white tracking-tight leading-[1.1] drop-shadow-sm">
						What can I help with?
					</h1>
				</div>

				{/* Session Result Card (Training Mode) */}
				{sessionResult && (
					<div className="px-4 pb-3 flex-shrink-0 animate-in fade-in slide-in-from-bottom-4">
						<div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5 space-y-3">
							<div className="flex items-center gap-2">
								<Trophy className="h-5 w-5 text-amber-400" />
								<h2 className="text-lg font-bold text-white">Session Complete</h2>
							</div>
							<div className="grid grid-cols-3 gap-3">
								<div className="bg-slate-800/50 rounded-xl p-2.5 text-center">
									<p className="text-[10px] text-slate-400 mb-0.5">Diagnostic</p>
									<p className="text-xl font-bold text-emerald-400">{sessionResult.diagnostic_score}/3</p>
								</div>
								<div className="bg-slate-800/50 rounded-xl p-2.5 text-center">
									<p className="text-[10px] text-slate-400 mb-0.5">Drill</p>
									<p className="text-xl font-bold text-blue-400">{sessionResult.drill_score}/5</p>
								</div>
								<div className="bg-slate-800/50 rounded-xl p-2.5 text-center">
									<p className="text-[10px] text-slate-400 mb-0.5">Simulation</p>
									<p className="text-xl font-bold text-purple-400">{sessionResult.simulation_score}/4</p>
								</div>
							</div>
							<div className="flex items-center justify-between pt-2 border-t border-slate-700">
								<div>
									<p className="text-xs text-slate-400">Pattern: <span className="text-white">{sessionResult.mistake_pattern}</span></p>
									<p className="text-xs text-slate-400">Overall: <span className="text-white font-bold">{sessionResult.total_correct}/{sessionResult.total_questions} ({sessionResult.accuracy}%)</span></p>
								</div>
							</div>
							{sessionResult.recommendation && (
								<p className="text-xs text-slate-300 bg-slate-800/30 rounded-lg p-2.5 border-l-2 border-blue-500">💡 {sessionResult.recommendation}</p>
							)}
						</div>
					</div>
				)}

				<div className={cn("transition-all duration-700 ease-in-out", isLanding ? "flex-[0.5] sm:flex-1" : "h-0")} />

				{/* Suggested Topics - Moved above the input box */}
				<div className={cn(
					"w-full max-w-2xl mx-auto px-4 transition-all duration-700 ease-in-out overflow-hidden flex-shrink-0 mb-2 sm:mb-4",
					isLanding ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 mb-0"
				)}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
						{suggestions.map((item, i) => (
							<button key={i} onClick={() => send(item.text)} className="flex items-center sm:items-start gap-2.5 sm:gap-3 p-2.5 sm:p-4 text-left rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md cursor-pointer group">
								<div className="sm:mt-0.5 p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
									<item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</div>
								<div className="flex-1">
									<span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-tight block">{item.text}</span>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className={cn(
					"w-full px-4 transition-all duration-700 ease-in-out z-20 flex-shrink-0",
					!isLanding && "pb-4 sm:pb-6 pt-2"
				)}>
					<div className="relative group max-w-2xl mx-auto w-full mb-2 sm:mb-6">
						<div className={cn(
							"relative bg-white dark:bg-slate-800/90 backdrop-blur-xl shadow-lg border border-slate-200 dark:border-slate-700/80 transition-all flex items-center overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50",
							isLanding ? "rounded-3xl sm:rounded-[32px] p-1.5 sm:p-2 pr-2 sm:pr-3 min-h-[52px] sm:min-h-[72px]" : "rounded-3xl p-1.5 pr-2 min-h-[44px] sm:min-h-[56px]"
						)}>
							<Input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder={isLanding ? "Message AI Mentor..." : "Ask a follow-up..."}
								className={cn(
									"border-none shadow-none focus-visible:ring-0 bg-transparent h-auto dark:text-white dark:placeholder:text-slate-400 font-medium transition-all w-full",
									isLanding ? "text-[14px] sm:text-lg py-2.5 sm:py-4 pl-3 sm:pl-5" : "text-[14px] sm:text-base py-2 sm:py-3 pl-3 sm:pl-4"
								)}
								onKeyDown={(e) => e.key === "Enter" && send()}
							/>
							<div className="flex items-center gap-2">
								<Button
									size="icon"
									className={cn(
										"rounded-full transition-all duration-300 flex-shrink-0 flex items-center justify-center",
										input.trim() ? 'bg-indigo-600 dark:bg-white text-white dark:text-slate-900 shadow-md scale-100 hover:opacity-90' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 scale-95 opacity-50',
										isLanding ? "h-9 w-9 sm:h-12 sm:w-12" : "h-7 w-7 sm:h-9 sm:w-9"
									)}
									disabled={!input.trim()}
									onClick={() => send()}
								>
									{isLanding ? <ArrowUp className="h-4 w-4 sm:h-6 sm:w-6" /> : <Send className="h-3 w-3 sm:h-4 sm:w-4" />}
								</Button>
							</div>
						</div>
						{isLanding && (
							<p className="text-center text-[10px] sm:text-[11px] text-slate-400/80 mt-2 pb-1 w-full">
								AI can make mistakes. Check important info.
							</p>
						)}
					</div>
				</div>

				<div className={cn("transition-all duration-700 ease-in-out", isLanding ? "h-1 sm:h-2" : "h-0")} />
			</div>
		</div>
	);
}

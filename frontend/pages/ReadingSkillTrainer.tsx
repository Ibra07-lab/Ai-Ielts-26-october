import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Send,
    ArrowLeft,
    Bot,
    User as UserIcon,
    Target,
    Trophy,
    ArrowUp,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    startTrainingSession,
    streamChatMessage,
    generateSessionId,
    ChatMessage,
} from '@/services/chatApi';
import ReactMarkdown from 'react-markdown';

// Types
type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
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

type LocationState = {
    skill: string;
    accuracy: number;
    totalAttempted: number;
    correct: number;
    studentId: string;
};

// Parse :::SESSION_RESULT { json } ::: from AI message
function parseSessionResult(content: string): SessionResult | null {
    const match = content.match(/:::SESSION_RESULT\s*\n?([\s\S]*?)\n?:::/);
    if (!match) return null;
    try {
        return JSON.parse(match[1].trim());
    } catch {
        return null;
    }
}

// Remove the :::SESSION_RESULT::: block from display text
function stripResultBlock(content: string): string {
    return content.replace(/:::SESSION_RESULT[\s\S]*?:::/g, '').trim();
}

const SKILL_LABELS: Record<string, string> = {
    tfng: 'True / False / Not Given',
    matching_headings: 'Matching Headings',
    multiple_choice: 'Multiple Choice',
    short_answer: 'Short Answer',
};

export default function ReadingSkillTrainer() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | undefined;

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => generateSessionId());
    const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const listRef = useRef<HTMLDivElement | null>(null);

    const skill = state?.skill || 'tfng';
    const skillLabel = SKILL_LABELS[skill] || skill;

    // Initialize training session on mount
    useEffect(() => {
        if (!state) return;

        const init = async () => {
            setIsInitializing(true);
            try {
                const response = await startTrainingSession({
                    session_id: sessionId,
                    skill: state.skill,
                    student_id: state.studentId,
                    accuracy: state.accuracy,
                    total_attempted: state.totalAttempted,
                    correct: state.correct,
                    recent_errors: [],
                });

                setMessages([
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: response.first_message,
                    },
                ]);
            } catch (error) {
                console.error('Failed to start training session:', error);
                setMessages([
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content:
                            'Sorry, I could not start the training session. Please make sure the AI server is running and try again.',
                    },
                ]);
            } finally {
                setIsInitializing(false);
            }
        };

        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-scroll
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, [messages, isLoading]);

    const send = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
        };
        setMessages((m) => [...m, userMsg]);
        setInput('');
        setIsLoading(true);

        const assistantId = crypto.randomUUID();
        setMessages((m) => [...m, { id: assistantId, role: 'assistant', content: '' }]);

        try {
            const apiMessages: ChatMessage[] = [...messages, userMsg].map((m) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
            }));

            let buffer = '';
            let isStreaming = true;
            const flushInterval = setInterval(() => {
                if (buffer.length > 0) {
                    const toFlush = buffer;
                    buffer = '';
                    setMessages((m) =>
                        m.map((msg) =>
                            msg.id === assistantId ? { ...msg, content: msg.content + toFlush } : msg
                        )
                    );
                }
                if (!isStreaming) clearInterval(flushInterval);
            }, 80);

            try {
                await streamChatMessage(
                    { session_id: sessionId, messages: apiMessages, dropped_question_id: null },
                    (chunk) => {
                        buffer += chunk;
                    }
                );
            } finally {
                isStreaming = false;
                if (buffer.length > 0) {
                    setMessages((m) =>
                        m.map((msg) =>
                            msg.id === assistantId ? { ...msg, content: msg.content + buffer } : msg
                        )
                    );
                }
                clearInterval(flushInterval);
            }

            // Check for session result in the final message
            setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === 'assistant') {
                    const result = parseSessionResult(lastMsg.content);
                    if (result) {
                        setSessionResult(result);
                    }
                }
                return prev;
            });
        } catch {
            setMessages((m) =>
                m.map((msg) =>
                    msg.id === assistantId
                        ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    // No state = navigated directly, redirect
    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center space-y-4">
                    <p className="text-slate-400 text-lg">No training context provided.</p>
                    <Button onClick={() => navigate('/progress')} variant="outline">
                        Go to Progress
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-400" />
                                {skillLabel} Training
                            </h1>
                            <p className="text-xs text-slate-500">
                                Current accuracy: {state.accuracy}% • {state.correct}/{state.totalAttempted}{' '}
                                correct
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden max-w-4xl mx-auto w-full">
                <ScrollArea ref={listRef as any} className="h-full px-4">
                    <div className="space-y-6 py-6">
                        {isInitializing && (
                            <div className="flex gap-4 justify-start animate-in fade-in">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Starting training session...
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((m) =>
                            m.role === 'user' || (m.role === 'assistant' && m.content.trim()) ? (
                                <div
                                    key={m.id}
                                    className={cn(
                                        'flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500',
                                        m.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {m.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            'flex flex-col max-w-[85%]',
                                            m.role === 'user' ? 'items-end' : 'items-start'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'px-5 py-4 rounded-2xl text-[15px] leading-relaxed',
                                                m.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                                            )}
                                        >
                                            <div className="chat-content whitespace-pre-wrap break-words">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        ul: ({ children }) => (
                                                            <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>
                                                        ),
                                                        ol: ({ children }) => (
                                                            <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>
                                                        ),
                                                        li: ({ children }) => <li className="pl-1">{children}</li>,
                                                        strong: ({ children }) => (
                                                            <strong className="font-semibold text-white">{children}</strong>
                                                        ),
                                                    }}
                                                >
                                                    {m.role === 'assistant'
                                                        ? stripResultBlock(m.content)
                                                        : m.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                    {m.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                                            <UserIcon className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ) : null
                        )}

                        {/* Loading dots */}
                        {isLoading &&
                            (messages.length === 0 ||
                                messages[messages.length - 1].role !== 'assistant' ||
                                !messages[messages.length - 1].content.trim()) && (
                                <div className="flex gap-4 justify-start animate-in fade-in">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="bg-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-800">
                                        <div className="flex space-x-1.5">
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

            {/* Session Result Card */}
            {sessionResult && (
                <div className="max-w-4xl mx-auto w-full px-4 pb-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3">
                            <Trophy className="h-6 w-6 text-amber-400" />
                            <h2 className="text-xl font-bold">Session Complete</h2>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <p className="text-xs text-slate-400 mb-1">Diagnostic</p>
                                <p className="text-2xl font-bold text-emerald-400">
                                    {sessionResult.diagnostic_score}/3
                                </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <p className="text-xs text-slate-400 mb-1">Drill</p>
                                <p className="text-2xl font-bold text-blue-400">
                                    {sessionResult.drill_score}/5
                                </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <p className="text-xs text-slate-400 mb-1">Simulation</p>
                                <p className="text-2xl font-bold text-purple-400">
                                    {sessionResult.simulation_score}/4
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Pattern: <span className="text-white">{sessionResult.mistake_pattern}</span>
                                </p>
                                <p className="text-sm text-slate-400">
                                    Overall:{' '}
                                    <span className="text-white font-bold">
                                        {sessionResult.total_correct}/{sessionResult.total_questions} (
                                        {sessionResult.accuracy}%)
                                    </span>
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate('/progress')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Back to Progress
                            </Button>
                        </div>

                        {sessionResult.recommendation && (
                            <p className="text-sm text-slate-300 bg-slate-800/30 rounded-lg p-3 border-l-2 border-blue-500">
                                💡 {sessionResult.recommendation}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Input Area */}
            {!sessionResult && (
                <div className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto px-4 py-3">
                        <div className="relative flex items-center gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your answer..."
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-3 pr-12"
                                onKeyDown={(e) => e.key === 'Enter' && send()}
                                disabled={isLoading || isInitializing}
                            />
                            <Button
                                size="icon"
                                className={cn(
                                    'rounded-full absolute right-1',
                                    input.trim()
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-slate-800 text-slate-500'
                                )}
                                disabled={!input.trim() || isLoading || isInitializing}
                                onClick={send}
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

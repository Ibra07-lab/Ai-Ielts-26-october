import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, Target, CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { sendChatMessage, streamChatMessage, generateSessionId, ChatMessage } from '@/services/chatApi';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';
import { useUser } from '@/contexts/UserContext';


const ExerciseCard = ({ content, onAnswer }: { content: string, onAnswer: (ans: string) => void }) => {
  const lines = content.split('\n');
  let header = '';
  let questionProgress = '';
  let bodyLines: string[] = [];
  let options: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Check if it's an option: e.g. "A) ...", "- A) ...", "1. ..."
    if (/^[A-F1-6][)\.]\s+/.test(trimmed) || /^[-*]\s*[A-F1-6][)\.]\s+/.test(trimmed)) {
      options.push(trimmed.replace(/^[-*]\s*/, ''));
    } else if (/phase/i.test(trimmed) && trimmed.length < 50) {
      header = trimmed;
    } else if (/(?:question|test)\s+\d+/i.test(trimmed) && trimmed.length < 50) {
      questionProgress = trimmed;
    } else {
      bodyLines.push(trimmed);
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/40 rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      {(header || questionProgress) && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/10 px-6 py-4 border-b border-indigo-100/50 dark:border-indigo-900/40 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">{header || 'Exercise'}</span>
          </div>
          {questionProgress && (
            <span className="text-[13px] font-bold text-indigo-600 dark:text-indigo-300 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm border border-indigo-100/50 dark:border-indigo-800/50">{questionProgress}</span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="p-6 md:p-8">
        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <ReactMarkdown>{bodyLines.join('\n\n')}</ReactMarkdown>
        </div>
        
        {/* Options */}
        {options.length > 0 && (
          <div className="mt-8 flex flex-col gap-3">
            {options.map((opt, i) => {
              const match = opt.match(/^([A-F1-6])[)\.]\s+(.*)/);
              const letter = match ? match[1] : '';
              const text = match ? match[2] : opt;
              
              return (
                <button 
                  key={i} 
                  onClick={() => onAnswer(opt)}
                  className="group flex flex-row items-start text-left p-4 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:shadow-md transition-all duration-200 active:scale-[0.99]"
                >
                  {letter && (
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center mr-4 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300 transition-colors shadow-sm">
                      {letter}
                    </span>
                  )}
                  <span className="font-semibold text-slate-700 dark:text-slate-200 mt-1 leading-snug">{text}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackCard = ({ content }: { content: string }) => {
  const isCorrect = content.trim().startsWith('Correct.');
  const borderColor = isCorrect ? 'border-emerald-500' : 'border-rose-500';
  const bgColor = isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-rose-50 dark:bg-rose-900/10';
  const iconColor = isCorrect ? 'text-emerald-500' : 'text-rose-500';
  
  // Custom styling for the child markdown elements in feedback
  const renderers = {
    p: ({ children }: any) => <p className="mb-4 last:mb-0 leading-relaxed text-[15px]">{children}</p>,
    strong: ({ children }: any) => {
      const text = String(children);
      // Give rule headers some pizzazz
      if (text.toLowerCase().includes('wrong') || text.toLowerCase().includes('correct') || text.toLowerCase().includes('rule')) {
        return <strong className="block text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-5 mb-1">{children}</strong>;
      }
      return <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>;
    }
  };

  return (
    <div className={`border-t-4 ${borderColor} ${bgColor} rounded-2xl p-6 shadow-sm my-5 animate-in slide-in-from-top-4 duration-500 flex flex-col gap-2`}>
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? <CheckCircle2 className={`w-5 h-5 ${iconColor}`} /> : <Target className={`w-5 h-5 ${iconColor}`} />}
        <span className={`font-bold ${iconColor} uppercase tracking-wider text-[13px]`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </div>
      <div className="text-slate-800 dark:text-slate-200">
         <ReactMarkdown components={renderers}>{content.replace(/^(In)?Correct\.?\s*\n*/i, '')}</ReactMarkdown>
      </div>
    </div>
  );
};

interface ReadingTutorChatProps {
  droppedQuestionId?: string | null;
  streamingEnabled?: boolean;
}

export default function ReadingTutorChat({ droppedQuestionId, streamingEnabled = true }: ReadingTutorChatProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session management
  const [sessionId] = useState(() => generateSessionId());

  // Chat state
  const [messages, setMessages] = useState<(ChatMessage & { id: string; timestamp: Date })[]>([]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sanitize AI response: trim and collapse excessive newlines
  const sanitizeContent = (raw: string): string => {
    // Trim leading/trailing whitespace
    let processed = raw.trim();
    // Collapse 3+ consecutive newlines to max 2
    processed = processed.replace(/\n{3,}/g, '\n\n');
    return processed;
  };

  // Format assistant messages: collapse excessive blank lines and auto-number "Statements:" blocks
  const formatAssistantContent = (raw: string): string => {
    // First sanitize the content
    let processed = sanitizeContent(raw);

    // Fix loose lists: "1. \n Text" -> "1. Text"
    processed = processed.replace(/^(\d+\.|[-*])\s+\n\s*/gm, '$1 ');

    // Remove blank lines BEFORE list items to keep lists compact
    processed = processed.replace(/\n\s*\n(?=\s*(?:\d+\.|[-*]|•)\s)/g, '\n');

    // Remove blank lines BETWEEN consecutive list items (numbered or bullets)
    processed = processed.replace(/(\n\s*(?:\d+\.|[-*]|•)\s[^\n]+)\n\s*\n(?=\s*(?:\d+\.|[-*]|•)\s)/g, '$1\n');

    // Auto-number lines directly after a "Statements:" header until a blank line
    return processed.replace(/(Statements?:\s*\n)([\s\S]+)/i, (_, header: string, rest: string) => {
      const lines = rest.split('\n');
      let end = lines.findIndex(l => !l.trim());
      if (end === -1) end = lines.length;
      const numbered = lines.slice(0, end).map((line, i) => {
        // Keep existing bullets/numbers as-is
        if (/^\s*([-*]|\d+\.)\s+/.test(line)) return line;
        if (!line.trim()) return line;
        return `${i + 1}. ${line.trim()}`;
      });
      const remaining = lines.slice(end);
      return header + [...numbered, ...remaining].join('\n');
    });
  };

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle dropped question
  useEffect(() => {
    if (droppedQuestionId) {
      toast({
        title: 'Question Added',
        description: 'I can see the question you selected. How can I help you with it?',
      });
    }
  }, [droppedQuestionId, toast]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = typeof overrideInput === 'string' ? overrideInput : input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage & { id: string; timestamp: Date } = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare messages for API (without id and timestamp)
      const apiMessages: ChatMessage[] = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      if (streamingEnabled) {
        // True streaming: append chunks as they arrive from the backend
        const assistantId = (Date.now() + 1).toString();

        // Start with an empty assistant message
        setMessages(prev => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          },
        ]);

        // Batch chunks for smoother streaming (less aggressive)
        let buffer = '';
        let isStreaming = true;

        // Flush buffer to UI every 80ms
        const flushInterval = setInterval(() => {
          if (buffer.length > 0) {
            const toFlush = buffer;
            buffer = '';
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantId
                  ? { ...msg, content: msg.content + toFlush }
                  : msg,
              ),
            );
          }
          if (!isStreaming) {
            clearInterval(flushInterval);
          }
        }, 80);

        try {
          await streamChatMessage(
            {
              userId: user?.id || 'anonymous',
              session_id: sessionId,
              messages: apiMessages,
              dropped_question_id: droppedQuestionId,
            },
            (chunk) => {
              // Accumulate chunks in buffer
              buffer += chunk;
            },
          );
        } finally {
          // Stream done: flush any remaining content and stop interval
          isStreaming = false;
          if (buffer.length > 0) {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantId
                  ? { ...msg, content: msg.content + buffer }
                  : msg,
              ),
            );
          }
          clearInterval(flushInterval);
        }
      } else {
        // Non-streaming: full response at once
        const response = await sendChatMessage({
          userId: user?.id || 'anonymous',
          session_id: sessionId,
          messages: apiMessages,
          dropped_question_id: droppedQuestionId,
        });

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          ...response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please make sure the backend server is running on port 8001 and try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: 'Error',
        description: 'Failed to send message. Check if the backend is running.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl ring-1 ring-slate-900/5">
      {/* Header - Clean & Modern */}
      <div className="flex-shrink-0 px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-20 sticky top-0">
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((message) => (
            (message.role === 'user' || (message.role === 'assistant' && message.content.trim())) ? (
              <div
                key={message.id}
                className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Avatar */}
                {message.role === 'assistant' ? (
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mt-1">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                )}

                {/* Message Card */}
                <div className="flex-1 min-w-0">
                  <Card className="py-0 gap-0 border shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4 text-[15px] leading-snug">
                      <div className="chat-content text-left text-slate-800 dark:text-slate-200">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => {
                              const text = typeof children === 'string' ? children : '';

                              // Answer Badge Detection
                              if (typeof children === 'string' || (Array.isArray(children) && children.every(c => typeof c === 'string'))) {
                                const fullText = Array.isArray(children) ? children.join('') : children;
                                const badgeMatch = fullText.match(/\[\s*(✅|❌|🔍)\s*(TRUE|FALSE|NOT GIVEN)\s*\]/i);

                                if (badgeMatch) {
                                  const icon = badgeMatch[1];
                                  const label = badgeMatch[2].toUpperCase();
                                  let badgeClass = "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-md transform hover:scale-105 transition-all duration-200 mt-2 mb-4";

                                  if (label === 'TRUE') badgeClass += " bg-emerald-500 shadow-emerald-500/20";
                                  else if (label === 'FALSE') badgeClass += " bg-rose-500 shadow-rose-500/20";
                                  else badgeClass += " bg-slate-500 shadow-slate-500/20";

                                  return (
                                    <div className={badgeClass}>
                                      <span className="text-lg">{icon}</span>
                                      <span className="tracking-wide">{label}</span>
                                    </div>
                                  );
                                }
                              }

                              // Passage Excerpt & Statement Styling
                              const childArray = Array.isArray(children) ? children : [children];
                              const firstChild = childArray[0];

                              if (typeof firstChild === 'string') {
                                if (firstChild.startsWith('Passage Excerpt:')) {
                                  // Remove prefix from first child
                                  const newFirstChild = firstChild.replace('Passage Excerpt:', '').trim();
                                  const newChildren = [newFirstChild, ...childArray.slice(1)];

                                  return (
                                    <div className="my-3 p-3.5 bg-blue-50/50 dark:bg-blue-900/10 border-l-[3px] border-blue-500 rounded-r-lg shadow-sm">
                                      <span className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5 opacity-90">Passage Excerpt</span>
                                      <div className="italic text-slate-700 dark:text-slate-300 leading-relaxed text-[15px]">
                                        {newChildren}
                                      </div>
                                    </div>
                                  );
                                }

                                if (firstChild.startsWith('Statement:')) {
                                  // Remove prefix from first child
                                  const newFirstChild = firstChild.replace('Statement:', '').trim();
                                  const newChildren = [newFirstChild, ...childArray.slice(1)];

                                  return (
                                    <div className="my-3 p-3.5 bg-purple-50/50 dark:bg-purple-900/10 border-l-[3px] border-purple-500 rounded-r-lg shadow-sm">
                                      <span className="block text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1.5 opacity-90">Statement</span>
                                      <div className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed text-[15px]">
                                        {newChildren}
                                      </div>
                                    </div>
                                  );
                                }
                              }

                              return <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>;
                            },
                            em: ({ children }) => (
                              <em className="not-italic font-medium text-blue-700 dark:text-blue-200 bg-blue-100/50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded border border-blue-200/50 dark:border-blue-700/30 box-decoration-clone mx-0.5">
                                {children}
                              </em>
                            ),
                            del: ({ children }) => (
                              <del className="no-underline font-bold text-rose-700 dark:text-rose-300 bg-rose-100/50 dark:bg-rose-900/40 px-1 py-0.5 rounded border border-rose-200/50 dark:border-rose-800/50 box-decoration-clone mx-0.5">
                                {children}
                              </del>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded box-decoration-clone">
                                {children}
                              </strong>
                            ),
                            ul: ({ children }) => <ul className="my-1.5 pl-5 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="my-1.5 pl-5 space-y-1 list-decimal">{children}</ol>,
                            li: ({ children }) => (
                              <li className="pl-1 text-slate-700 dark:text-slate-300">
                                <span className="relative -left-2 top-0.5 inline-block w-4 text-center text-indigo-400 opacity-60">•</span>
                                <span className="-ml-1">{children}</span>
                              </li>
                            ),
                            h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-1.5 text-slate-900 dark:text-slate-100">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-1.5 text-slate-900 dark:text-slate-100">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1 text-slate-900 dark:text-slate-100 uppercase tracking-wide opacity-90">{children}</h3>,
                            h4: ({ children }) => <h4 className="text-sm font-bold mt-2 mb-1 text-slate-900 dark:text-slate-100">{children}</h4>,
                            code: ({ className, children, ...props }: any) => {
                              const match = /language-(\w+)/.exec(className || '');
                              
                              if (match && match[1] === 'exercise') {
                                return (
                                  <ExerciseCard 
                                    content={String(children).replace(/\n$/, '')} 
                                    onAnswer={(ans) => handleSend(ans)} 
                                  />
                                );
                              }
                              
                              if (match && match[1] === 'feedback') {
                                return <FeedbackCard content={String(children).replace(/\n$/, '')} />;
                              }

                              return (
                                <code className="px-1.5 py-0.5 rounded text-[13px] font-bold bg-amber-100/60 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 font-mono shadow-sm mx-0.5" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            blockquote: ({ children }) => {
                              const getNodeText = (node: any): string => {
                                if (!node) return '';
                                if (typeof node === 'string') return node;
                                if (Array.isArray(node)) return node.map(getNodeText).join(' ');
                                if (node.props && node.props.children) return getNodeText(node.props.children);
                                return '';
                              };

                              const firstLine = getNodeText(children);

                              let cardStyle = "border-l-4 pl-4 py-3 my-4 rounded-r-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md";
                              let isExample = false;

                              if (firstLine.includes('⚔️') || firstLine.includes('ATTACK PLAN')) {
                                cardStyle = "border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 my-4 rounded-r-2xl overflow-hidden shadow-sm";
                              } else if (firstLine.includes('🪤') || firstLine.includes('TRICK YOU') || firstLine.includes('MISTAKE')) {
                                cardStyle = "border-l-4 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 my-4 rounded-r-2xl overflow-hidden shadow-sm";
                              } else if (firstLine.includes('🎬') || firstLine.includes('SEE IT IN ACTION')) {
                                cardStyle = "border-l-4 border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 my-4 rounded-r-2xl overflow-hidden shadow-sm";
                                isExample = true;
                              } else if (firstLine.includes('💡') || firstLine.includes('PRO TIP')) {
                                cardStyle = "border-l-4 border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 my-4 rounded-r-2xl overflow-hidden shadow-sm";
                              } else if (firstLine.includes('⏱️') || firstLine.includes('TIME MANAGEMENT')) {
                                cardStyle = "border-l-4 border-slate-500 bg-slate-100/50 dark:bg-slate-800/40 my-4 rounded-r-2xl overflow-hidden shadow-sm";
                              } else if (firstLine.includes('✨') || firstLine.includes('SUMMARY')) {
                                cardStyle = "border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 my-4 rounded-r-2xl overflow-hidden shadow-sm";
                              }

                              if (isExample && Array.isArray(children)) {
                                const solutionIndex = children.findIndex((child: any) =>
                                  getNodeText(child).includes('THE SOLUTION')
                                );

                                if (solutionIndex !== -1) {
                                  const header = children.slice(0, 1);
                                  const leftCol = children.slice(1, solutionIndex);
                                  const rightCol = children.slice(solutionIndex);

                                  return (
                                    <div className={cardStyle}>
                                      <div className="p-5">
                                        <div className="mb-5 pb-3 border-b border-purple-200 dark:border-purple-800/50">
                                          {header}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                          <div className="relative bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30 flex flex-col h-full">
                                            <div className="absolute top-[-10px] left-3 px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-[10px] font-bold text-purple-600 dark:text-purple-400 rounded uppercase tracking-wider border border-purple-200 dark:border-purple-800">Passage</div>
                                            {leftCol}
                                          </div>
                                          <div className="relative bg-purple-50/50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30 flex flex-col h-full">
                                            <div className="absolute top-[-10px] left-3 px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-[10px] font-bold text-purple-700 dark:text-purple-300 rounded uppercase tracking-wider border border-purple-300 dark:border-purple-700">Statement</div>
                                            {rightCol}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              }

                              return (
                                <div className={cardStyle}>
                                  <div className="p-5">
                                    <div className="text-slate-800 dark:text-slate-200">
                                      {children}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }}
                        >
                          {message.role === 'assistant'
                            ? formatAssistantContent(message.content)
                            : message.content}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null
          ))}

          {/* Loading indicator - only show when no assistant message is streaming */}
          {isLoading && !messages.some(m => m.role === 'assistant' && m.content.trim() === '' && m.id === messages[messages.length - 1]?.id) && (messages.length === 0 || messages[messages.length - 1].role !== 'assistant' || !messages[messages.length - 1].content.trim()) && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Card className="py-0 gap-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex space-x-1.5 items-center h-full">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-[24px] border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all duration-300 shadow-sm">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about IELTS Reading..."
            className="min-h-[48px] max-h-[150px] border-none bg-transparent resize-none focus-visible:ring-0 p-3.5 text-[15px] shadow-none placeholder:text-slate-400"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className={`mb-1 mr-1 h-10 w-10 rounded-full transition-all duration-300 ${input.trim()
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transform hover:scale-105 active:scale-95'
              : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
              }`}
          >
            <Send className="h-4 w-4 ml-0.5" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium opacity-60">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div >
  );
}


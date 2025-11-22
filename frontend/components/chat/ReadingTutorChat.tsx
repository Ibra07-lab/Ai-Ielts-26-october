import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { sendChatMessage, generateSessionId, ChatMessage } from '@/services/chatApi';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

type GreetingStyle = 'short' | 'medium' | 'ultra';
const GREETING_STYLE: GreetingStyle = ['short', 'medium', 'ultra'][Math.floor(Math.random() * 3)] as GreetingStyle;

const getGreeting = (style: GreetingStyle): string => {
  switch (style) {
    case 'short':
      return `✅ SHORT GREETING (clean & professional)

Hi! 👋 I'm ALEX — your IELTS Reading Mentor.  
Ready to improve your reading skills, understand passages, and build confidence?  
Tell me what you want to work on today. 😊`;
    case 'ultra':
      return `✅ ULTRA-FRIENDLY GREETING (encouraging & warm)

Hey there! 😊 I’m ALEX — your friendly IELTS Reading Mentor.
No stress, no pressure — just a supportive guide to help you understand passages, fix mistakes, beat timing problems, and grow your confidence.
Drop a question, share your answer, or tell me what you’re struggling with.  
We’ll improve your reading step by step. 💪📚`;
    default:
      return `✅ MEDIUM GREETING (balanced & helpful)

Hello! 👋 I’m ALEX — your Personal IELTS Reading Mentor.
I can help you with:
• Explanations of your answers  
• Hints and clues  
• Reading strategies  
• Practice and confidence-building  
Drag a question here or tell me what you'd like to focus on today. 😊`;
  }
};

interface ReadingTutorChatProps {
  droppedQuestionId?: string | null;
}

export default function ReadingTutorChat({ droppedQuestionId }: ReadingTutorChatProps) {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session management
  const [sessionId] = useState(() => generateSessionId());

  // Chat state
  const [messages, setMessages] = useState<(ChatMessage & { id: string; timestamp: Date })[]>([
    {
      id: '1',
      role: 'assistant',
      content: getGreeting(GREETING_STYLE),
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format assistant messages: collapse excessive blank lines and auto-number "Statements:" blocks
  const formatAssistantContent = (raw: string): string => {
    // Collapse 3+ blank lines to just 2
    const collapsed = raw.replace(/\n{3,}/g, '\n\n');
    // Auto-number lines directly after a "Statements:" header until a blank line
    return collapsed.replace(/(Statements?:\s*\n)([\s\S]+)/i, (_, header: string, rest: string) => {
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage & { id: string; timestamp: Date } = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
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

      const response = await sendChatMessage({
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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scroll-smooth custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            {/* Bot Avatar */}
            {message.role === 'assistant' && (
              <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            <div
              className={`flex flex-col max-w-[90%] sm:max-w-[80%] md:max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'
                }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl shadow-sm text-[15px] leading-snug ${message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm shadow-blue-500/10'
                  : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                  }`}
              >
                <div className="chat-content text-left">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-0.5 last:mb-0">{children}</p>,
                      strong: ({ children }) => (
                        <strong className={`font-semibold ${message.role === 'user' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                          {children}
                        </strong>
                      ),
                      ul: ({ children }) => <ul className="my-0.5 pl-4 list-disc">{children}</ul>,
                      ol: ({ children }) => <ol className="my-0.5 pl-4 list-decimal">{children}</ol>,
                      li: ({ children }) => <li><div className="block w-full">{children}</div></li>,
                      code: ({ children }) => (
                        <code className={`px-1.5 py-0.5 rounded text-xs font-mono font-medium ${message.role === 'user'
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                          }`}>
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {message.role === 'assistant'
                      ? formatAssistantContent(message.content)
                      : message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>


            {/* User Avatar */}
            {message.role === 'user' && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mt-1 ring-2 ring-white dark:ring-slate-900">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
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

        <div ref={messagesEndRef} />
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
            onClick={handleSend}
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
    </div>
  );
}


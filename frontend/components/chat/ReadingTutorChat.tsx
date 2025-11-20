import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

  const quickPrompts = [
    "Can you explain how to approach True/False/Not Given questions?",
    "I need a hint for this question",
    "Why was my answer incorrect?",
    "What are key words I should look for?",
  ];
  // Removed quick prompts bar for a cleaner chat interface

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          IELTS Reading Tutor
        </CardTitle>
        <CardDescription>
          Ask questions, get hints, or discuss reading strategies
        </CardDescription>
      </CardHeader>
      
      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto min-h-0 p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-2 max-w-[85%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-md'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="chat-content text-sm whitespace-pre-wrap leading-6 break-words">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="my-1">{children}</p>,
                        strong: ({ children }) => (
                          <strong className="text-amber-600 dark:text-amber-300 font-semibold">{children}</strong>
                        ),
                        ol: ({ children }) => {
                          const renderListAsCards = false;
                          return renderListAsCards ? <ol className="list-cards">{children}</ol> : <ol>{children}</ol>;
                        },
                      }}
                    >
                      {message.role === 'assistant'
                        ? formatAssistantContent(message.content)
                        : message.content}
                    </ReactMarkdown>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-md flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Quick Prompts removed */}

      {/* Input Area */}
      <div className="p-4 border-t flex-shrink-0 bg-white dark:bg-gray-950">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about IELTS reading..."
            className="resize-none flex-1"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="lg"
            className="self-end bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
}


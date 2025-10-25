import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, Bot, User, BookOpen, PenTool, Brain, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUser } from "../contexts/UserContext";
import backend from "~backend/client";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function AICoach() {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Hi ${user?.name || 'there'}! 👋 Ready for today's IELTS prep? I'm your AI coach and I'm here to help you master every aspect of the test. 

🎯 **Quick suggestion**: Since you're aiming for band ${user?.targetBand || '7.0'}, let's work on advanced vocabulary and complex sentence structures today!

I can help with:
• Grammar explanations & corrections
• Writing Task 1 & 2 feedback  
• Speaking fluency & pronunciation tips
• Reading strategies & time management
• Listening practice & note-taking

What would you like to focus on?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Format date dividers
  const formatDateDivider = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  // Check if we need a date divider between messages
  const needsDateDivider = (currentMsg: Message, prevMsg?: Message): boolean => {
    if (!prevMsg) return true;
    
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    
    return currentDate !== prevDate;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await backend.ielts.chatWithCoach({
        message: userMessage.content,
        context: user ? `User ${user.id}, target band ${user.targetBand}` : undefined,
      });
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: res.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I'm having trouble responding right now.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed mock generator; backend now returns AI responses.

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How can I improve my writing Task 2?",
    "What are some useful linking words?",
    "How do I manage time in reading section?",
    "Tips for Part 2 speaking?",
    "Common grammar mistakes to avoid?",
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI IELTS Coach
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get personalized help and feedback from your AI-powered IELTS coach.
          </p>
        </div>

        {/* Main Chat Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[calc(100vh-140px)]">
          {/* Chat Interface - Takes 70% width */}
          <div className="lg:col-span-7">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with AI Coach
                </CardTitle>
                <CardDescription>
                  Ask questions about IELTS preparation, get feedback, and receive personalized tips.
                </CardDescription>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto min-h-0 p-0">
                <div className="p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div key={message.id}>
                      {/* Date Divider */}
                      {needsDateDivider(message, messages[index - 1]) && (
                        <div className="flex justify-center my-4">
                          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-500 dark:text-gray-400">
                            {formatDateDivider(message.timestamp)}
                          </div>
                        </div>
                      )}
                      
                      {/* Message */}
                      <div
                        className={`flex gap-3 ${
                          message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-3 max-w-[85%] ${
                            message.type === "user" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === "user"
                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                                : "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          <div
                            className={`p-4 rounded-2xl ${
                              message.type === "user"
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <p
                              className={`text-xs mt-2 ${
                                message.type === "user"
                                  ? "text-blue-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Auto-scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Input Area */}
              <div className="p-4 border-t flex-shrink-0 bg-white dark:bg-gray-950">
                <div className="flex gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about IELTS preparation..."
                    className="resize-none flex-1"
                    rows={2}
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

              {/* Compact Coach Features - Always Visible */}
              <div className="p-3 border-t bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 max-w-[200px] border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
                    onClick={() => setInput("Help me with grammar rules and corrections")}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span className="text-xs">Grammar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 max-w-[200px] border-green-200 hover:bg-green-50 hover:border-green-300 text-green-700 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20"
                    onClick={() => setInput("I need feedback on my writing")}
                  >
                    <PenTool className="h-3 w-3 mr-1" />
                    <span className="text-xs">Writing</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 max-w-[200px] border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20"
                    onClick={() => setInput("What are the best IELTS study strategies?")}
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    <span className="text-xs">Strategies</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Questions Sidebar - Takes 30% width */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Quick Questions
                </CardTitle>
                <CardDescription>
                  Tap to ask common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-sm leading-relaxed"
                      onClick={() => setInput(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
      
    </>
  );
}

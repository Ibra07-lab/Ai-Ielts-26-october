import { useState } from "react";
import { Send, MessageCircle, Bot, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUser } from "../contexts/UserContext";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your AI IELTS coach. I can help you with grammar questions, vocabulary explanations, writing feedback, speaking tips, and IELTS strategies. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

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

    // Mock AI response - in a real app, this would call an AI service
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateMockResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("grammar") || input.includes("tense")) {
      return "Great question about grammar! For IELTS, focus on using a variety of tenses accurately. Common mistakes include mixing past and present tenses. Practice using present perfect for experiences and past simple for specific past events. Would you like me to explain any specific grammar point?";
    }
    
    if (input.includes("vocabulary") || input.includes("word")) {
      return "Vocabulary is crucial for IELTS success! I recommend learning topic-specific vocabulary for common IELTS themes like environment, education, and technology. Use new words in context and practice collocations. What topic would you like to focus on?";
    }
    
    if (input.includes("writing") || input.includes("essay")) {
      return "For IELTS writing, structure is key! Task 1: Introduction → Overview → Body paragraphs with details. Task 2: Introduction → Body paragraph 1 → Body paragraph 2 → Conclusion. Always plan before writing and check your work. What specific writing challenge are you facing?";
    }
    
    if (input.includes("speaking") || input.includes("pronunciation")) {
      return "Speaking confidence comes with practice! Focus on fluency over perfection, use linking words, and develop your ideas fully. For pronunciation, work on word stress and intonation. Practice speaking about common IELTS topics daily. What aspect of speaking would you like to improve?";
    }
    
    if (input.includes("reading") || input.includes("comprehension")) {
      return "Reading success requires strategy! Skim the passage first, then read questions carefully. Look for keywords and synonyms. Practice different question types: multiple choice, True/False/Not Given, and matching. Time management is crucial - don't spend too long on one question.";
    }
    
    if (input.includes("listening")) {
      return "Listening skills improve with regular practice! Listen to various English accents, take notes while listening, and predict what you might hear. Focus on keywords and don't panic if you miss something. Practice with different audio types: conversations, lectures, and announcements.";
    }
    
    if (input.includes("band") || input.includes("score")) {
      return "Band scores depend on four criteria: Task Achievement/Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy. Focus on all areas equally. Regular practice and feedback are essential for improvement. What's your current target band?";
    }
    
    return "That's an interesting question! I'm here to help with all aspects of IELTS preparation. You can ask me about grammar rules, vocabulary usage, writing structure, speaking strategies, reading techniques, listening tips, or general IELTS advice. What specific area would you like to focus on?";
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI IELTS Coach
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Get personalized help and feedback from your AI-powered IELTS coach.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Questions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
              <CardDescription>
                Tap to ask common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 text-wrap"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat with AI Coach
              </CardTitle>
              <CardDescription>
                Ask questions about IELTS preparation, get feedback, and receive personalized tips.
              </CardDescription>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.type === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user"
                          ? "bg-sky-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-sky-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.type === "user"
                            ? "text-sky-100"
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
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about IELTS preparation..."
                  className="resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Coach Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Bot className="h-8 w-8 text-sky-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Grammar Help</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get explanations for grammar rules and common mistakes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Writing Feedback</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Submit essays and get detailed feedback on structure and content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <User className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Study Strategies</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Learn effective study techniques and test-taking strategies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

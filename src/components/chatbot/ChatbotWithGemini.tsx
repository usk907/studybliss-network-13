
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CourseContext {
  id: string;
  title: string;
  description: string;
}

interface ChatbotWithGeminiProps {
  isWidget?: boolean;
}

const ChatbotWithGemini = ({ isWidget = false }: ChatbotWithGeminiProps) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Learning Assistant. How can I help you with your courses today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseContext, setCourseContext] = useState<CourseContext[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchUserCourses();
    scrollToBottom();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchUserCourses = async () => {
    if (!user) return;
    
    try {
      // First get user's enrollments
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);
        
      if (enrollmentError) throw enrollmentError;
      
      if (enrollments && enrollments.length > 0) {
        const courseIds = enrollments.map(enrollment => enrollment.course_id);
        
        // Then get course details
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, description')
          .in('id', courseIds);
          
        if (coursesError) throw coursesError;
        
        setCourseContext(courses || []);
      } else {
        // If no enrollments, get some courses as context anyway
        const { data: allCourses, error: allCoursesError } = await supabase
          .from('courses')
          .select('id, title, description')
          .limit(5);
          
        if (allCoursesError) throw allCoursesError;
        
        setCourseContext(allCourses || []);
      }
    } catch (error) {
      console.error("Error fetching course context:", error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      // Prepare course context for the AI
      const courseContextString = courseContext.length > 0 
        ? `The user is enrolled in the following courses: ${courseContext.map(c => 
            `${c.title}: ${c.description ? c.description.substring(0, 100) + "..." : "No description available"}`
          ).join("; ")}`
        : "";
      
      // If the Edge Function is not working properly, fallback to mock responses
      const mockResponses = [
        "I can help explain that concept. What specific part are you having trouble with?",
        "That's a great question about the course material. Let me provide some additional context.",
        "Based on the topics you're studying, I'd recommend reviewing the key concepts in chapter 3.",
        "For that problem, try breaking it down into smaller steps first.",
        "You're making good progress! Just remember to apply the formula we discussed earlier.",
        "I see you're working on web development. Have you tried using the developer tools to debug your code?",
        "For this data science problem, you might want to visualize the data first to identify patterns.",
        "That's a common question in this course. The key thing to remember is how variables are scoped in JavaScript."
      ];
      
      // Try to call the real API first
      try {
        // Convert messages to format expected by the API
        const messageHistory = messages
          .slice(-10) // Only use the last 10 messages for context
          .concat(userMessage)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));
        
        // Include course context in the system message
        const systemMessage = {
          role: "system",
          content: `You are a helpful learning assistant for an e-learning platform. ${courseContextString} Provide helpful, concise responses to help the student understand course concepts.`
        };
        
        // Call the Gemini function
        const { data, error } = await supabase.functions.invoke("gemini", {
          body: { 
            action: "chat",
            messages: [systemMessage, ...messageHistory],
          },
        });
        
        if (error) throw error;
        
        const assistantMessage: Message = {
          role: "assistant",
          content: data?.message || "Sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        
        // Generate a more contextual response based on the user's message
        let responseContent = "";
        const userMessageLower = userMessage.content.toLowerCase();
        
        if (userMessageLower.includes("assignment") || userMessageLower.includes("homework")) {
          responseContent = "For this assignment, you should focus on understanding the core concepts first. Take it step-by-step and refer to your course materials.";
        } else if (userMessageLower.includes("exam") || userMessageLower.includes("test")) {
          responseContent = "To prepare for your exam, create a study schedule and focus on the key topics highlighted in your course. Practice with sample questions if available.";
        } else if (userMessageLower.includes("understand") || userMessageLower.includes("explain")) {
          responseContent = "Let me explain this concept: it's about building connections between ideas. First understand the fundamentals, then see how they relate to more complex topics.";
        } else {
          // Use fallback mock response if we can't determine a contextual response
          responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        }
        
        const fallbackMessage: Message = {
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, fallbackMessage]);
        
        // Show a subtle toast notification that we're using fallback responses
        toast({
          title: "Using AI Fallback Mode",
          description: "We're using simulated responses while our AI service is being updated.",
          variant: "default",
        });
      }
    } catch (finalError: any) {
      console.error("Critical error in chatbot:", finalError);
      
      // Add an error message as last resort
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        },
      ]);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // If we're in widget mode, render a more compact version
  if (isWidget) {
    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className={message.role === "user" ? "bg-blue-500" : "bg-slate-500"}>
                    <AvatarFallback>
                      {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </AvatarFallback>
                    {message.role === "user" && user?.user_metadata?.avatar_url && (
                      <AvatarImage src={user.user_metadata.avatar_url} />
                    )}
                  </Avatar>
                  
                  <div>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : isDark 
                            ? "bg-gray-700 text-gray-100" 
                            : "bg-slate-100"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <Avatar className="bg-slate-500">
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-700' : 'bg-slate-100'} flex items-center space-x-2`}>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className={`flex-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send size={16} />
          </Button>
        </form>
      </div>
    );
  }
  
  // Full page version
  return (
    <Card className={`flex flex-col h-[calc(100vh-10rem)] ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader className={isDark ? 'border-gray-700' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
          <Bot className="h-5 w-5" />
          Learning Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className={message.role === "user" ? "bg-blue-500" : "bg-slate-500"}>
                  <AvatarFallback>
                    {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
                  </AvatarFallback>
                  {message.role === "user" && user?.user_metadata?.avatar_url && (
                    <AvatarImage src={user.user_metadata.avatar_url} />
                  )}
                </Avatar>
                
                <div>
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : isDark 
                          ? "bg-gray-700 text-gray-100" 
                          : "bg-slate-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="bg-slate-500">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-slate-100'} flex items-center space-x-2`}>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className={`border-t pt-4 ${isDark ? 'border-gray-700' : ''}`}>
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className={`flex-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatbotWithGemini;

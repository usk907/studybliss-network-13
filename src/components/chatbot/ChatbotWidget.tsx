
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import ChatbotWithGemini from "./ChatbotWithGemini";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className={cn(
          "w-[380px] h-[600px] rounded-lg shadow-lg overflow-hidden transition-all",
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        )}>
          <div className={cn(
            "flex items-center justify-between p-3 border-b",
            isDark ? "border-gray-700" : "border-gray-200"
          )}>
            <h3 className={cn(
              "font-medium flex items-center gap-2",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <MessageSquare size={18} /> Learning Assistant
            </h3>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X size={18} />
            </Button>
          </div>
          <div className="h-[calc(100%-48px)]">
            <ChatbotWithGemini isWidget={true} />
          </div>
        </div>
      ) : (
        <Button 
          className="h-14 w-14 rounded-full shadow-lg" 
          onClick={toggleChat}
        >
          <MessageSquare size={24} />
        </Button>
      )}
    </div>
  );
};

export default ChatbotWidget;

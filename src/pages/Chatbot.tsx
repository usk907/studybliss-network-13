
import { AppLayout } from "@/components/layout/AppLayout";
import ChatbotWithGemini from "@/components/chatbot/ChatbotWithGemini";
import { useTheme } from "@/context/ThemeContext";

const Chatbot = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Learning Assistant</h1>
        <p className={`${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
          Ask questions about your courses, get help with assignments, or explore new topics.
        </p>
        
        <ChatbotWithGemini />
      </div>
    </AppLayout>
  );
};

export default Chatbot;

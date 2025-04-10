
import { AppLayout } from "@/components/layout/AppLayout";
import ChatbotWithGemini from "@/components/chatbot/ChatbotWithGemini";

const Chatbot = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Learning Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your courses, get help with assignments, or explore new topics.
        </p>
        
        <ChatbotWithGemini />
      </div>
    </AppLayout>
  );
};

export default Chatbot;


import { AppLayout } from "@/components/layout/AppLayout";
import { AIChat } from "@/components/chatbot/AIChat";

const Chatbot = () => {
  return (
    <AppLayout>
      <div className="space-y-6 h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold">Ask AI Assistant</h1>
        <p className="text-gray-600">
          Our AI assistant is here to help you with your learning journey. Ask questions about your courses, 
          get explanations for concepts you're struggling with, or get guidance on assignments.
        </p>
        
        <div className="h-[calc(100%-8rem)]">
          <AIChat />
        </div>
      </div>
    </AppLayout>
  );
};

export default Chatbot;

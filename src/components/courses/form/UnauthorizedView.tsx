
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export function UnauthorizedView() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center border rounded-lg border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
      <ShieldAlert className="w-12 h-12 text-red-500 dark:text-red-400" />
      <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Access Denied</h3>
      <p className="text-gray-600 dark:text-gray-300">
        You don't have permission to create courses. Only administrators can perform this action.
      </p>
      <Button 
        variant="outline" 
        onClick={() => navigate("/courses")}
      >
        Return to Courses
      </Button>
    </div>
  );
}

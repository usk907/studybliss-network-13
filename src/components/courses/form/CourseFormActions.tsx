
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CourseFormActionsProps {
  isLoading: boolean;
  isAdmin: boolean;
  isDark: boolean;
}

export function CourseFormActions({ isLoading, isAdmin, isDark }: CourseFormActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate("/courses")}
        className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isLoading || !isAdmin}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Course"
        )}
      </Button>
    </div>
  );
}

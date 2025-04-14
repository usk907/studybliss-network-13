
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface EmailConfirmAlertProps {
  email: string;
}

export function EmailConfirmAlert({ email }: EmailConfirmAlertProps) {
  const [isResending, setIsResending] = useState(false);

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      toast.success("Confirmation email has been resent. Please check your inbox.");
    } catch (error: any) {
      console.error("Resend confirmation error:", error);
      toast.error(error.message || "Failed to resend confirmation email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col space-y-2">
        <p>Please confirm your email address before logging in. Check your inbox for a confirmation email.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResendConfirmation}
          disabled={isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend confirmation email"
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

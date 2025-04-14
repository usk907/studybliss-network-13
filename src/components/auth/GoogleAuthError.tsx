
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function GoogleAuthError() {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Google authentication is not enabled in your Supabase project settings. Please enable it in the Supabase dashboard under Authentication → Providers → Google.
      </AlertDescription>
    </Alert>
  );
}

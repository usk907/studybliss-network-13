
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Import our new components
import { SignUpFormContent } from "@/components/auth/SignUpFormContent";
import { GoogleSignUpButton } from "@/components/auth/GoogleSignUpButton";
import { GoogleAuthError } from "@/components/auth/GoogleAuthError";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password, fullName);
      toast.success("Account created. Please check your email to confirm your account");
    } catch (error: any) {
      console.error("Signup error:", error);
      // Error is already handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Sign up to start learning today
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <SignUpFormContent 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          handleSignUp={handleSignUp}
        />
        
        {googleError && <GoogleAuthError />}
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <GoogleSignUpButton 
          isLoading={isLoading} 
          setIsLoading={setIsLoading}
          setGoogleError={setGoogleError}
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">
          Already have an account? <button 
            type="button" 
            className="text-blue-500 hover:text-blue-700"
            onClick={() => document.querySelector('[value="login"]')?.dispatchEvent(new MouseEvent('click'))}
          >
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}

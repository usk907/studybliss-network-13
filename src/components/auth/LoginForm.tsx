
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Imported components
import { LoginFormContent } from "./LoginFormContent";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { EmailConfirmAlert } from "./EmailConfirmAlert";
import { GoogleAuthError } from "./GoogleAuthError";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const [emailConfirmError, setEmailConfirmError] = useState(false);
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailConfirmError(false);
    
    try {
      // Check for admin login with specific employee ID
      if (loginMode === "admin" && employeeId !== "RA2211003011971") {
        toast.error("Invalid Employee ID");
        setIsLoading(false);
        return;
      }
      
      // If admin login, include employeeId
      const { error } = await signIn(
        email, 
        password, 
        loginMode === "admin" ? employeeId : undefined
      );
      
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setEmailConfirmError(true);
          toast.error("Please confirm your email before logging in");
        } else {
          toast.error(error.message || "Something went wrong with logging in");
        }
        throw error;
      }
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      // Error already handled above
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Tabs defaultValue="user" onValueChange={(value) => setLoginMode(value as "user" | "admin")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">User Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>
          
          <LoginFormContent 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            employeeId={employeeId}
            setEmployeeId={setEmployeeId}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            loginMode={loginMode}
            handleLogin={handleLogin}
          />
        </Tabs>
        
        {emailConfirmError && <EmailConfirmAlert email={email} />}
        {googleError && <GoogleAuthError />}
        
        {loginMode === "user" && (
          <>
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
            
            <GoogleLoginButton isLoading={isLoading} setIsLoading={setIsLoading} />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">
          Don't have an account? <button 
            type="button" 
            className="text-blue-500 hover:text-blue-700"
            onClick={() => document.querySelector('[value="signup"]')?.dispatchEvent(new MouseEvent('click'))}
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}

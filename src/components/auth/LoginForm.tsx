
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, AlertCircle, Briefcase } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setGoogleError(false);
    
    try {
      // Get current site URL for redirect
      const currentOrigin = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentOrigin}/`
        }
      });
      
      if (error) {
        if (error.message.includes("provider is not enabled")) {
          setGoogleError(true);
          toast.error("Google authentication is not enabled in Supabase project settings");
        } else {
          throw error;
        }
      }
      
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Something went wrong with Google sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
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
          
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
            
            {loginMode === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="employeeId">
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    <span>Employee ID</span>
                  </div>
                </Label>
                <Input 
                  id="employeeId"
                  type="text"
                  placeholder="Enter your employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isLoading}
                  required={loginMode === "admin"}
                />
                <p className="text-xs text-muted-foreground">
                  Admin access requires a valid employee ID
                </p>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${loginMode === "admin" ? "Admin" : "User"}`
              )}
            </Button>
          </form>
        </Tabs>
        
        {emailConfirmError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col space-y-2">
              <p>Please confirm your email address before logging in. Check your inbox for a confirmation email.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResendConfirmation}
                disabled={isLoading}
              >
                {isLoading ? (
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
        )}
        
        {googleError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Google authentication is not enabled in your Supabase project settings. Please enable it in the Supabase dashboard under Authentication → Providers → Google.
            </AlertDescription>
          </Alert>
        )}
        
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
            
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full flex items-center justify-center gap-2" 
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
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

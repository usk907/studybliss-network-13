
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, checkAdminStatus } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate admin email format
    if (!email.endsWith('@admin.com')) {
      setLoginError("Please use an admin email (ending with @admin.com)");
      return;
    }
    
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || "Login failed");
        setLoginError(error.message || "Login failed");
        throw error;
      }
      
      // Check if user is admin
      const isAdmin = await checkAdminStatus();
      if (!isAdmin) {
        toast.error("You don't have admin privileges");
        setLoginError("You don't have admin privileges");
        return;
      }
      
      toast.success("Admin login successful");
      navigate("/admin/courses");
    } catch (error: any) {
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
        <CardDescription className="text-center">
          Sign in with your admin credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input 
              id="adminEmail" 
              type="email" 
              placeholder="admin@admin.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPassword">Password</Label>
            <div className="relative">
              <Input 
                id="adminPassword" 
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
          
          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in as Admin"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">
          Not an admin? <a 
            href="/login" 
            className="text-blue-500 hover:text-blue-700"
          >
            Student Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

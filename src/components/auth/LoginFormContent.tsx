
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Briefcase } from "lucide-react";

interface LoginFormContentProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  employeeId: string;
  setEmployeeId: (employeeId: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  loginMode: "user" | "admin";
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

export function LoginFormContent({
  email,
  setEmail,
  password,
  setPassword,
  employeeId,
  setEmployeeId,
  showPassword,
  setShowPassword,
  isLoading,
  loginMode,
  handleLogin,
}: LoginFormContentProps) {
  return (
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
  );
}

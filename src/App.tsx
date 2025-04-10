
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Attendance from "./pages/Attendance";
import Performance from "./pages/Performance";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Quiz from "./components/quiz/Quiz";
import AdminCourses from "./pages/AdminCourses";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/login?tab=admin" replace />;
  }
  
  return <>{children}</>;
};

// Public route wrapper component (redirects to home if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Admin routes */}
        <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

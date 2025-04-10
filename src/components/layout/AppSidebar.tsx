
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Calendar, ChevronLeft, ChevronRight, Home, LogOut, MessageSquare, Settings, User, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isCollapsed, isActive }: SidebarLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to={to} 
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-blue-100 text-elearn-primary font-medium" 
                : "hover:bg-blue-100 text-gray-700"
            )}
          >
            <Icon className={cn(
              "h-5 w-5", 
              isActive ? "text-elearn-primary" : "text-gray-500"
            )} />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <span className="font-bold text-xl text-elearn-primary">StudyBliss</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
        <SidebarLink 
          to="/" 
          icon={Home} 
          label="Dashboard" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname === '/'}
        />
        <SidebarLink 
          to="/courses" 
          icon={Book} 
          label="Courses" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname.includes('/courses')}
        />
        <SidebarLink 
          to="/attendance" 
          icon={Calendar} 
          label="Attendance" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname === '/attendance'}
        />
        <SidebarLink 
          to="/performance" 
          icon={BarChart2} 
          label="Performance" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname === '/performance'}
        />
        <SidebarLink 
          to="/chatbot" 
          icon={MessageSquare} 
          label="Ask AI" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname === '/chatbot'}
        />
        <SidebarLink 
          to="/profile" 
          icon={User} 
          label="Profile" 
          isCollapsed={isCollapsed} 
          isActive={location.pathname === '/profile'}
        />
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to="/settings" 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors w-full text-left",
                    location.pathname === '/settings' ? "bg-blue-100 text-elearn-primary font-medium" : ""
                  )}
                >
                  <Settings className={cn(
                    "h-5 w-5", 
                    location.pathname === '/settings' ? "text-elearn-primary" : "text-gray-500"
                  )} />
                  {!isCollapsed && <span className="text-gray-700">Settings</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5 text-red-500" />
                  {!isCollapsed && <span className="text-red-500">Logout</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

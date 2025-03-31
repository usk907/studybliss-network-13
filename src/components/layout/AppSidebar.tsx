
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Calendar, ChevronLeft, ChevronRight, Home, MessageSquare, Settings, User, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isCollapsed }: SidebarLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors">
            <Icon className="h-5 w-5 text-elearn-primary" />
            {!isCollapsed && <span className="text-gray-700">{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        <SidebarLink to="/" icon={Home} label="Dashboard" isCollapsed={isCollapsed} />
        <SidebarLink to="/courses" icon={Book} label="Courses" isCollapsed={isCollapsed} />
        <SidebarLink to="/attendance" icon={Calendar} label="Attendance" isCollapsed={isCollapsed} />
        <SidebarLink to="/performance" icon={BarChart2} label="Performance" isCollapsed={isCollapsed} />
        <SidebarLink to="/chatbot" icon={MessageSquare} label="Ask AI" isCollapsed={isCollapsed} />
        <SidebarLink to="/profile" icon={User} label="Profile" isCollapsed={isCollapsed} />
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <SidebarLink to="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Settings, LogOut, BookOpen, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in for the demo
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchQuery}"`,
      });
      // In a real app, we would redirect to search results page or filter content
    }
  };
  
  const handleSignIn = () => {
    navigate("/login");
  };
  
  const handleSignUp = () => {
    navigate("/login");
  };
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleMyCoursesClick = () => {
    navigate("/courses");
  };
  
  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Settings page is under construction",
    });
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };
  
  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex items-center w-full max-w-xl">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search courses, lessons, and more..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="ml-2 px-4 hidden sm:flex">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                onClick={handleNotificationsClick}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2" size="sm">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://i.pravatar.cc/300" alt="User avatar" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">User</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMyCoursesClick} className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
              <Button onClick={handleSignUp}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

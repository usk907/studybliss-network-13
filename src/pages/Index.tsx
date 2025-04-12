
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, TrendingUp, Users, Calendar, BarChart2, MessageSquare, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {isAdmin && (
            <Button asChild className="ml-auto">
              <Link to="/courses/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </Button>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/courses" className="group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Click to view all courses
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/performance" className="group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Performance
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  View detailed analytics
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/attendance" className="group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 days</div>
                <p className="text-xs text-muted-foreground">
                  Track your attendance
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/chatbot" className="group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Assistant
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24/7</div>
                <p className="text-xs text-muted-foreground">
                  Get learning support
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Course Progress */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Progress</h2>
            <Button variant="outline" asChild size="sm">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Python Programming</CardTitle>
                <CardDescription>Dr. Alan Smith</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last activity</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/courses/1">Continue Learning</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Science</CardTitle>
                <CardDescription>Prof. Sarah Johnson</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last activity</span>
                  <span className="text-muted-foreground">2 days ago</span>
                </div>
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/courses/2">Continue Learning</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Web Development</CardTitle>
                <CardDescription>Mark Williams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last activity</span>
                  <span className="text-muted-foreground">Not started</span>
                </div>
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/courses/3">Start Learning</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Link to="/profile">
              <Card className="hover:shadow-md transition-all h-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="font-medium">Profile</h3>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/settings">
              <Card className="hover:shadow-md transition-all h-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="font-medium">Settings</h3>
                </CardContent>
              </Card>
            </Link>
            
            {isAdmin && (
              <Link to="/courses/create">
                <Card className="hover:shadow-md transition-all h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <PlusCircle className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Create Course</h3>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;

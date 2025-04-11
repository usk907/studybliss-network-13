
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Lock, PlayCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface Module {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface CourseModulesProps {
  courseId: string;
  modules?: Module[];
}

// Sample modules with YouTube videos
const sampleModules: Module[] = [
  {
    id: "1",
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming and get started with your first code.",
    videoUrl: "https://www.youtube.com/embed/zOjov-2OZ0E",
    duration: "12:45",
    isCompleted: true,
    isLocked: false
  },
  {
    id: "2",
    title: "Variables and Data Types",
    description: "Understanding variables, data types and how to use them in your programs.",
    videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg",
    duration: "18:30",
    isCompleted: false,
    isLocked: false
  },
  {
    id: "3",
    title: "Control Flow: Conditionals",
    description: "Learn how to use if statements and conditional logic in your code.",
    videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c",
    duration: "22:15",
    isCompleted: false,
    isLocked: true
  },
  {
    id: "4",
    title: "Loops and Iteration",
    description: "Master the concepts of loops to repeat code execution as needed.",
    videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
    duration: "16:20",
    isCompleted: false,
    isLocked: true
  },
  {
    id: "5",
    title: "Functions and Methods",
    description: "Learn how to organize code into reusable functions and methods.",
    videoUrl: "https://www.youtube.com/embed/DHvZLI7Db8E",
    duration: "25:10",
    isCompleted: false,
    isLocked: true
  }
];

export function CourseModules({ courseId, modules = sampleModules }: CourseModulesProps) {
  const [activeModule, setActiveModule] = useState<Module>(modules[0]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Calculate progress
  const completedModules = modules.filter(m => m.isCompleted).length;
  const progress = Math.round((completedModules / modules.length) * 100);
  
  return (
    <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
      <CardHeader>
        <CardTitle className={isDark ? "text-white" : ""}>Course Modules</CardTitle>
        <CardDescription className={isDark ? "text-gray-400" : ""}>
          Progress: {progress}% Complete
        </CardDescription>
        <Progress value={progress} className={isDark ? "bg-gray-700" : ""} />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="modules">All Modules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="video" className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-md border bg-black">
              <iframe 
                src={activeModule.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={activeModule.title}
              ></iframe>
            </div>
            
            <div className={cn(
              "p-4 rounded-md",
              isDark ? "bg-gray-700" : "bg-gray-100"
            )}>
              <h3 className={cn(
                "text-lg font-semibold mb-2",
                isDark ? "text-white" : ""
              )}>
                {activeModule.title}
              </h3>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                {activeModule.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                  Duration: {activeModule.duration}
                </span>
                {!activeModule.isCompleted ? (
                  <Button onClick={() => {
                    const updatedModules = modules.map(m => 
                      m.id === activeModule.id ? {...m, isCompleted: true} : m
                    );
                    setActiveModule({...activeModule, isCompleted: true});
                  }}>
                    Mark as Completed
                  </Button>
                ) : (
                  <span className="flex items-center text-green-500">
                    <Check className="mr-1" size={16} /> Completed
                  </span>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="modules">
            <div className="space-y-2">
              {modules.map((module) => (
                <div 
                  key={module.id}
                  className={cn(
                    "p-3 rounded-md border cursor-pointer transition-colors",
                    module.isLocked 
                      ? isDark 
                        ? "bg-gray-700 border-gray-600 opacity-60" 
                        : "bg-gray-100 border-gray-200 opacity-60"
                      : activeModule.id === module.id
                        ? isDark
                          ? "bg-blue-800/30 border-blue-700"
                          : "bg-blue-50 border-blue-200"
                        : isDark
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                  onClick={() => {
                    if (!module.isLocked) {
                      setActiveModule(module);
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {module.isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : module.isLocked ? (
                        <Lock className="h-5 w-5 text-gray-400" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <h4 className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-gray-900"
                        )}>
                          {module.title}
                        </h4>
                        <p className={cn(
                          "text-xs",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          Duration: {module.duration}
                        </p>
                      </div>
                    </div>
                    {!module.isLocked && !module.isCompleted && (
                      <Button variant="ghost" size="sm">
                        Watch
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

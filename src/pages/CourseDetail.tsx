
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Calendar, Clock, FileText, PlayCircle, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock course data
const course = {
  id: "1",
  title: "Introduction to Python Programming",
  description:
    "Learn the fundamentals of Python programming language with hands-on projects. This course covers variables, data types, control structures, functions, and basic algorithms. By the end of this course, you'll be able to build simple applications and understand more complex Python code.",
  instructor: "Dr. Alan Smith",
  instructorTitle: "Senior Professor of Computer Science",
  instructorBio: "Dr. Alan Smith has over 15 years of experience in teaching programming and software development. He holds a Ph.D. in Computer Science from MIT and has authored several books on Python programming.",
  thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcb970?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80",
  duration: "8 weeks",
  level: "Beginner",
  language: "English",
  students: 1245,
  rating: 4.8,
  reviews: 325,
  lastUpdated: "June 2023",
  progress: 65,
  category: "Programming",
  price: "Free",
  features: [
    "24/7 Access to course materials",
    "Certificate of completion",
    "Hands-on projects",
    "Discussion forums",
    "Downloadable resources"
  ],
  modules: [
    {
      id: "1",
      title: "Introduction to Python",
      lessons: [
        { id: "1_1", title: "Welcome to Python Programming", type: "video", duration: "10:23", completed: true },
        { id: "1_2", title: "Setting Up Your Development Environment", type: "video", duration: "15:45", completed: true },
        { id: "1_3", title: "Your First Python Program", type: "exercise", duration: "20:00", completed: true },
      ],
    },
    {
      id: "2",
      title: "Python Basics",
      lessons: [
        { id: "2_1", title: "Variables and Data Types", type: "video", duration: "12:33", completed: true },
        { id: "2_2", title: "Operators and Expressions", type: "video", duration: "14:20", completed: true },
        { id: "2_3", title: "Basic Input/Output", type: "video", duration: "08:15", completed: false },
        { id: "2_4", title: "Variables and Operations Quiz", type: "quiz", duration: "15:00", completed: false },
      ],
    },
    {
      id: "3",
      title: "Control Structures",
      lessons: [
        { id: "3_1", title: "Conditional Statements (if, else, elif)", type: "video", duration: "16:42", completed: false },
        { id: "3_2", title: "Loops in Python (for, while)", type: "video", duration: "18:10", completed: false },
        { id: "3_3", title: "Control Structures Practice", type: "exercise", duration: "25:00", completed: false },
      ],
    },
    {
      id: "4",
      title: "Functions and Modules",
      lessons: [
        { id: "4_1", title: "Defining and Using Functions", type: "video", duration: "14:55", completed: false },
        { id: "4_2", title: "Function Parameters and Return Values", type: "video", duration: "13:20", completed: false },
        { id: "4_3", title: "Python Modules and Imports", type: "video", duration: "11:30", completed: false },
        { id: "4_4", title: "Functions Mini-Project", type: "project", duration: "45:00", completed: false },
      ],
    },
    {
      id: "5",
      title: "Data Structures",
      lessons: [
        { id: "5_1", title: "Lists and Tuples", type: "video", duration: "17:25", completed: false },
        { id: "5_2", title: "Dictionaries and Sets", type: "video", duration: "15:40", completed: false },
        { id: "5_3", title: "Working with Data Structures", type: "exercise", duration: "30:00", completed: false },
        { id: "5_4", title: "Data Structures Quiz", type: "quiz", duration: "20:00", completed: false },
      ],
    },
  ],
  assignments: [
    {
      id: "a1",
      title: "Variables and Data Types Exercise",
      description: "Practice working with different Python data types and variable assignments.",
      dueDate: "2023-10-15",
      status: "submitted",
      score: "95/100"
    },
    {
      id: "a2",
      title: "Control Flow Challenge",
      description: "Create a program that uses conditionals and loops to solve a problem.",
      dueDate: "2023-10-22",
      status: "pending",
      score: null
    },
    {
      id: "a3",
      title: "Functions and Modules Project",
      description: "Build a simple calculator using functions and modules.",
      dueDate: "2023-11-05",
      status: "not-started",
      score: null
    }
  ]
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();

  const completedLessons = course.modules.reduce((acc, module) => {
    return acc + module.lessons.filter((lesson) => lesson.completed).length;
  }, 0);
  
  const totalLessons = course.modules.reduce((acc, module) => {
    return acc + module.lessons.length;
  }, 0);
  
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="relative h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <Badge className="mb-2 w-fit">{course.category}</Badge>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-white/90">
              <span>By {course.instructor}</span>
              <span>•</span>
              <span>{course.level}</span>
              <span>•</span>
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{course.rating} ({course.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6 pt-4">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                  <p className="text-gray-700">{course.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Python syntax and basics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Control structures and loops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Functions and modular programming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Data structures: lists, dictionaries, etc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>File I/O operations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Basic algorithms and problem-solving</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Instructor</h3>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full overflow-hidden w-16 h-16">
                      <img
                        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                        alt={course.instructor}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{course.instructor}</h4>
                      <p className="text-sm text-gray-500">{course.instructorTitle}</p>
                      <p className="text-sm mt-2">{course.instructorBio}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Course Curriculum</h2>
                  <div className="text-sm text-gray-500">
                    {completedLessons} of {totalLessons} lessons completed
                  </div>
                </div>
                
                <Progress value={progressPercentage} className="h-2" />
                
                <Accordion type="multiple" className="mt-4">
                  {course.modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between w-full pr-4">
                          <span>{module.title}</span>
                          <span className="text-sm text-gray-500">
                            {module.lessons.filter((l) => l.completed).length}/{module.lessons.length} lessons
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 py-2">
                          {module.lessons.map((lesson) => (
                            <div 
                              key={lesson.id} 
                              className={`flex items-center justify-between p-3 rounded-md ${
                                lesson.completed ? "bg-green-50" : "bg-white hover:bg-gray-50"
                              } transition-colors border`}
                            >
                              <div className="flex items-center gap-3">
                                {lesson.type === "video" && <PlayCircle className="h-5 w-5 text-elearn-primary" />}
                                {lesson.type === "exercise" && <FileText className="h-5 w-5 text-elearn-accent" />}
                                {lesson.type === "quiz" && <FileText className="h-5 w-5 text-elearn-warning" />}
                                {lesson.type === "project" && <FileText className="h-5 w-5 text-elearn-secondary" />}
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {lesson.duration}
                                  </p>
                                </div>
                              </div>
                              {lesson.completed ? (
                                <Badge variant="outline" className="border-green-500 text-green-600">
                                  Completed
                                </Badge>
                              ) : (
                                <Button size="sm" variant="ghost">
                                  Start
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="assignments" className="space-y-4 pt-4">
                <h2 className="text-2xl font-bold mb-4">Assignments</h2>
                <div className="space-y-4">
                  {course.assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {assignment.status === "submitted" && (
                              <>
                                <Badge className="bg-green-500">Submitted</Badge>
                                <span className="text-sm mt-1">{assignment.score}</span>
                              </>
                            )}
                            {assignment.status === "pending" && (
                              <Badge className="bg-yellow-500">Pending</Badge>
                            )}
                            {assignment.status === "not-started" && (
                              <Button size="sm">Start</Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="discussions" className="space-y-4 pt-4">
                <h2 className="text-2xl font-bold mb-4">Discussion Forum</h2>
                <div className="text-center py-8">
                  <p className="text-gray-500">Discussion forum feature coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">{course.price}</div>
                    <Button className="w-full" size="lg">Continue Learning</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-gray-500" />
                      <span>{totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span>Last updated: {course.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">This course includes:</h4>
                    <ul className="space-y-2">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;

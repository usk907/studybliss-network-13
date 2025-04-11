
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Users, BookOpen, Award, Calendar } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { CourseModules } from "@/components/courses/CourseModules";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor_name?: string;
  category: string | null;
  image_url: string | null;
  duration: number | null;
  level: string | null;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();
          
        if (courseError) throw courseError;
        
        // Fetch instructor details if instructor_id exists
        let instructorName = "Unknown Instructor";
        if (courseData?.instructor_id) {
          const { data: instructorData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', courseData.instructor_id)
            .single();
            
          if (instructorData && instructorData.full_name) {
            instructorName = instructorData.full_name;
          }
        }
        
        setCourse({
          ...courseData,
          instructor_name: instructorName
        });
        
        // Check if user is enrolled
        if (user) {
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', id)
            .single();
            
          if (!enrollmentError && enrollmentData) {
            setIsEnrolled(true);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id, user]);
  
  const handleEnroll = async () => {
    if (!user || !course) return;
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          enrolled_at: new Date().toISOString(),
          completion_percentage: 0
        });
        
      if (error) throw error;
      
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className={`h-[300px] w-full md:w-2/3 rounded-xl ${isDark ? 'bg-gray-700' : ''}`} />
            <div className="w-full md:w-1/3 space-y-4">
              <Skeleton className={`h-10 w-3/4 ${isDark ? 'bg-gray-700' : ''}`} />
              <Skeleton className={`h-6 w-1/2 ${isDark ? 'bg-gray-700' : ''}`} />
              <Skeleton className={`h-32 w-full ${isDark ? 'bg-gray-700' : ''}`} />
              <Skeleton className={`h-10 w-full ${isDark ? 'bg-gray-700' : ''}`} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className={`h-32 rounded-lg ${isDark ? 'bg-gray-700' : ''}`} />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (!course) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>
            Course Not Found
          </h2>
          <p className={`text-center mb-6 max-w-md ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className={`rounded-xl overflow-hidden shadow-lg mb-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <img 
                src={course.image_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"} 
                alt={course.title} 
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6">
                <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : ''}`}>
                  {course.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.category && (
                    <Badge variant="outline" className={isDark ? 'border-gray-600 text-gray-300' : ''}>
                      {course.category}
                    </Badge>
                  )}
                  {course.level && (
                    <Badge variant="outline" className={isDark ? 'border-gray-600 text-gray-300' : ''}>
                      {course.level}
                    </Badge>
                  )}
                </div>
                
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 rounded-lg border bg-opacity-50 bg-blue-50 border-blue-100">
                    <Clock className="h-6 w-6 text-blue-500 mb-2" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Duration</span>
                    <span className={`font-medium ${isDark ? 'text-white' : ''}`}>
                      {course.duration ? `${course.duration} hours` : 'Flexible'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg border bg-opacity-50 bg-green-50 border-green-100">
                    <Users className="h-6 w-6 text-green-500 mb-2" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Students</span>
                    <span className={`font-medium ${isDark ? 'text-white' : ''}`}>1,234</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg border bg-opacity-50 bg-purple-50 border-purple-100">
                    <BookOpen className="h-6 w-6 text-purple-500 mb-2" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Lessons</span>
                    <span className={`font-medium ${isDark ? 'text-white' : ''}`}>24</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg border bg-opacity-50 bg-amber-50 border-amber-100">
                    <Award className="h-6 w-6 text-amber-500 mb-2" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Certificate</span>
                    <span className={`font-medium ${isDark ? 'text-white' : ''}`}>Included</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="py-4">
                <CourseModules courseId={course.id} />
              </TabsContent>
              
              <TabsContent value="instructor" className="py-4">
                <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : ''}>About the Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" 
                          alt={course.instructor_name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : ''}`}>{course.instructor_name}</h3>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Senior Developer & Educator</p>
                      </div>
                    </div>
                    <p className={isDark ? 'text-gray-300' : ''}>
                      An experienced educator with over 10 years of industry experience. Specializes in making complex topics accessible to learners of all levels.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="py-4">
                <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : ''}>Student Reviews</CardTitle>
                    <CardDescription className={isDark ? 'text-gray-400' : ''}>
                      See what students are saying about this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p>No reviews yet. Be the first to review this course!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className={`sticky top-6 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : ''}>Course Enrollment</CardTitle>
                <CardDescription className={isDark ? 'text-gray-400' : ''}>
                  Join this course to access all content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex justify-between ${isDark ? 'text-white' : ''}`}>
                  <span>Course Fee</span>
                  <span className="font-semibold">FREE</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Enrollment opens until Dec 31, 2024
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                {isEnrolled ? (
                  <Button className="w-full" disabled>
                    Already Enrolled
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;

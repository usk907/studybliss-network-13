import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceStat {
  present: number;
  absent: number;
  total: number;
}

const Attendance = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStat>({
    present: 24,
    absent: 6,
    total: 30,
  });

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user) return;
      
      try {
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);
          
        if (enrollmentError) throw enrollmentError;
        
        if (enrollments && enrollments.length > 0) {
          const courseIds = enrollments.map(enrollment => enrollment.course_id);
          
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id, title')
            .in('id', courseIds);
            
          if (courseError) throw courseError;
          
          setCourses(courseData || []);
        } else {
          const { data: allCourses, error: allCoursesError } = await supabase
            .from('courses')
            .select('id, title')
            .limit(10);
            
          if (allCoursesError) throw allCoursesError;
          
          setCourses(allCourses || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([
          { id: "1", title: "Introduction to Programming" },
          { id: "2", title: "Web Development Fundamentals" },
          { id: "3", title: "Data Science Basics" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCourses();
  }, [user]);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      if (!user) return;
      
      try {
        let query = supabase
          .from('attendance')
          .select('status, date')
          .eq('user_id', user.id);
          
        if (selectedCourse !== "all") {
          query = query.eq('course_id', selectedCourse);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const present = data.filter(record => record.status === 'present').length;
          const absent = data.filter(record => record.status === 'absent').length;
          
          setAttendanceStats({
            present,
            absent,
            total: present + absent
          });
        } else {
          setAttendanceStats({
            present: 24,
            absent: 6,
            total: 30,
          });
        }
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
      }
    };
    
    fetchAttendanceStats();
  }, [user, selectedCourse]);

  const presentPercentage = Math.round((attendanceStats.present / attendanceStats.total) * 100);
  const absentPercentage = Math.round((attendanceStats.absent / attendanceStats.total) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : ''}`}>Attendance</h1>
          
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className={isDark ? 'text-gray-300' : ''}>Loading courses...</span>
            </div>
          ) : (
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className={`w-[200px] ${isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium text-blue-500 ${isDark ? 'text-blue-400' : ''}`}>Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.present} days</div>
              <Progress 
                value={presentPercentage} 
                className={cn("h-2 mt-2", isDark ? "bg-gray-700" : "bg-gray-100")} 
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {presentPercentage}% of classes
              </p>
            </CardContent>
          </Card>
          
          <Card className={isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium text-red-500 ${isDark ? 'text-red-400' : ''}`}>Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.absent} days</div>
              <Progress 
                value={absentPercentage} 
                className={cn("h-2 mt-2", isDark ? "bg-gray-700" : "bg-gray-100")} 
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {absentPercentage}% of classes
              </p>
            </CardContent>
          </Card>
        </div>
        
        <AttendanceCalendar />
      </div>
    </AppLayout>
  );
};

export default Attendance;

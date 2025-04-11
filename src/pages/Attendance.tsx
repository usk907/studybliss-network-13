
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar as CalendarIcon, Check, Circle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface AttendanceStat {
  present: number;
  absent: number;
  total: number;
}

interface AttendanceRecord {
  date: string;
  status: string;
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
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  // Custom render functions for the calendar
  const getAttendanceForDate = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return attendanceRecords.find(record => record.date === formattedDate);
  };

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
          
          setAttendanceRecords(data.map(record => ({
            date: record.date,
            status: record.status
          })));
        } else {
          // Mock data if no records
          setAttendanceStats({
            present: 24,
            absent: 6,
            total: 30,
          });
          
          // Generate some mock attendance records
          const mockRecords = [];
          const today = new Date();
          for (let i = 0; i < 30; i++) {
            const recordDate = new Date();
            recordDate.setDate(today.getDate() - i);
            
            // Skip weekends in the mock data
            if (recordDate.getDay() === 0 || recordDate.getDay() === 6) {
              continue;
            }
            
            mockRecords.push({
              date: format(recordDate, "yyyy-MM-dd"),
              status: Math.random() > 0.2 ? 'present' : 'absent'
            });
          }
          setAttendanceRecords(mockRecords);
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
        
        <Card className={isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}>
          <CardHeader>
            <CardTitle>Attendance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center mb-2 space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1 rounded-full border-2 border-red-500 flex items-center justify-center">
                    <Circle className="h-2 w-2 text-red-500" />
                  </div>
                  <span className="text-sm">Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1 rounded-full border border-gray-400"></div>
                  <span className="text-sm">No Record</span>
                </div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      isDark ? "bg-gray-700 border-gray-600 text-white" : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    modifiers={{
                      present: attendanceRecords
                        .filter(record => record.status === 'present')
                        .map(record => new Date(record.date)),
                      absent: attendanceRecords
                        .filter(record => record.status === 'absent')
                        .map(record => new Date(record.date))
                    }}
                    modifiersStyles={{
                      present: {
                        backgroundColor: "#10b981",
                        color: "white"
                      },
                      absent: {
                        backgroundColor: "#ef4444",
                        color: "white"
                      }
                    }}
                    components={{
                      DayContent: ({ date, activeModifiers }) => {
                        const attendanceRecord = getAttendanceForDate(date);
                        return (
                          <div className="relative flex items-center justify-center h-8 w-8">
                            {date.getDate()}
                            {attendanceRecord && (
                              <div className="absolute -bottom-0.5">
                                {attendanceRecord.status === 'present' ? (
                                  <Check className="h-3 w-3 text-white" />
                                ) : (
                                  <Circle className="h-2 w-2 text-white" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* Show details for selected date */}
              {date && (
                <div className={cn(
                  "p-4 rounded-md", 
                  isDark ? "bg-gray-700" : "bg-gray-100"
                )}>
                  <h3 className="font-medium mb-2">
                    Attendance for {format(date, "MMMM d, yyyy")}
                  </h3>
                  
                  {(() => {
                    const record = getAttendanceForDate(date);
                    if (!record) {
                      return (
                        <p className="text-sm">No attendance record for this date.</p>
                      );
                    }
                    
                    return (
                      <div className="flex items-center">
                        <span className="mr-2">Status:</span>
                        {record.status === 'present' ? (
                          <span className="text-green-500 flex items-center">
                            <Check className="mr-1 h-4 w-4" /> Present
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <Circle className="mr-1 h-4 w-4" /> Absent
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Attendance;

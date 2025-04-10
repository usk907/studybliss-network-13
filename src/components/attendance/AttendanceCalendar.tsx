
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle } from "lucide-react";

interface AttendanceRecord {
  date: string;
  status: string;
  note?: string;
}

export function AttendanceCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    date: string;
    status: string;
    note?: string;
  } | null>(null);
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; note?: string }>>({});
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        const formattedData: Record<string, { status: string; note?: string }> = {};
        data.forEach((record) => {
          formattedData[record.date] = {
            status: record.status,
            note: record.notes,
          };
        });
        
        // If no data or only a few records, add mock data for demo purposes
        if (Object.keys(formattedData).length < 10) {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          // Generate some present entries
          for (let i = 1; i <= 24; i++) {
            const day = Math.min(i, 28); // Ensure we don't exceed days in month
            const date = new Date(currentYear, currentMonth, day);
            const dateString = date.toISOString().split("T")[0];
            
            // Skip if already has real data
            if (formattedData[dateString]) continue;
            
            // Mark most days as present
            if (i % 4 !== 0) {
              formattedData[dateString] = { status: "present" };
            } else {
              formattedData[dateString] = { status: "absent", note: "Sick leave" };
            }
          }
        }
        
        setAttendanceData(formattedData);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        toast({
          title: "Error",
          description: "Failed to load attendance data",
          variant: "destructive",
        });
        
        // Use mock data as fallback
        setAttendanceData(generateMockAttendanceData());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [user]);

  const generateMockAttendanceData = () => {
    const mockData: Record<string, { status: string; note?: string }> = {};
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Generate attendance for current month
    for (let i = 1; i <= 22; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateString = date.toISOString().split("T")[0];
      
      // Make most days present with some absences
      if (i === 2 || i === 8 || i === 12 || i === 21) {
        mockData[dateString] = { status: "absent", note: "Sick leave" };
      } else {
        mockData[dateString] = { status: "present" };
      }
    }
    
    return mockData;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const attendanceInfo = attendanceData[dateString];
      
      if (attendanceInfo) {
        setSelectedDateInfo({
          date: dateString,
          status: attendanceInfo.status,
          note: attendanceInfo.note,
        });
        toast({
          title: "Attendance Record",
          description: `Status: ${attendanceInfo.status}${attendanceInfo.note ? ` - ${attendanceInfo.note}` : ''}`,
        });
      } else {
        setSelectedDateInfo({
          date: dateString,
          status: "no-record",
        });
        toast({
          title: "No attendance record",
          description: `No attendance data for ${new Date(dateString).toLocaleDateString()}`,
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-blue-500";
      case "absent":
        return "bg-red-500";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <Card className={isDark ? "bg-gray-800 border-gray-700 text-gray-100" : ""}>
      <CardHeader className={isDark ? "border-gray-700" : ""}>
        <CardTitle className={isDark ? "text-gray-100" : ""}>Attendance Calendar</CardTitle>
        <CardDescription className={isDark ? "text-gray-400" : ""}>Track your attendance and view your record</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className={`border rounded-md ${isDark ? "bg-gray-800 border-gray-700 text-gray-100" : ""}`}
            modifiersStyles={{
              present: { 
                color: isDark ? "#fff" : "#fff", 
                backgroundColor: isDark ? "#3b82f6" : "#3b82f6" 
              },
              absent: { 
                color: isDark ? "#fff" : "#fff", 
                backgroundColor: isDark ? "#ef4444" : "#ef4444" 
              },
            }}
            modifiers={{
              present: Object.entries(attendanceData)
                .filter(([_, data]) => data.status === "present")
                .map(([date]) => new Date(date)),
              absent: Object.entries(attendanceData)
                .filter(([_, data]) => data.status === "absent")
                .map(([date]) => new Date(date)),
            }}
            components={{
              DayContent: ({ date, activeModifiers }) => {
                const dateStr = date.toISOString().split("T")[0];
                const isPresent = attendanceData[dateStr]?.status === "present";
                
                return (
                  <div className="relative flex items-center justify-center w-full h-full">
                    {isPresent ? (
                      <CheckCircle className="h-7 w-7 text-blue-500" />
                    ) : (
                      <span>{date.getDate()}</span>
                    )}
                    {attendanceData[dateStr] && (
                      <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        attendanceData[dateStr].status === "present" ? "bg-blue-500" : "bg-red-500"
                      }`}></span>
                    )}
                  </div>
                );
              }
            }}
          />
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className={`font-medium text-sm ${isDark ? "text-gray-300" : ""}`}>Legend</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-blue-500 cursor-pointer" onClick={() => toast({title: "Present", description: "Days you attended class"})}>Present</Badge>
                <Badge className="bg-red-500 cursor-pointer" onClick={() => toast({title: "Absent", description: "Days you missed class"})}>Absent</Badge>
              </div>
            </div>
            
            {selectedDateInfo && (
              <div className={`border rounded-md p-4 ${isDark ? "border-gray-700" : ""}`}>
                <h3 className={`font-medium ${isDark ? "text-gray-200" : ""}`}>
                  {new Date(selectedDateInfo.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={isDark ? "text-gray-300" : ""}>Status:</span>
                  <Badge className={`${getStatusColor(selectedDateInfo.status)} ${isDark ? "text-white" : ""}`}>
                    {selectedDateInfo.status === "no-record"
                      ? "No Record"
                      : selectedDateInfo.status.charAt(0).toUpperCase() +
                        selectedDateInfo.status.slice(1)}
                  </Badge>
                </div>
                {selectedDateInfo.note && (
                  <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Note: {selectedDateInfo.note}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

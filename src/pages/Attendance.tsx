
import { AppLayout } from "@/components/layout/AppLayout";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const Attendance = () => {
  // Modified attendance statistics (removed late, excused, holiday)
  const attendanceStats = {
    present: 24,
    absent: 6,
    total: 30,
  };

  const presentPercentage = Math.round((attendanceStats.present / attendanceStats.total) * 100);
  const absentPercentage = Math.round((attendanceStats.absent / attendanceStats.total) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Attendance</h1>
        
        {/* Attendance Statistics - reduced to only present and absent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.present} days</div>
              <Progress 
                value={presentPercentage} 
                className={cn("h-2 mt-2 bg-gray-100", "before:bg-green-500")} 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {presentPercentage}% of classes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.absent} days</div>
              <Progress 
                value={absentPercentage} 
                className="h-2 mt-2 bg-gray-100" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {absentPercentage}% of classes
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Attendance Calendar */}
        <AttendanceCalendar />
      </div>
    </AppLayout>
  );
};

export default Attendance;

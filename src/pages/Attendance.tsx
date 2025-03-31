
import { AppLayout } from "@/components/layout/AppLayout";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Attendance = () => {
  // Mock attendance statistics
  const attendanceStats = {
    present: 24,
    absent: 3,
    late: 2,
    excused: 1,
    total: 30,
  };

  const presentPercentage = Math.round((attendanceStats.present / attendanceStats.total) * 100);
  const absentPercentage = Math.round((attendanceStats.absent / attendanceStats.total) * 100);
  const latePercentage = Math.round((attendanceStats.late / attendanceStats.total) * 100);
  const excusedPercentage = Math.round((attendanceStats.excused / attendanceStats.total) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Attendance</h1>
        
        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.present} days</div>
              <Progress value={presentPercentage} className="h-2 mt-2 bg-gray-100" indicatorClassName="bg-green-500" />
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
              <Progress value={absentPercentage} className="h-2 mt-2 bg-gray-100" indicatorClassName="bg-red-500" />
              <p className="text-xs text-muted-foreground mt-1">
                {absentPercentage}% of classes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600">Late</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.late} days</div>
              <Progress value={latePercentage} className="h-2 mt-2 bg-gray-100" indicatorClassName="bg-amber-500" />
              <p className="text-xs text-muted-foreground mt-1">
                {latePercentage}% of classes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Excused</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.excused} days</div>
              <Progress value={excusedPercentage} className="h-2 mt-2 bg-gray-100" indicatorClassName="bg-blue-400" />
              <p className="text-xs text-muted-foreground mt-1">
                {excusedPercentage}% of classes
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

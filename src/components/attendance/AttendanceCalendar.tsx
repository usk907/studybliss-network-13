
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock attendance data
// status: "present" | "absent" | "late" | "excused" | "holiday"
const mockAttendanceData: Record<string, { status: string; note?: string }> = {
  "2023-09-01": { status: "present" },
  "2023-09-02": { status: "absent", note: "Sick" },
  "2023-09-05": { status: "late", note: "20 minutes late" },
  "2023-09-07": { status: "present" },
  "2023-09-08": { status: "excused", note: "Doctor appointment" },
  "2023-09-11": { status: "present" },
  "2023-09-12": { status: "present" },
  "2023-09-15": { status: "holiday", note: "School holiday" },
  "2023-09-18": { status: "present" },
  "2023-09-19": { status: "present" },
  "2023-09-20": { status: "present" },
  "2023-09-21": { status: "absent" },
  "2023-09-25": { status: "present" },
  "2023-09-26": { status: "present" },
  "2023-09-27": { status: "late", note: "10 minutes late" },
  "2023-09-28": { status: "present" },
  "2023-09-29": { status: "present" },
};

export function AttendanceCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    date: string;
    status: string;
    note?: string;
  } | null>(null);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const attendanceInfo = mockAttendanceData[dateString];
      
      if (attendanceInfo) {
        setSelectedDateInfo({
          date: dateString,
          status: attendanceInfo.status,
          note: attendanceInfo.note,
        });
      } else {
        setSelectedDateInfo({
          date: dateString,
          status: "no-record",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "late":
        return "bg-amber-500";
      case "excused":
        return "bg-blue-400";
      case "holiday":
        return "bg-purple-400";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calendar</CardTitle>
        <CardDescription>Track your attendance and view your record</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="border rounded-md"
            modifiersStyles={{
              present: { color: "white", backgroundColor: "#10b981" },
              absent: { color: "white", backgroundColor: "#ef4444" },
              late: { color: "white", backgroundColor: "#f59e0b" },
              excused: { color: "white", backgroundColor: "#3b82f6" },
              holiday: { color: "white", backgroundColor: "#8b5cf6" },
            }}
            modifiers={{
              present: Object.entries(mockAttendanceData)
                .filter(([_, data]) => data.status === "present")
                .map(([date]) => new Date(date)),
              absent: Object.entries(mockAttendanceData)
                .filter(([_, data]) => data.status === "absent")
                .map(([date]) => new Date(date)),
              late: Object.entries(mockAttendanceData)
                .filter(([_, data]) => data.status === "late")
                .map(([date]) => new Date(date)),
              excused: Object.entries(mockAttendanceData)
                .filter(([_, data]) => data.status === "excused")
                .map(([date]) => new Date(date)),
              holiday: Object.entries(mockAttendanceData)
                .filter(([_, data]) => data.status === "holiday")
                .map(([date]) => new Date(date)),
            }}
          />
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-sm">Legend</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-500">Present</Badge>
                <Badge className="bg-red-500">Absent</Badge>
                <Badge className="bg-amber-500">Late</Badge>
                <Badge className="bg-blue-400">Excused</Badge>
                <Badge className="bg-purple-400">Holiday</Badge>
              </div>
            </div>
            
            {selectedDateInfo && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium">
                  {new Date(selectedDateInfo.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span>Status:</span>
                  <Badge className={getStatusColor(selectedDateInfo.status)}>
                    {selectedDateInfo.status === "no-record"
                      ? "No Record"
                      : selectedDateInfo.status.charAt(0).toUpperCase() +
                        selectedDateInfo.status.slice(1)}
                  </Badge>
                </div>
                {selectedDateInfo.note && (
                  <p className="text-sm text-gray-600 mt-2">
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

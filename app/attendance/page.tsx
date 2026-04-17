import { AttendanceTable } from "@/components/attendance/AttendanceTable";

export default function AttendancePage() {
  return (
    <div className="space-y-6" style={{ opacity: 0, animation: "fade-in 0.5s ease-out forwards" }}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Attendance Records</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all student attendance records. Filter by date, status, or search by name.
        </p>
      </div>
      <AttendanceTable />
    </div>
  );
}

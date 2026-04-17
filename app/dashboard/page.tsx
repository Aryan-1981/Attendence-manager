"use client";

import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DepartmentBreakdownCard } from "@/components/dashboard/DepartmentBreakdownCard";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";

export default function DashboardPage() {
  const { data, totalRecords, loading } = useAttendance({ initialPageSize: 1000 });

  const today = new Date().toISOString().slice(0, 10);
  const presentToday = data.filter((r) => r.date === today && r.status === "Present").length;
  const totalStudents = totalRecords;
  const absentToday = 0;
  const attendanceRate = totalStudents ? (presentToday / totalStudents) * 100 : 0;

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={loading ? 0 : totalStudents}
          icon={Users}
          color="indigo"
          delay={0}
        />
        <StatsCard
          title="Present Today"
          value={loading ? 0 : presentToday}
          icon={UserCheck}
          color="emerald"
          suffix=""
          delay={100}
        />
        <StatsCard
          title="Absent Today"
          value={loading ? 0 : absentToday}
          icon={UserX}
          color="rose"
          delay={200}
        />
        <StatsCard
          title="Attendance Rate"
          value={loading ? 0 : Number(attendanceRate.toFixed(1))}
          icon={TrendingUp}
          color="amber"
          suffix="%"
          delay={300}
        />
      </div>

      {/* Chart + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions + Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-1 space-y-4">
          <QuickActions />
          <TopPerformers />
        </div>
        <div className="lg:col-span-2">
          <DepartmentBreakdownCard />
        </div>
      </div>
    </div>
  );
}

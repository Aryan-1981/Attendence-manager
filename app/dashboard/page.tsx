"use client";

import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DepartmentBreakdownCard } from "@/components/dashboard/DepartmentBreakdownCard";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { todayStats } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={todayStats.totalStudents}
          icon={Users}
          color="indigo"
          trend={{ value: 2.5, isPositive: true }}
          delay={0}
        />
        <StatsCard
          title="Present Today"
          value={todayStats.presentToday}
          icon={UserCheck}
          color="emerald"
          suffix=""
          trend={{
            value: parseFloat(
              (
                ((todayStats.presentToday - todayStats.yesterdayPresent) /
                  todayStats.yesterdayPresent) *
                100
              ).toFixed(1)
            ),
            isPositive: todayStats.presentToday > todayStats.yesterdayPresent,
          }}
          delay={100}
        />
        <StatsCard
          title="Absent Today"
          value={todayStats.absentToday}
          icon={UserX}
          color="rose"
          trend={{
            value: parseFloat(
              (
                ((todayStats.absentToday - todayStats.yesterdayAbsent) /
                  todayStats.yesterdayAbsent) *
                100
              ).toFixed(1)
            ),
            isPositive: todayStats.absentToday < todayStats.yesterdayAbsent,
          }}
          delay={200}
        />
        <StatsCard
          title="Attendance Rate"
          value={todayStats.attendanceRate}
          icon={TrendingUp}
          color="amber"
          suffix="%"
          trend={{
            value: parseFloat(
              (todayStats.attendanceRate - todayStats.yesterdayRate).toFixed(1)
            ),
            isPositive: todayStats.attendanceRate > todayStats.yesterdayRate,
          }}
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

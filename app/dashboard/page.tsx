"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { todayStats } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          {/* Department Overview */}
          <div
            className="rounded-xl border border-border/50 p-5 glass h-full"
            style={{ opacity: 0, animation: "fade-in 0.5s ease-out 500ms forwards" }}
          >
            <h3 className="text-base font-semibold mb-4">Department Breakdown</h3>
            <div className="space-y-3">
              {[
                { name: "Computer Science", present: 45, total: 52, color: "bg-indigo-500" },
                { name: "Electrical Engineering", present: 38, total: 45, color: "bg-emerald-500" },
                { name: "Business Administration", present: 32, total: 40, color: "bg-amber-500" },
                { name: "Mechanical Engineering", present: 28, total: 35, color: "bg-cyan-500" },
                { name: "Data Science", present: 35, total: 38, color: "bg-violet-500" },
                { name: "Information Technology", present: 35, total: 38, color: "bg-rose-500" },
              ].map((dept) => {
                const pct = Math.round((dept.present / dept.total) * 100);
                return (
                  <div key={dept.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{dept.name}</span>
                      <span className="font-mono font-medium text-xs">
                        {dept.present}/{dept.total}{" "}
                        <span className="text-muted-foreground">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dept.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

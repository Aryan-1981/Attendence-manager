"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/attendance/StatusBadge";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Edit,
  Camera,
  Shield,
  Award,
  Download,
  Trophy,
  Sparkles,
} from "lucide-react";
import { attendanceRecords, students } from "@/lib/mock-data";
import { toasts } from "@/lib/toasts";
import { useCountUp } from "@/hooks/useCountUp";

const user = {
  name: "Admin User",
  email: "admin@attendtrack.com",
  phone: "+91 9876543210",
  department: "Administration",
  role: "System Administrator",
  joinDate: "2024-01-15",
  avatar: "AK",
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function ringDash(progress01: number) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const filled = c * clamp01(progress01);
  const rest = c - filled;
  return `${filled} ${rest}`;
}

function lastNDays(n: number) {
  const days: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const x = new Date(d);
    x.setDate(d.getDate() - (n - 1 - i));
    days.push(x.toISOString().slice(0, 10));
  }
  return days;
}

function Heatmap({ byDate }: { byDate: Record<string, "Present" | "Absent" | "Late"> }) {
  const days = useMemo(() => lastNDays(90), []);

  return (
    <div className="rounded-2xl border border-border/50 glass p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold">Last 90 days</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Consistency heatmap</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Late
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
        {days.map((date) => {
          const st = byDate[date];
          const cls =
            st === "Present"
              ? "bg-emerald-500/60"
              : st === "Late"
                ? "bg-amber-500/65"
                : st === "Absent"
                  ? "bg-rose-500/65"
                  : "bg-foreground/6 dark:bg-white/6";

          return (
            <div
              key={date}
              className={cn(
                "h-3.5 rounded-sm",
                "ring-1 ring-border/25",
                "transition-transform duration-200 hover:scale-110",
                cls
              )}
              title={st ? `${date} — ${st}` : date}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Simulated personal attendance stats
  const myRecords = attendanceRecords.filter((r) => r.studentId === students[0].id);
  const presentDays = myRecords.filter((r) => r.status === "Present").length;
  const absentDays = myRecords.filter((r) => r.status === "Absent").length;
  const lateDays = myRecords.filter((r) => r.status === "Late").length;
  const totalDays = myRecords.length || 1;
  const attendanceRateNum = (presentDays / totalDays) * 100;
  const attendanceRate = attendanceRateNum.toFixed(1);

  const animatedScore = useCountUp(Math.round(attendanceRateNum), { durationMs: 1300, delayMs: 120, decimals: 0 });
  const animatedRate = useCountUp(Number(attendanceRate), { durationMs: 1300, delayMs: 180, decimals: 1 });
  const animatedPresent = useCountUp(presentDays, { durationMs: 1100, delayMs: 220, decimals: 0 });
  const animatedAbsent = useCountUp(absentDays, { durationMs: 1100, delayMs: 260, decimals: 0 });
  const animatedLate = useCountUp(lateDays, { durationMs: 1100, delayMs: 300, decimals: 0 });

  const recentRecords = myRecords.slice(0, 10);

  const byDate = useMemo(() => {
    const map: Record<string, "Present" | "Absent" | "Late"> = {};
    for (const r of myRecords) map[r.date] = r.status;
    return map;
  }, [myRecords]);

  const completion = clamp01(attendanceRateNum / 100);

  const achievements = useMemo(
    () => [
      { label: "Verified Admin", icon: Shield, tone: "indigo" as const },
      { label: "7-day streak", icon: Sparkles, tone: "emerald" as const },
      { label: "Top performer", icon: Trophy, tone: "amber" as const },
    ],
    []
  );

  const downloadReport = async () => {
    const id = toasts.exportStarted("Report");
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, 900));
    toasts.exportSuccess(id, "Report");
  };

  return (
    <div className="space-y-6 max-w-6xl" style={{ opacity: 0, animation: "fade-in 0.5s ease-out forwards" }}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and view your attendance summary.
        </p>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 glass">
        <div
          aria-hidden
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(800px 320px at 15% 20%, rgba(99,102,241,0.20) 0%, transparent 60%), radial-gradient(700px 320px at 85% 35%, rgba(56,189,248,0.18) 0%, transparent 60%), radial-gradient(720px 340px at 45% 110%, rgba(168,85,247,0.16) 0%, transparent 60%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 shimmer opacity-40" />

        <div className="relative p-6 sm:p-7 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {user.avatar}
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-background/70 border border-border/60 rounded-full grid place-items-center hover:bg-background/90 transition-colors"
                aria-label="Change avatar"
                onClick={() => toasts.comingSoon("Avatar upload")}
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{user.department}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {achievements.map((a) => {
                  const Icon = a.icon;
                  const tone =
                    a.tone === "emerald"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : a.tone === "amber"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";

                  return (
                    <span
                      key={a.label}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border",
                        tone
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {a.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={downloadReport}
            >
              <Download className="w-4 h-4" />
              Download report
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) toasts.success("Profile updated", "Your changes have been saved.");
              }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-1 space-y-4">
          {/* completion ring */}
          <div className="rounded-2xl border border-border/50 p-5 glass">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-semibold">Attendance Score</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Last 30 working days</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Rate</p>
                <p className="text-lg font-semibold tabular-nums">{animatedRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[120px_1fr] gap-4 items-center">
              <div className="relative w-[120px] h-[120px]">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="10"
                    className="dark:stroke-white/10 stroke-foreground/10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={ringDash(completion)}
                    className="drop-shadow"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="rgb(99,102,241)" />
                      <stop offset="0.5" stopColor="rgb(56,189,248)" />
                      <stop offset="1" stopColor="rgb(168,85,247)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="text-3xl font-semibold tabular-nums">{animatedScore}</p>
                    <p className="text-xs text-muted-foreground">score</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-2xl font-bold font-mono text-emerald-500 tabular-nums">{Math.round(animatedPresent)}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Present</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-2xl font-bold font-mono text-rose-500 tabular-nums">{Math.round(animatedAbsent)}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Absent</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-2xl font-bold font-mono text-amber-500 tabular-nums">{Math.round(animatedLate)}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Late</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-2xl font-bold font-mono text-indigo-500 tabular-nums">{animatedRate.toFixed(1)}%</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* heatmap */}
          <Heatmap byDate={byDate} />
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal Info Form */}
          <div className="rounded-2xl border border-border/50 p-6 glass">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold">Personal Information</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Keep your details up to date</p>
              </div>
              {!isEditing && (
                <span className="text-xs px-2 py-1 rounded-full border border-border/60 bg-background/30 text-muted-foreground">
                  Read-only
                </span>
              )}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <Input defaultValue={user.name} disabled={!isEditing} className="h-9 bg-secondary/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                <Input defaultValue={user.email} disabled={!isEditing} className="h-9 bg-secondary/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                <Input defaultValue={user.phone} disabled={!isEditing} className="h-9 bg-secondary/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Department</label>
                <Input defaultValue={user.department} disabled={!isEditing} className="h-9 bg-secondary/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <Input defaultValue={user.role} disabled className="h-9 bg-secondary/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Join Date</label>
                <Input defaultValue={user.joinDate} disabled className="h-9 bg-secondary/30" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border/60 bg-background/30 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Profile completeness</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add a profile photo and connect a backup email to reach 100%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Attendance History */}
          <div className="rounded-2xl border border-border/50 p-6 glass">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold">Recent Attendance</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Your latest check-ins</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 gap-2"
                onClick={() => toasts.comingSoon("Attendance export")}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Check-In</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Check-Out</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((record) => (
                    <tr key={record.id} className="border-b border-border/20 hover:bg-accent/20 transition-colors">
                      <td className="py-2.5 px-3 text-muted-foreground tabular-nums">{record.date}</td>
                      <td className="py-2.5 px-3 font-mono">{record.checkIn}</td>
                      <td className="py-2.5 px-3 font-mono">{record.checkOut}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{record.duration}</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))}
                  {recentRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-muted-foreground">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

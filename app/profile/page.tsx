"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/attendance/StatusBadge";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Edit,
  Camera,
  Shield,
  Award,
} from "lucide-react";
import { students, attendanceRecords } from "@/lib/mock-data";
import { toast } from "sonner";

const user = {
  name: "Admin User",
  email: "admin@attendtrack.com",
  phone: "+91 9876543210",
  department: "Administration",
  role: "System Administrator",
  joinDate: "2024-01-15",
  avatar: "AK",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Get personal attendance stats (simulated as a student view)
  const myRecords = attendanceRecords.filter((r) => r.studentId === students[0].id);
  const presentDays = myRecords.filter((r) => r.status === "Present").length;
  const absentDays = myRecords.filter((r) => r.status === "Absent").length;
  const lateDays = myRecords.filter((r) => r.status === "Late").length;
  const totalDays = myRecords.length || 1;
  const attendanceRate = ((presentDays / totalDays) * 100).toFixed(1);
  const recentRecords = myRecords.slice(0, 10);

  return (
    <div
      className="space-y-6 max-w-5xl"
      style={{ opacity: 0, animation: "fade-in 0.5s ease-out forwards" }}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and view your attendance summary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border/50 p-6 glass text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                {user.avatar}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white hover:bg-indigo-600 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold mt-4">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.role}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs text-indigo-500 font-medium">Verified Admin</span>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined {user.joinDate}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) toast.success("Profile updated successfully");
              }}
              className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          {/* Attendance Summary Mini Card */}
          <div className="rounded-xl border border-border/50 p-5 glass">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-semibold">Attendance Summary</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-2xl font-bold font-mono text-emerald-500">{presentDays}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Present</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <p className="text-2xl font-bold font-mono text-rose-500">{absentDays}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Absent</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-2xl font-bold font-mono text-amber-500">{lateDays}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Late</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-2xl font-bold font-mono text-indigo-500">{attendanceRate}%</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info + Recent Records */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal Info Form */}
          <div className="rounded-xl border border-border/50 p-6 glass">
            <h4 className="text-base font-semibold mb-4">Personal Information</h4>
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
            </div>
          </div>

          {/* Recent Attendance History */}
          <div className="rounded-xl border border-border/50 p-6 glass">
            <h4 className="text-base font-semibold mb-4">Recent Attendance History</h4>
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
                      <td className="py-2.5 px-3 text-muted-foreground">{record.date}</td>
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
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
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

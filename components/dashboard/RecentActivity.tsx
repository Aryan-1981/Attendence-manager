"use client";

import { useState, useEffect, useCallback } from "react";
import { recentActivity, students, avatarColorMap } from "@/lib/mock-data";
import type { ActivityItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const avatarColors = [
  "bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500",
  "bg-cyan-500", "bg-violet-500", "bg-pink-500", "bg-teal-500",
];

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>(recentActivity.slice(0, 8));
  const [isNew, setIsNew] = useState<string | null>(null);

  const addActivity = useCallback(() => {
    const student = students[Math.floor(Math.random() * students.length)];
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      name: student.name,
      avatar: student.avatar,
      action: Math.random() > 0.5 ? "Checked In" : "Checked Out",
      time: "just now",
      color: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    };

    setIsNew(newActivity.id);
    setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

    setTimeout(() => setIsNew(null), 1000);
  }, []);

  useEffect(() => {
    const interval = setInterval(addActivity, 8000);
    return () => clearInterval(interval);
  }, [addActivity]);

  return (
    <div
      className="rounded-xl border border-border/50 p-5 glass h-full flex flex-col"
      style={{ opacity: 0, animation: "fade-in 0.5s ease-out 300ms forwards" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Live Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time check-ins</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="w-2 h-2 bg-emerald-500 rounded-full absolute inset-0 animate-ping" />
          </div>
          <span className="text-xs text-emerald-500 font-medium">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 -mr-1">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300",
              isNew === activity.id
                ? "bg-indigo-500/5 border border-indigo-500/10"
                : "hover:bg-accent/30"
            )}
            style={
              isNew === activity.id
                ? { animation: "slide-in-right 0.3s ease-out forwards" }
                : undefined
            }
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                activity.color || avatarColorMap[activity.avatar] || "bg-indigo-500"
              )}
            >
              {activity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.name}</p>
              <p className="text-xs text-muted-foreground">
                <span
                  className={cn(
                    activity.action === "Checked In" ? "text-emerald-500" : "text-amber-500"
                  )}
                >
                  {activity.action}
                </span>
                {" · "}
                {activity.time}
              </p>
            </div>
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                activity.action === "Checked In" ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

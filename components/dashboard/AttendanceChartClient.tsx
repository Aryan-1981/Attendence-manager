"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { weeklyData, lastWeekData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-xl">
        <p className="font-medium text-sm mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-xs text-muted-foreground">Present:</span>
            <span className="text-xs font-mono font-bold">{payload[0]?.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs text-muted-foreground">Absent:</span>
            <span className="text-xs font-mono font-bold">{payload[1]?.value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function AttendanceChartClient() {
  const [period, setPeriod] = useState<"this" | "last">("this");
  const data = period === "this" ? weeklyData : lastWeekData;

  return (
    <div
      className="rounded-xl border border-border/50 p-5 glass"
      style={{ opacity: 0, animation: "fade-in 0.5s ease-out 200ms forwards" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold">Weekly Overview</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Student attendance distribution
          </p>
        </div>
        <div className="flex items-center bg-secondary/50 rounded-lg p-0.5">
          <button
            onClick={() => setPeriod("this")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              period === "this"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("last")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              period === "last"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Last Week
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full min-h-[280px] min-w-0">
        <div className="h-full w-full min-h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4} barSize={20}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-border/30"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{
                  fill: "currentColor",
                  className: "text-muted-foreground",
                  fontSize: 12,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "currentColor",
                  className: "text-muted-foreground",
                  fontSize: 12,
                }}
                width={35}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "currentColor", className: "text-muted/10" }}
              />
              <Bar dataKey="present" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#F43F5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span className="text-xs text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-rose-500" />
          <span className="text-xs text-muted-foreground">Absent</span>
        </div>
      </div>
    </div>
  );
}

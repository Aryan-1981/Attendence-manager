"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

type Range = "day" | "week" | "month";

type Point = {
  label: string;
  present: number;
  absent: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const p = payload?.find((x: any) => x.dataKey === "present")?.value;
  const a = payload?.find((x: any) => x.dataKey === "absent")?.value;

  return (
    <div className="glass border border-border/60 rounded-xl px-4 py-3 shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-1 rounded-full bg-indigo-500 shadow-[0_0_18px_rgba(99,102,241,0.6)]" />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500/90" />
            <span className="text-xs text-muted-foreground">Present</span>
          </div>
          <span className="text-xs font-mono font-semibold tabular-nums">{p}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500/90" />
            <span className="text-xs text-muted-foreground">Absent</span>
          </div>
          <span className="text-xs font-mono font-semibold tabular-nums">{a}</span>
        </div>
      </div>
    </div>
  );
}

function togglePill(active: boolean) {
  return cn(
    "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
    active
      ? "bg-background text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground"
  );
}

export default function AttendanceChartClient() {
  const [range, setRange] = useState<Range>("week");

  const data = useMemo<Point[]>(() => {
    if (range === "day") {
      return [
        { label: "8a", present: 18, absent: 0 },
        { label: "9a", present: 72, absent: 2 },
        { label: "10a", present: 126, absent: 6 },
        { label: "11a", present: 168, absent: 10 },
        { label: "12p", present: 185, absent: 14 },
        { label: "1p", present: 192, absent: 16 },
        { label: "2p", present: 200, absent: 18 },
        { label: "3p", present: 206, absent: 22 },
        { label: "4p", present: 213, absent: 28 },
      ];
    }

    if (range === "month") {
      return [
        { label: "W1", present: 1080, absent: 140 },
        { label: "W2", present: 1138, absent: 122 },
        { label: "W3", present: 1102, absent: 164 },
        { label: "W4", present: 1188, absent: 96 },
      ];
    }

    // week
    return [
      { label: "Mon", present: 220, absent: 28 },
      { label: "Tue", present: 235, absent: 13 },
      { label: "Wed", present: 228, absent: 20 },
      { label: "Thu", present: 213, absent: 35 },
      { label: "Fri", present: 240, absent: 8 },
      { label: "Sat", present: 0, absent: 0 },
      { label: "Sun", present: 0, absent: 0 },
    ];
  }, [range]);

  const totals = useMemo(() => {
    const present = data.reduce((acc, d) => acc + d.present, 0);
    const absent = data.reduce((acc, d) => acc + d.absent, 0);
    const total = Math.max(present + absent, 1);
    return {
      present,
      absent,
      rate: Math.round((present / total) * 1000) / 10,
    };
  }, [data]);

  return (
    <div
      className="rounded-xl border border-border/50 p-5 glass"
      style={{ opacity: 0, animation: "fade-in 0.5s ease-out 200ms forwards" }}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold">Attendance Overview</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Presence trend ·{" "}
            <span className="font-mono tabular-nums">{totals.rate}%</span> avg
          </p>
        </div>

        <div className="flex items-center bg-secondary/50 rounded-lg p-0.5">
          <button onClick={() => setRange("day")} className={togglePill(range === "day")}>
            Today
          </button>
          <button onClick={() => setRange("week")} className={togglePill(range === "week")}>
            Week
          </button>
          <button
            onClick={() => setRange("month")}
            className={togglePill(range === "month")}
          >
            Month
          </button>
        </div>
      </div>

      <div className="relative h-[280px] w-full min-h-[280px] min-w-0">
        <div className="absolute inset-x-0 -top-2 h-16 bg-[radial-gradient(500px_80px_at_50%_0%,rgba(99,102,241,0.35),transparent_70%)] pointer-events-none" />

        <div className="h-full w-full min-h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="presentFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.45} />
                  <stop offset="55%" stopColor="#6366F1" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-border/30"
                vertical={false}
              />

              <XAxis
                dataKey="label"
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
                width={36}
                className="text-xs"
                tick={{
                  fill: "currentColor",
                  className: "text-muted-foreground",
                  fontSize: 12,
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "currentColor", className: "text-muted-foreground/25" }}
              />

              <Area
                type="monotone"
                dataKey="present"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#presentFill)"
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#6366F1",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                }}
              />
              <Area
                type="monotone"
                dataKey="absent"
                stroke="#F43F5E"
                strokeWidth={1.5}
                fill="url(#absentFill)"
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: "#F43F5E",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span className="text-xs text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-rose-500" />
          <span className="text-xs text-muted-foreground">Absent</span>
        </div>
      </div>
    </div>
  );
}

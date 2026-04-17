"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { recentActivity } from "@/lib/mock-data";
import type { ActivityItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, LogIn, LogOut } from "lucide-react";

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function gradientForName(name: string) {
  const h = hashString(name) % 360;
  const h2 = (h + 40) % 360;
  return {
    backgroundImage: `linear-gradient(135deg, hsl(${h} 85% 55%), hsl(${h2} 85% 55%))`,
  } as React.CSSProperties;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function toRelativeShort(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 10) return "now";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

type LiveItem = ActivityItem & { timestamp: number };

const baseLiveSeed: LiveItem[] = recentActivity.slice(0, 10).map((a, i) => ({
  ...a,
  // spread across the last ~35 minutes
  timestamp: Date.now() - (i * 3 + 1) * 60_000,
}));

export function RecentActivity() {
  const [items, setItems] = useState<LiveItem[]>(baseLiveSeed);
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // keep relative times fresh (no layout shifts)
  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 15_000);
    return () => window.clearInterval(t);
  }, []);

  // add new activity periodically (demo)
  useEffect(() => {
    const t = window.setInterval(() => {
      const pick = recentActivity[Math.floor(Math.random() * recentActivity.length)]!;
      const id = `act-live-${Date.now()}`;
      const next: LiveItem = {
        ...pick,
        id,
        timestamp: Date.now(),
      };

      setPulseId(id);
      setItems((prev) => [next, ...prev].slice(0, 10));
      window.setTimeout(() => setPulseId(null), 900);
    }, 8_000);

    return () => window.clearInterval(t);
  }, []);

  const rendered = useMemo(() => {
    // `tick` exists to refresh the memo.
    void tick;
    return items.map((it) => ({
      ...it,
      relative: toRelativeShort(Date.now() - it.timestamp),
    }));
  }, [items, tick]);

  return (
    <section
      className="rounded-2xl border border-border/50 glass h-full flex flex-col overflow-hidden"
      style={{ opacity: 0, animation: "fade-in 0.5s ease-out 300ms forwards" }}
    >
      <header className="px-5 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Live Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time check-ins</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-emerald-500 font-medium">Live</span>
        </div>
      </header>

      <div className="px-5">
        <div className="h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="relative">
          {/* timeline rail */}
          <div className="pointer-events-none absolute left-[18px] top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />

          <ul className="space-y-1">
            {rendered.map((activity) => {
              const isIn = activity.action === "Checked In";
              const Icon = isIn ? LogIn : LogOut;

              return (
                <li
                  key={activity.id}
                  className={cn(
                    "group relative rounded-xl",
                    "transition-[transform,background-color,border-color,box-shadow] duration-300",
                    pulseId === activity.id
                      ? "bg-indigo-500/6 border border-indigo-500/12 shadow-[0_0_0_1px_rgba(99,102,241,0.12)]"
                      : "hover:bg-accent/30"
                  )}
                >
                  <div className="flex items-center gap-3 p-2.5">
                    {/* avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full grid place-items-center text-[10px] font-semibold text-white",
                          "shadow-sm ring-1 ring-border/50"
                        )}
                        style={gradientForName(activity.name)}
                      >
                        {initials(activity.name)}
                      </div>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full grid place-items-center",
                          "bg-background ring-1 ring-border/50"
                        )}
                      >
                        <Icon className={cn("h-3 w-3", isIn ? "text-emerald-500" : "text-amber-500")} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{activity.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{activity.relative}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className={cn(isIn ? "text-emerald-500" : "text-amber-500")}>{activity.action}</span>
                        <span className="opacity-60"> · </span>
                        <span className="opacity-80">Attendance updated</span>
                      </p>
                    </div>

                    <div
                      className={cn(
                        "shrink-0 h-1.5 w-1.5 rounded-full",
                        isIn ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                  </div>

                  {/* subtle hover sheen */}
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      "bg-[radial-gradient(260px_160px_at_20%_0%,rgba(255,255,255,0.10)_0%,transparent_60%)]"
                    )}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <footer className="px-5 pb-5 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Updates every few seconds</span>
          </div>
          <button
            type="button"
            className={cn(
              "text-xs font-medium px-2.5 py-1.5 rounded-full",
              "border border-border/60 bg-background/40 hover:bg-background/60",
              "transition-colors"
            )}
          >
            View all
          </button>
        </div>
      </footer>
    </section>
  );
}

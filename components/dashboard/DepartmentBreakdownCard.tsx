"use client";

import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";

type Dept = { name: string; present: number; total: number; accent: string };

export function DepartmentBreakdownCard({ className }: { className?: string }) {
  const depts: Dept[] = [
    { name: "Computer Science", present: 45, total: 52, accent: "from-indigo-500/70 via-indigo-500/35" },
    { name: "Electrical Engineering", present: 38, total: 45, accent: "from-emerald-500/70 via-emerald-500/35" },
    { name: "Business Administration", present: 32, total: 40, accent: "from-amber-500/70 via-amber-500/35" },
    { name: "Mechanical Engineering", present: 28, total: 35, accent: "from-cyan-500/70 via-cyan-500/35" },
    { name: "Data Science", present: 35, total: 38, accent: "from-violet-500/70 via-violet-500/35" },
    { name: "Information Technology", present: 35, total: 38, accent: "from-rose-500/70 via-rose-500/35" },
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 glass",
        "shadow-[0_30px_120px_-55px_rgba(99,102,241,0.24)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(900px_360px_at_10%_0%,rgba(99,102,241,0.14),transparent_60%),radial-gradient(700px_320px_at_95%_30%,rgba(56,189,248,0.10),transparent_55%)]" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <h3 className="text-base font-semibold">Department breakdown</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Present vs total by department (demo data).
          </p>
        </div>
        <div className="rounded-full border border-border/60 bg-secondary/20 px-2.5 py-1 text-[11px] text-muted-foreground">
          <span className="tabular-nums">Today</span>
        </div>
      </div>

      <div className="relative mt-4 space-y-3">
        {depts.map((d, idx) => {
          const pct = Math.round((d.present / d.total) * 100);
          return (
            <div
              key={d.name}
              className="rounded-xl border border-border/60 bg-secondary/15 px-3 py-3"
              style={{ animation: "fade-in 0.45s ease-out forwards", opacity: 0, animationDelay: `${150 + idx * 55}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground/90">{d.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    <span className="tabular-nums font-mono">{d.present}</span> present ·{" "}
                    <span className="tabular-nums font-mono">{d.total}</span> total
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="tabular-nums text-xs font-mono text-foreground/80">{pct}%</span>
                  <span
                    className={cn(
                      "inline-flex h-6 items-center rounded-full border border-border/60 bg-background/30 px-2 text-[11px] text-muted-foreground",
                      "backdrop-blur"
                    )}
                  >
                    {d.present}/{d.total}
                  </span>
                </div>
              </div>

              <div className="mt-2 h-2 rounded-full bg-secondary/40 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    d.accent,
                    "to-transparent"
                  )}
                  style={{ width: `${pct}%` }}
                />
                <div className="-mt-2 h-2 rounded-full shimmer opacity-30" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Performer = {
  name: string;
  dept: string;
  streakDays: number;
  attendanceRate: number;
};

function hashToHue(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) % 360;
  return h;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "");
}

export function TopPerformers({ className }: { className?: string }) {
  const performers: Performer[] = [
    { name: "Aarav Mehta", dept: "Computer Science", streakDays: 14, attendanceRate: 98 },
    { name: "Sara Khan", dept: "Data Science", streakDays: 11, attendanceRate: 97 },
    { name: "Ishaan Patel", dept: "Electrical Eng.", streakDays: 9, attendanceRate: 96 },
    { name: "Ananya Roy", dept: "Business", streakDays: 8, attendanceRate: 95 },
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 glass",
        "shadow-[0_30px_120px_-55px_rgba(99,102,241,0.35)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(900px_360px_at_0%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_320px_at_120%_20%,rgba(56,189,248,0.10),transparent_55%)]" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <h3 className="text-base font-semibold">Top performers</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Highest consistency over the last 2 weeks.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Live</span>
          <span className="h-1 w-1 rounded-full bg-amber-400/70" />
          <span className="tabular-nums">2026</span>
        </div>
      </div>

      <div className="relative mt-4 space-y-2">
        {performers.map((p, idx) => {
          const hue = hashToHue(p.name);
          return (
            <div
              key={p.name}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-border/60 bg-secondary/20 px-3 py-3",
                "motion-default hover:-translate-y-[1px] hover:border-border/80"
              )}
              style={{ animation: "fade-in 0.45s ease-out forwards", opacity: 0, animationDelay: `${100 + idx * 70}ms` }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    `radial-gradient(500px 200px at 20% 0%, hsla(${hue} 90% 60% / .16), transparent 60%), radial-gradient(600px 200px at 80% 100%, hsla(${(hue + 40) % 360} 90% 60% / .12), transparent 60%)`,
                }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 shrink-0 rounded-xl border border-border/60 grid place-items-center text-xs font-semibold text-foreground/80"
                    style={{
                      background: `linear-gradient(135deg, hsla(${hue} 90% 60% / .22), hsla(${(hue + 40) % 360} 90% 60% / .10))`,
                    }}
                  >
                    {initials(p.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <span className="rounded-full border border-border/60 bg-background/30 px-2 py-0.5 text-[11px] text-muted-foreground">
                        {p.dept}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <span className="tabular-nums font-mono">{p.streakDays}</span> day streak ·{" "}
                      <span className="tabular-nums font-mono">{p.attendanceRate}%</span> rate
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-secondary/35 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400/70 via-amber-400/50 to-transparent"
                      style={{ width: `${p.attendanceRate}%` }}
                    />
                  </div>
                  <div className="tabular-nums text-xs font-mono text-foreground/80">{p.attendanceRate}%</div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-y-0 -left-1 w-24 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="h-full w-full shimmer" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

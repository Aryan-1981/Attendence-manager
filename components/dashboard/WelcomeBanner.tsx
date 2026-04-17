"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { CalendarDays, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function getGreeting(hours: number) {
  if (hours < 12) return "Good morning";
  if (hours < 18) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({ className }: { className?: string }) {
  const now = useMemo(() => new Date(), []);
  const greeting = useMemo(() => getGreeting(now.getHours()), [now]);
  const dateLabel = useMemo(() => format(now, "EEEE, d MMM"), [now]);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6 glass",
        "shadow-[0_30px_120px_-55px_rgba(99,102,241,0.45)]",
        "page-enter",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-80",
          "bg-[radial-gradient(900px_360px_at_10%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_320px_at_95%_20%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(900px_420px_at_55%_110%,rgba(168,85,247,0.10),transparent_55%)]"
        )}
      />
      <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/25 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-foreground/80">Attendance overview</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span className="tabular-nums">{dateLabel}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {greeting}, <span className="text-gradient">Admin</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Here’s what’s happening today. Track attendance, follow trends, and review recent activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/20 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
            <CalendarDays className="h-4 w-4 text-indigo-500" />
            <span className="tabular-nums">{format(now, "PP")}</span>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-secondary/20 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
            <span className="relative z-10">Tip: Press</span>{" "}
            <kbd className="relative z-10 rounded-md border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">
              Ctrl
            </kbd>
            {" "}
            <span className="relative z-10">+</span>{" "}
            <kbd className="relative z-10 rounded-md border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">
              K
            </kbd>
            <div className="absolute inset-0 opacity-70 shimmer" />
          </div>
        </div>
      </div>
    </section>
  );
}

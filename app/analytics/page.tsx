"use client";

import { useMemo, useState } from "react";
import { BellRing, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toasts } from "@/lib/toasts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function Bars() {
  const bars = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const h = 18 + ((i * 13) % 64);
        const d = (i % 10) * 110;
        return { h, d, i };
      }),
    []
  );

  return (
    <div className="relative mt-10">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-2xl" />
      <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-4 shadow-[0_30px_120px_-50px_rgba(99,102,241,0.45)]">
        <div className="flex items-end gap-1.5 h-[180px]">
          {bars.map((b) => (
            <div
              key={b.i}
              className="flex-1 rounded-md bg-gradient-to-t from-indigo-500/35 via-indigo-500/15 to-transparent relative overflow-hidden"
              style={{ height: `${b.h}%` }}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-70",
                  "bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.25),transparent)]",
                  "bg-[length:220%_100%]",
                  "animate-[shimmer_1.6s_ease-in-out_infinite]"
                )}
                style={{ animationDelay: `${b.d}ms` }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(500px_140px_at_50%_90%,rgba(99,102,241,0.55),transparent_65%)]" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Attendance insights</span>
          <span className="tabular-nums">ETA: ~2 weeks</span>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 w-fit rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>New page</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span className="text-foreground/80">Coming soon</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Analytics that feels <span className="text-gradient">instant</span>.
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          We’re building a premium analytics experience for admins: cohort trends, punctuality
          patterns, department comparisons, and exportable reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl p-6 glass relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-70 bg-[radial-gradient(900px_300px_at_15%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_280px_at_90%_10%,rgba(56,189,248,0.12),transparent_55%)]" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                <h3 className="text-base font-semibold">Dashboard preview</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                CSS-only animated visualization (no data yet).
              </p>
            </div>
            <div className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
              Early access
            </div>
          </div>

          <Bars />
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl p-6 glass">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <BellRing className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Get notified</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Drop your email to be notified when analytics launches.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="h-10 bg-secondary/30 border-border/60"
            />
            <Button
              className="w-full gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
              onClick={() => {
                if (!email.trim()) {
                  toasts.validationError("Enter an email address to join the waitlist.");
                  return;
                }
                toast.success("You’re on the list", { description: "We’ll email you when analytics launches." });
                setEmail("");
              }}
            >
              Join waitlist
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-[11px] text-muted-foreground">
              No spam. One email when it’s ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

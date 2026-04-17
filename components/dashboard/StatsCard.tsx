"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "indigo" | "emerald" | "rose" | "amber";
  suffix?: string;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
    border: "border-indigo-500/20",
    glow: "shadow-indigo-500/5",
    hoverGlow: "hover:glow-indigo",
    spot: "rgba(99, 102, 241, 0.18)",
    sweep: "rgba(99, 102, 241, 0.14)",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/5",
    hoverGlow: "hover:glow-emerald",
    spot: "rgba(16, 185, 129, 0.18)",
    sweep: "rgba(16, 185, 129, 0.14)",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/5",
    hoverGlow: "hover:glow-rose",
    spot: "rgba(244, 63, 94, 0.18)",
    sweep: "rgba(244, 63, 94, 0.14)",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/5",
    hoverGlow: "hover:glow-rose",
    spot: "rgba(245, 158, 11, 0.16)",
    sweep: "rgba(245, 158, 11, 0.14)",
  },
} as const;

function useCountUp(target: number, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime.current) startTime.current = timestamp;
        const elapsed = timestamp - startTime.current;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(eased * target * 10) / 10);

        if (progress < 1) {
          animationFrame.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      animationFrame.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame.current);
      startTime.current = null;
    };
  }, [target, duration, delay]);

  return count;
}

export function StatsCard({ title, value, icon: Icon, color, suffix = "", trend, delay = 0 }: StatsCardProps) {
  const animatedValue = useCountUp(value, 1500, delay);
  const colors = colorMap[color];

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [spot, setSpot] = useState({ x: 50, y: 40, active: false });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y, active: true });
  };

  const onLeave = () => setSpot((s) => ({ ...s, active: false }));

  const valueText = useMemo(() => {
    if (suffix === "%") return animatedValue.toFixed(1);
    return String(Math.floor(animatedValue));
  }, [animatedValue, suffix]);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 glass",
        "transition-[transform,box-shadow,border-color] duration-300",
        "hover:-translate-y-0.5 hover:shadow-xl",
        "active:translate-y-0 active:scale-[0.995]",
        colors.border,
        colors.glow,
        colors.hoverGlow
      )}
      style={{ animationDelay: `${delay}ms`, opacity: 0, animation: `fade-in 0.5s ease-out ${delay}ms forwards` }}
    >
      {/* Cursor-follow spotlight */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-[-2px] opacity-0 transition-opacity duration-300",
          spot.active && "opacity-100"
        )}
        style={{
          background: `radial-gradient(420px 260px at ${spot.x}% ${spot.y}%, ${colors.spot} 0%, transparent 62%)`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-24 -top-16 h-32 rotate-12 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${colors.sweep} 25%, rgba(255,255,255,0.08) 50%, ${colors.sweep} 75%, transparent 100%)`,
          animation: "shimmer 1.25s ease-in-out infinite",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            <span className="font-mono">{valueText}</span>
            <span className="text-lg ml-0.5 text-muted-foreground/80">{suffix}</span>
          </p>
          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  "transition-colors",
                  trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs yesterday</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative p-2.5 rounded-2xl",
            "transition-transform duration-300",
            "group-hover:scale-110 group-hover:-rotate-3",
            colors.bg
          )}
        >
          <Icon className={cn("w-5 h-5", colors.text)} />
        </div>
      </div>

      {/* Edge gradient hint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${colors.sweep} 0%, transparent 55%, transparent 100%)`,
        }}
      />
    </div>
  );
}

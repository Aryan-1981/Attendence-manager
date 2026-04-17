"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/5",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/5",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/5",
  },
};

function useCountUp(target: number, duration: number = 1500, delay: number = 0) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
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
    };
  }, [target, duration, delay]);

  return count;
}

export function StatsCard({ title, value, icon: Icon, color, suffix = "", trend, delay = 0 }: StatsCardProps) {
  const animatedValue = useCountUp(value, 1500, delay);
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg glass",
        colors.border,
        colors.glow
      )}
      style={{ animationDelay: `${delay}ms`, opacity: 0, animation: `fade-in 0.5s ease-out ${delay}ms forwards` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight font-mono">
            {suffix === "%" ? animatedValue.toFixed(1) : Math.floor(animatedValue)}
            <span className="text-lg ml-0.5">{suffix}</span>
          </p>
          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs yesterday</span>
            </div>
          )}
        </div>
        <div className={cn("p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.text)} />
        </div>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          `bg-gradient-to-br from-${color}-500/5 to-transparent`
        )}
      />
    </div>
  );
}

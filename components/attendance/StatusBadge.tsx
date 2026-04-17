"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "Present" | "Absent" | "Late";
}

const statusStyles = {
  Present: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
  Absent: "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20",
  Late: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
};

const statusDots = {
  Present: "bg-emerald-500",
  Absent: "bg-rose-500",
  Late: "bg-amber-500",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-[11px] px-2.5 py-0.5 gap-1.5 border transition-colors",
        statusStyles[status]
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", statusDots[status])} />
      {status}
    </Badge>
  );
}

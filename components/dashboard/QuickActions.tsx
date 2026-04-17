"use client";

import { UserPlus, Download, QrCode, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const actions = [
  {
    label: "Mark Attendance",
    icon: CalendarCheck,
    color: "bg-indigo-500 hover:bg-indigo-600",
    onClick: () => toast.success("Attendance marking started"),
  },
  {
    label: "Add Student",
    icon: UserPlus,
    color: "bg-emerald-500 hover:bg-emerald-600",
    onClick: () => toast.success("Add student form opened"),
  },
  {
    label: "Export Report",
    icon: Download,
    color: "bg-amber-500 hover:bg-amber-600",
    onClick: () => {
      toast.loading("Exporting report...", { duration: 2000 });
      setTimeout(() => toast.success("Report exported successfully"), 2000);
    },
  },
  {
    label: "Scan QR",
    icon: QrCode,
    color: "bg-violet-500 hover:bg-violet-600",
    onClick: () => toast("QR Scanner — Coming Soon"),
  },
];

export function QuickActions() {
  return (
    <div
      className="rounded-xl border border-border/50 p-5 glass"
      style={{ opacity: 0, animation: "fade-in 0.5s ease-out 400ms forwards" }}
    >
      <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            className={`${action.color} text-white h-auto py-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

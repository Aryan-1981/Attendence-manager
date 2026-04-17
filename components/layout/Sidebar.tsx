"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  User,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/attendance", icon: ClipboardList },
  { label: "Analytics", href: "/analytics", icon: BarChart3, comingSoon: true },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings, comingSoon: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 border-r border-border/50 transition-all duration-300 ease-in-out glass",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10">
          <GraduationCap className="w-5 h-5 text-indigo-500" />
        </div>
        <span
          className={cn(
            "font-semibold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-indigo-400 bg-clip-text text-transparent transition-all duration-300",
            collapsed && "opacity-0 w-0 overflow-hidden"
          )}
        >
          AttendTrack
        </span>
      </div>

      <Separator className="opacity-50" />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          const handleClick = (e: React.MouseEvent) => {
            if (item.comingSoon) {
              e.preventDefault();
              toast(`${item.label} — Coming Soon`, {
                description: "This feature is under development.",
              });
            }
          };

          return (
            <Link
              key={item.href}
              href={item.comingSoon ? "#" : item.href}
              onClick={handleClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-full" />
              )}
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-indigo-500 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span
                className={cn(
                  "transition-all duration-300 whitespace-nowrap",
                  collapsed && "opacity-0 w-0 overflow-hidden"
                )}
              >
                {item.label}
              </span>
              {item.comingSoon && !collapsed && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="opacity-50" />

      {/* User Info */}
      <div className={cn("px-3 py-3 shrink-0", collapsed && "px-2")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AK
          </div>
          <div
            className={cn(
              "flex-1 min-w-0 transition-all duration-300",
              collapsed && "opacity-0 w-0 overflow-hidden"
            )}
          >
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground",
              collapsed && "hidden"
            )}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="px-2 py-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center h-8 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

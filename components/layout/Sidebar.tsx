"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { toasts } from "@/lib/toasts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const activeHref = useMemo(() => {
    const match = navItems
      .map((n) => n.href)
      .sort((a, b) => b.length - a.length)
      .find((href) => pathname === href || pathname?.startsWith(href + "/"));
    return match ?? "/dashboard";
  }, [pathname]);

  if (!mounted) return null;

  return (
    <TooltipProvider delay={120}>
      <aside
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 glass",
          "border-r border-border/50",
          "transition-[width] duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]",
          "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-indigo-500/35 after:via-indigo-500/10 after:to-transparent",
          collapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/15 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20" />
            <GraduationCap className="relative w-5 h-5 text-indigo-500" />
          </div>
          <span
            className={cn(
              "font-semibold text-lg tracking-tight text-gradient",
              "transition-all duration-300",
              collapsed && "opacity-0 w-0 overflow-hidden"
            )}
            style={{ animationDuration: "8s" }}
          >
            AttendTrack
          </span>
        </div>

        <Separator className="opacity-40" />

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;

            const handleClick = (e: React.MouseEvent) => {
              if (item.comingSoon) {
                e.preventDefault();
                toasts.comingSoon(item.label);
              }
            };

            const link = (
              <Link
                key={item.href}
                href={item.comingSoon ? "#" : item.href}
                onClick={handleClick}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-200",
                  "cursor-pointer select-none",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 shadow-[0_0_0_1px_rgba(99,102,241,0.18)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-indigo-500/10 blur-xl opacity-60 -z-10" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-full shadow-[0_0_24px_rgba(99,102,241,0.55)]" />
                  </>
                )}

                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive
                      ? "text-indigo-500 dark:text-indigo-300"
                      : "text-muted-foreground group-hover:text-foreground"
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
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium ring-1 ring-amber-500/20">
                    Soon
                  </span>
                )}
              </Link>
            );

            if (!collapsed) return link;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger>{link}</TooltipTrigger>
                <TooltipContent side="right" className="glass border-border/50">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Frosted divider between sections */}
          <div className="px-2 py-3">
            <div className="h-px bg-gradient-to-r from-transparent via-border/70 to-transparent opacity-70" />
          </div>
        </nav>

        <Separator className="opacity-40" />

        {/* User */}
        <div className={cn("px-3 py-3 shrink-0", collapsed && "px-2")}>
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              AK
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
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
              aria-label="Log out"
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
            onClick={() => setCollapsed((v) => !v)}
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
    </TooltipProvider>
  );
}

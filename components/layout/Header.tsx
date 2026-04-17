"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Command } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const routeTitles: Record<string, { title: string; breadcrumb: string }> = {
  "/dashboard": { title: "Dashboard", breadcrumb: "Home / Dashboard" },
  "/attendance": { title: "Attendance", breadcrumb: "Home / Attendance Records" },
  "/profile": { title: "Profile", breadcrumb: "Home / User Profile" },
  "/analytics": { title: "Analytics", breadcrumb: "Home / Analytics" },
  "/settings": { title: "Settings", breadcrumb: "Home / Settings" },
};

export function Header() {
  const pathname = usePathname();
  const route = routeTitles[pathname ?? ""] || { title: "Dashboard", breadcrumb: "Home" };
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <header className="sticky top-0 z-30 h-16 border-b border-border/50" />;
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/50 glass">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Title & Breadcrumb */}
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight">{route.title}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">{route.breadcrumb}</p>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students, records..."
              className="pl-9 pr-20 h-9 bg-secondary/50 border-border/50 focus-visible:ring-indigo-500/30 text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium flex">
                <Command className="w-3 h-3" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden rounded-lg">
            <Search className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                AK
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Admin User</span>
                  <span className="text-xs text-muted-foreground">admin@attendtrack.com</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-500">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

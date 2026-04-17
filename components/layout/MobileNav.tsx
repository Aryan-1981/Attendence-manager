"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/attendance", icon: ClipboardList },
  { label: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 glass">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200",
                isActive ? "text-indigo-500" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

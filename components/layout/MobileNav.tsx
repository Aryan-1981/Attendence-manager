"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutDashboard, ClipboardList, User, Sparkles, ChartNoAxesCombined } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/attendance", icon: ClipboardList },
  { label: "Analytics", href: "/analytics", icon: ChartNoAxesCombined, badge: "Soon" },
  { label: "Profile", href: "/profile", icon: User },
];

type NavItem = (typeof navItems)[number];

export function MobileNav() {
  const pathname = usePathname();
  const [pressed, setPressed] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearPressed = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setPressed(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const onPress = (href: string) => {
    setPressed(href);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setPressed(null), 180);
  };

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "border-t border-border/50",
        "bg-background/55 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45",
        "shadow-[0_-10px_40px_rgba(0,0,0,0.08)]",
        "pb-[max(env(safe-area-inset-bottom),0px)]"
      )}
    >
      {/* top highlight rail */}
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <nav className="relative flex items-center justify-around h-16 px-1">
        {/* ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(420px 120px at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 60%)",
          }}
        />

        {navItems.map((item: NavItem) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const isPressed = pressed === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onPointerDown={() => onPress(item.href)}
              onPointerUp={clearPressed}
              onPointerCancel={clearPressed}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1",
                "w-full h-full",
                "transition-[color,transform] duration-200",
                isPressed && "scale-[0.98]",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {/* active pill */}
              <span
                aria-hidden
                className={cn(
                  "absolute -top-1 left-1/2 -translate-x-1/2",
                  "h-0.5 w-10 rounded-full",
                  "bg-gradient-to-r from-indigo-500/0 via-indigo-500/85 to-indigo-500/0",
                  "opacity-0 transition-opacity duration-300",
                  isActive && "opacity-100"
                )}
              />

              <div
                className={cn(
                  "relative grid place-items-center",
                  "h-10 w-10 rounded-2xl",
                  "transition-[background-color,box-shadow,transform] duration-300",
                  isActive
                    ? "bg-indigo-500/10 shadow-[0_0_0_1px_rgba(99,102,241,0.18),0_16px_45px_rgba(99,102,241,0.10)]"
                    : "hover:bg-accent/30"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive && "scale-[1.06]"
                  )}
                />

                {/* active dot */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1.5 left-1/2 -translate-x-1/2",
                    "h-1.5 w-1.5 rounded-full",
                    "bg-indigo-500",
                    "opacity-0 scale-75 transition-[opacity,transform] duration-300",
                    isActive && "opacity-100 scale-100"
                  )}
                />

                {/* soon badge */}
                {item.badge && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1",
                      "text-[9px] leading-none px-1.5 py-1 rounded-full",
                      "bg-amber-500/15 text-amber-500 border border-amber-500/25"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span aria-hidden className="absolute -inset-x-2 -inset-y-1 rounded-md bg-indigo-500/5 -z-10" />
                )}
              </div>

              {/* gesture hint on first item */}
              {item.href === "/dashboard" && (
                <span className="sr-only">Tap to navigate</span>
              )}
            </Link>
          );
        })}

        {/* subtle sparkle for premium feel */}
        <Sparkles
          aria-hidden
          className="absolute right-2 top-2 h-3.5 w-3.5 text-indigo-500/35"
        />
      </nav>
    </div>
  );
}

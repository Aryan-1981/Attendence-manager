"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Bell, Command, Search } from "lucide-react";
import { students } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const routeTitles: Record<string, { title: string; breadcrumb: string }> = {
  "/dashboard": { title: "Dashboard", breadcrumb: "Home / Dashboard" },
  "/attendance": { title: "Attendance", breadcrumb: "Home / Attendance Records" },
  "/profile": { title: "Profile", breadcrumb: "Home / User Profile" },
  "/analytics": { title: "Analytics", breadcrumb: "Home / Analytics" },
  "/settings": { title: "Settings", breadcrumb: "Home / Settings" },
};

type CommandItem = {
  id: string;
  label: string;
  group: "Pages" | "Actions" | "Students";
  keywords?: string;
  onSelect: () => void;
};

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const route = routeTitles[pathname ?? ""] || { title: "Dashboard", breadcrumb: "Home" };
  const mounted = useMounted();

  // Command palette
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pageItems: CommandItem[] = useMemo(
    () => [
      {
        id: "page-dashboard",
        label: "Dashboard",
        group: "Pages",
        keywords: "home overview stats",
        onSelect: () => router.push("/dashboard"),
      },
      {
        id: "page-attendance",
        label: "Attendance",
        group: "Pages",
        keywords: "records table export",
        onSelect: () => router.push("/attendance"),
      },
      {
        id: "page-profile",
        label: "Profile",
        group: "Pages",
        keywords: "user settings",
        onSelect: () => router.push("/profile"),
      },
    ],
    [router]
  );

  const actionItems: CommandItem[] = useMemo(
    () => [
      {
        id: "action-mark",
        label: "Mark Attendance",
        group: "Actions",
        keywords: "check in check out",
        onSelect: () => {
          toast("Mark Attendance", {
            description: "Demo action — connect to device or backend to mark attendance.",
          });
        },
      },
      {
        id: "action-export",
        label: "Export",
        group: "Actions",
        keywords: "download csv",
        onSelect: () => {
          toast("Exporting…", { description: "Preparing your export (demo)." });
        },
      },
      {
        id: "action-theme",
        label: "Toggle Theme",
        group: "Actions",
        keywords: "dark light",
        onSelect: () => {
          // the ThemeToggle is in header; we just show a toast here
          toast("Theme", { description: "Use the toggle in the top-right." });
        },
      },
    ],
    []
  );

  const studentItems: CommandItem[] = useMemo(() => {
    // keep it fast — command palette will filter based on query
    return students.slice(0, 50).map((s) => ({
      id: `student-${s.id}`,
      label: `${s.name} (${s.id})`,
      group: "Students",
      keywords: `${s.name} ${s.id} ${s.department}`,
      onSelect: () => {
        toast("Student", { description: `${s.name} — details view coming soon.` });
      },
    }));
  }, []);

  const allItems = useMemo(() => [...pageItems, ...actionItems, ...studentItems], [pageItems, actionItems, studentItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((i) => {
      const hay = `${i.label} ${i.keywords ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [allItems, query]);

  const groups = useMemo(() => {
    const g: Record<string, CommandItem[]> = { Pages: [], Actions: [], Students: [] };
    for (const item of filtered) g[item.group].push(item);
    return g as { Pages: CommandItem[]; Actions: CommandItem[]; Students: CommandItem[] };
  }, [filtered]);

  const flatForNav = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen(true);
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((v) => Math.min(v + 1, Math.max(0, flatForNav.length - 1)));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((v) => Math.max(v - 1, 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const item = flatForNav[activeIndex];
        if (!item) return;
        item.onSelect();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, flatForNav, open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  const notifications = useMemo(
    () => [
      { id: "n1", title: "3 students marked late", time: "2m ago" },
      { id: "n2", title: "Weekly report is ready", time: "1h ago" },
      { id: "n3", title: "New student registered", time: "Today" },
      { id: "n4", title: "Attendance rate improved", time: "Yesterday" },
      { id: "n5", title: `System check • ${format(new Date(), "PPP")}`, time: "Now" },
    ],
    []
  );

  if (!mounted) {
    return <header className="sticky top-0 z-30 h-16 border-b border-border/50" />;
  }

  return (
    <>
      <header className={cn("sticky top-0 z-30 h-16 glass", "border-b border-border/50", "relative")}> 
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Left: Title & Breadcrumb */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">{route.title}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{route.breadcrumb}</p>
          </div>

          {/* Center: Command search */}
          <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                "relative w-full h-9 rounded-xl",
                "bg-secondary/40 hover:bg-secondary/55",
                "border border-border/50",
                "transition-all",
                "text-left",
                "px-3",
                "flex items-center gap-2"
              )}
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search…</span>
              <span className="ml-auto text-muted-foreground flex items-center gap-1">
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium flex">
                  <Command className="w-3 h-3" />K
                </kbd>
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Mobile search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              className="h-9 w-9 md:hidden rounded-xl"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 glass border-border/50">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex items-start gap-3 py-3 cursor-pointer">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500/80" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.time}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            {/* User */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                  aria-label="User menu"
                >
                  AK
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-border/50">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Admin User</span>
                    <span className="text-xs text-muted-foreground">admin@attendtrack.com</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast("Settings", { description: "Coming soon." })}
                  className="cursor-pointer"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-rose-500 cursor-pointer">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "glass border-border/50 p-0 gap-0 overflow-hidden",
            "max-w-[720px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          <div className="border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Type a command or search…"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-9"
              />
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No results.</div>
            ) : (
              <div className="space-y-2">
                {(
                  [
                    ["Pages", groups.Pages],
                    ["Actions", groups.Actions],
                    ["Students", groups.Students],
                  ] as const
                ).map(([label, items]) => {
                  if (!items.length) return null;
                  return (
                    <div key={label} className="px-1">
                      <div className="px-2 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </div>
                      <div className="space-y-1">
                        {items.map((item) => {
                          const idx = flatForNav.findIndex((i) => i.id === item.id);
                          const active = idx === activeIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onMouseEnter={() => setActiveIndex(idx)}
                              onClick={() => {
                                item.onSelect();
                                setOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-xl flex items-center justify-between",
                                "transition-colors",
                                active
                                  ? "bg-indigo-500/12 text-foreground shadow-[0_0_0_1px_rgba(99,102,241,0.25)]"
                                  : "hover:bg-accent/40"
                              )}
                            >
                              <span className="text-sm">{item.label}</span>
                              <span className="text-xs text-muted-foreground">↵</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

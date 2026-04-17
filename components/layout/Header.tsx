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
import { toasts } from "@/lib/toasts";
import { fuzzyScore, fuzzyFilterSort, highlightByIndices } from "@/lib/fuzzy";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

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

  const [recentIds, setRecentIds] = useLocalStorageState<string[]>("attendtrack.cmdk.recent", []);

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
          toasts.comingSoon("Mark Attendance");
        },
      },
      {
        id: "action-export",
        label: "Export",
        group: "Actions",
        keywords: "download csv",
        onSelect: () => {
          const id = toasts.exportStarted("Export");
          window.setTimeout(() => toasts.exportSuccess(id, "Export"), 900);
        },
      },
      {
        id: "action-theme",
        label: "Toggle Theme",
        group: "Actions",
        keywords: "dark light",
        onSelect: () => {
          // the ThemeToggle is in header; we just show a toast here
          toasts.comingSoon("Theme toggle");
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
        toasts.comingSoon(`Student: ${s.name}`);
      },
    }));
  }, []);
  const allItems = useMemo(() => {
    const uniq = new Map<string, CommandItem>();
    for (const item of [...pageItems, ...actionItems, ...studentItems]) uniq.set(item.id, item);
    return Array.from(uniq.values());
  }, [pageItems, actionItems, studentItems]);

  const recentItems = useMemo(() => {
    const byId = new Map(allItems.map((i) => [i.id, i] as const));
    return recentIds.map((id) => byId.get(id)).filter(Boolean) as CommandItem[];
  }, [allItems, recentIds]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return allItems;
    return fuzzyFilterSort(allItems, q, (i) => `${i.label} ${i.keywords ?? ""}`);
  }, [allItems, query]);

  const flatForNav = useMemo(() => {
    if (!query.trim() && recentItems.length) {
      const rest = allItems.filter((i) => !recentItems.some((r) => r.id === i.id));
      return [...recentItems, ...rest];
    }
    return filtered;
  }, [allItems, filtered, query, recentItems]);

  const groups = useMemo(() => {
    const q = query.trim();
    const g: Record<string, CommandItem[]> = { Recent: [], Pages: [], Actions: [], Students: [] };

    if (!q) {
      g.Recent = recentItems;
      for (const item of allItems) {
        if (recentItems.some((r) => r.id === item.id)) continue;
        g[item.group].push(item);
      }
      return g as { Recent: CommandItem[]; Pages: CommandItem[]; Actions: CommandItem[]; Students: CommandItem[] };
    }

    for (const item of filtered) g[item.group].push(item);
    return g as { Recent: CommandItem[]; Pages: CommandItem[]; Actions: CommandItem[]; Students: CommandItem[] };
  }, [allItems, filtered, query, recentItems]);

  const activeItem = flatForNav[activeIndex];
  const activeId = activeItem ? `cmdk-item-${activeItem.id}` : undefined;

  const selectItem = (item?: CommandItem) => {
    if (!item) return;
    setRecentIds((prev) => {
      const next = [item.id, ...prev.filter((x) => x !== item.id)].slice(0, 8);
      return next;
    });
    item.onSelect();
    setOpen(false);
  };

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
        setActiveIndex((v) => {
        const max = Math.max(0, flatForNav.length - 1);
        if (max == 0) return 0;
        return v >= max ? 0 : v + 1;
      });
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((v) => {
        const max = Math.max(0, flatForNav.length - 1);
        if (max == 0) return 0;
        return v <= 0 ? max : v - 1;
      });
      }
      if (e.key === "Enter") {
        e.preventDefault();
        selectItem(flatForNav[activeIndex]);
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
      <header className={cn("sticky top-0 z-30 h-14 md:h-16 glass", "border-b border-border/50", "relative")}> 
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Left: Title & Breadcrumb */}
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-semibold tracking-tight">{route.title}</h1>
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
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                "md:hidden h-9 rounded-xl px-3",
                "inline-flex items-center gap-2",
                "border border-border/50 bg-secondary/35 hover:bg-secondary/50",
                "text-sm text-muted-foreground",
                "transition-all press"
              )}
              aria-label="Open command palette"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
              <span className="ml-1 hidden sm:inline text-[10px] text-muted-foreground/80">⌘K</span>
            </button>

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
                  onClick={() => toasts.comingSoon("Settings")}
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
                role="combobox"
                aria-expanded={open}
                aria-controls="cmdk-list"
                aria-activedescendant={activeId}
              />
            </div>
          </div>

          <div id="cmdk-list" role="listbox" className="max-h-[380px] overflow-y-auto p-2 cmdk-scrollfade">
            {filtered.length === 0 ? (
              <div className="p-7">
                <div className="text-sm font-medium">No results</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Try <span className="font-mono">export</span>, <span className="font-mono">attendance</span>, or a student name.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {(
                  [
                    ["Recent", (groups as any).Recent],
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
                        {items.map((item: CommandItem) => {
                          const idx = flatForNav.findIndex((i) => i.id === item.id);
                          const active = idx === activeIndex;
                          return (
                            <button
                              id={`cmdk-item-${item.id}`}
                              role="option"
                              aria-selected={active}
                              key={item.id}
                              type="button"
                              onMouseEnter={() => setActiveIndex(idx)}
                              onClick={() => selectItem(item)}
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

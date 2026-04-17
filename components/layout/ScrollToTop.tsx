"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector("main");
    const target: Element | Window = el ?? window;

    const getScrollTop = () => {
      if (target === window) return window.scrollY;
      return (target as HTMLElement).scrollTop;
    };

    const onScroll = () => {
      setVisible(getScrollTop() > 260);
    };

    onScroll();

    if (target === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    (target as HTMLElement).addEventListener("scroll", onScroll, { passive: true } as any);
    return () => (target as HTMLElement).removeEventListener("scroll", onScroll as any);
  }, []);

  const scrollToTop = () => {
    const el = document.querySelector("main");
    if (el) {
      (el as HTMLElement).scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40",
        "rounded-full border border-border/60 bg-card/60 backdrop-blur-xl glass",
        "shadow-[0_18px_55px_-28px_rgba(99,102,241,0.55)]",
        "h-11 w-11 grid place-items-center",
        "motion-default",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none",
        "hover:-translate-y-[1px] hover:shadow-[0_22px_65px_-30px_rgba(99,102,241,0.65)]",
        "active:translate-y-0",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(99,102,241,0.22),transparent_70%)]" />
      <ArrowUp className="relative h-4 w-4 text-foreground/80" />
    </button>
  );
}

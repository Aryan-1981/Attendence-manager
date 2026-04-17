"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Options = {
  durationMs?: number;
  delayMs?: number;
  decimals?: number;
};

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useCountUp(target: number, options: Options = {}) {
  const { durationMs = 1400, delayMs = 0, decimals = 0 } = options;
  const prefersReduced = usePrefersReducedMotion();

  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const timeout = window.setTimeout(() => {
      const tick = (ts: number) => {
        if (startTime.current === null) startTime.current = ts;
        const elapsed = ts - startTime.current;
        const p = Math.min(elapsed / durationMs, 1);
        const eased = easeOutExpo(p);

        const nextRaw = eased * target;
        const factor = Math.pow(10, Math.max(0, decimals));
        const next = Math.round(nextRaw * factor) / factor;
        setValue(next);

        if (p < 1) {
          raf.current = requestAnimationFrame(tick);
        } else {
          setValue(target);
        }
      };

      raf.current = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      startTime.current = null;
    };
  }, [target, durationMs, delayMs, decimals, prefersReduced]);

  return value;
}

"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  "aria-label"?: string;
};

export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const isControlled = typeof checked === "boolean";
  const [internal, setInternal] = React.useState<boolean>(defaultChecked ?? false);
  const value = isControlled ? (checked as boolean) : internal;

  const setValue = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={value}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        setValue(!value);
      }}
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-md border",
        "border-border/60 bg-background/40",
        "shadow-sm",
        "transition-[box-shadow,background-color,border-color,transform] duration-200",
        "hover:bg-background/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        value && "bg-indigo-500/15 border-indigo-500/35",
        className
      )}
      {...props}
    >
      <Check
        className={cn(
          "h-3.5 w-3.5 text-indigo-500 transition-opacity",
          value ? "opacity-100" : "opacity-0"
        )}
      />
    </button>
  );
}

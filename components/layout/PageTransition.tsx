"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    // Re-keying forces the page-enter animation to replay on navigation.
    setKey(pathname);
  }, [pathname]);

  return (
    <div key={key} className={cn("page-enter", className)}>
      {children}
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Content is visible in server HTML. CSS scroll motion enhances it without delaying paint. */
export function Reveal({ children, delay = 0, className, y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return <div className={cn("scroll-reveal", className)} style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s` } as CSSProperties}>{children}</div>;
}
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function Item({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("scroll-reveal", className)}>{children}</div>;
}

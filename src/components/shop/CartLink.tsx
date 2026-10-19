"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "./cart";

/**
 * Basket link for the header. The count renders as 0 on the server and fills in after
 * hydration — the badge is hidden until then, so nothing shifts on first paint.
 */
export function CartLink({ className, showLabel }: { className?: string; showLabel?: boolean }) {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      aria-label={count ? `Basket, ${count} item${count === 1 ? "" : "s"}` : "Basket"}
      className={cn("relative flex items-center gap-2 rounded-full px-3.5 py-2 text-ui ring-1 ring-current/20 transition hover:bg-current/10", className)}
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.6} aria-hidden />
      {showLabel && "Basket"}
      {count > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brass-500 px-1 text-xs font-medium text-ink-950 tnum">{count}</span>
      )}
    </Link>
  );
}

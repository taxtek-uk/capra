"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Public nav and footer, withheld from the /admin dashboard, which brings its own shell. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return usePathname().startsWith("/admin") ? null : <>{children}</>;
}

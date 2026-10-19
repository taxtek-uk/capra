"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureSource } from "@/lib/source";

/**
 * Records `?ref=` / UTM / landing path on every page, not just the planner — a visitor who
 * arrives on a consultant link and browses for a week before enquiring still carries the code.
 * Renders nothing.
 */
export function SourceCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureSource();
  }, [pathname]);
  return null;
}

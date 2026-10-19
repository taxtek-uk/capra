"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { readSource } from "@/lib/source";

/**
 * First-party visit tracking. Records one row per page view, the engaged time on it
 * (tab visible only), scroll depth, and named events. Everything goes out on a beacon,
 * so nothing here can block or fail a page. Renders nothing.
 *
 * Fire your own event from any client component: `track("sample_requested", panelName)`.
 * Page speed from real visits goes out the same way, as `web_vital` events (see VITALS).
 */
type Item = Record<string, unknown> & { t: "view" | "ping" | "event" };

const queue: Item[] = [];
let sid = "";
let vid = "";
let view = { id: "", ms: 0, scroll: 0, since: 0 };
/** Guards against a remount counting the same page twice (React strict mode, a fast back-forward). */
let last = { path: "", at: 0 };

const rid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;

function ids() {
  if (sid) return;
  try {
    sid = sessionStorage.getItem("capra:sid") || rid();
    sessionStorage.setItem("capra:sid", sid);
    vid = localStorage.getItem("capra:vid") || rid();
    localStorage.setItem("capra:vid", vid);
  } catch {
    // Private mode: an in-memory id still gives us the visit, just not the return visit.
    sid ||= rid();
    vid ||= sid;
  }
}

function flush(beacon = false) {
  if (!queue.length) return;
  const body = JSON.stringify(queue.splice(0, queue.length));
  try {
    if (beacon && navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/track", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
  } catch {
    /* tracking never throws into the page */
  }
}

/** Bank the engaged time accumulated since the tab last became visible. */
function bank() {
  if (view.since) {
    view.ms += Date.now() - view.since;
    view.since = document.visibilityState === "visible" ? Date.now() : 0;
  }
}
function ping(beacon = false) {
  bank();
  if (view.id && view.ms > 0) queue.push({ t: "ping", id: view.id, sid, ms: view.ms, scroll: view.scroll });
  flush(beacon);
}

export function track(name: string, label?: string, meta?: Record<string, string | number | boolean>) {
  ids();
  queue.push({ t: "event", sid, vid, name, label: label ?? null, path: location.pathname, meta });
  if (queue.length >= 8) flush();
}

/** Core Web Vitals plus the two load timings that explain them. Rounded: CLS to 3dp, the rest to whole ms. */
const VITALS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

export function Tracker() {
  const pathname = usePathname();
  const off = pathname.startsWith("/admin");

  // Each metric reports once it is final, often as the tab hides, so it goes straight out on a beacon.
  useReportWebVitals((m) => {
    if (off || !VITALS.has(m.name)) return;
    track("web_vital", m.name, { value: m.name === "CLS" ? Math.round(m.value * 1000) / 1000 : Math.round(m.value), rating: m.rating });
    flush(true);
  });

  // One view per route, finalised when the route changes.
  useEffect(() => {
    if (off) return;
    ids();
    if (pathname === last.path && Date.now() - last.at < 2000) return;
    last = { path: pathname, at: Date.now() };
    const q = new URLSearchParams(location.search);
    const src = readSource();
    view = { id: rid(), ms: 0, scroll: 0, since: Date.now() };
    queue.push({
      t: "view",
      id: view.id,
      sid,
      vid,
      path: pathname,
      title: document.title.slice(0, 200),
      referrer: document.referrer || null,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      utmSource: q.get("utm_source") ?? src?.utmSource ?? null,
      utmMedium: q.get("utm_medium") ?? null,
      utmCampaign: q.get("utm_campaign") ?? src?.utmCampaign ?? null,
      ref: q.get("ref") ?? src?.ref ?? null,
    });
    flush();
    return () => ping();
  }, [pathname, off]);

  // Listeners and heartbeat, mounted once.
  useEffect(() => {
    if (off) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") view.since = Date.now();
      else ping(true);
    };
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.round(((window.scrollY + 0) / h) * 100) : 100;
      view.scroll = Math.min(100, Math.max(view.scroll, pct));
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a,[data-event]") as HTMLElement | null;
      if (!el) return;
      const named = el.dataset.event;
      if (named) return track(named, el.dataset.eventLabel ?? el.textContent?.trim().slice(0, 120));
      const href = (el as HTMLAnchorElement).href ?? "";
      if (href.startsWith("tel:")) return track("call_click", href.slice(4));
      if (href.startsWith("mailto:")) return track("email_click", href.slice(7));
      if (href.startsWith("http") && new URL(href).host !== location.host) return track("outbound_click", new URL(href).host);
    };
    const onSubmit = (e: SubmitEvent) => track("form_submit", (e.target as HTMLFormElement)?.getAttribute("data-form") ?? location.pathname);
    const beat = setInterval(() => ping(), 15_000);

    document.addEventListener("visibilitychange", onVisible);
    const onHide = () => ping(true);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      clearInterval(beat);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [off]);

  return null;
}

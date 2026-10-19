"use client";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { SearchEntry } from "@/lib/search";
import { cn } from "@/lib/utils";

/**
 * Site search: one button in the header, "/" or Ctrl/⌘ K from anywhere. The index (/search-index.json,
 * ~30 KB) loads the first time the dialog opens, so it costs nothing on page load. A native <dialog> brings
 * the focus trap, Escape and an inert page; results are plain links, reached from the field with ↓.
 */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const MAX = 12;

function rank(index: SearchEntry[], query: string) {
  const q = norm(query.trim());
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { e: SearchEntry; s: number }[] = [];
  for (const e of index) {
    const title = norm(e.t), rest = norm(`${e.k} ${e.d ?? ""}`);
    if (!words.every((w) => title.includes(w) || rest.includes(w))) continue;
    let s = title.startsWith(q) ? 10 : title.includes(q) ? 6 : 0;
    for (const w of words) s += title.includes(w) ? 3 : 1;
    scored.push({ e, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.e.t.length - b.e.t.length).slice(0, MAX).map((x) => x.e);
}

export function SiteSearch({ className }: { className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const results = useMemo(() => (index ? rank(index, q) : []), [index, q]);

  const open = () => {
    dialog.current?.showModal();
    input.current?.select();
    if (!index) fetch("/search-index.json").then((r) => r.json()).then(setIndex, () => setFailed(true));
  };

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /** ↓ from the field enters the results; ↑/↓ move through them; ↑ from the first goes back to the field. */
  const move = (e: KeyboardEvent) => {
    const links = [...(list.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown" && links.length) { e.preventDefault(); links[Math.min(at + 1, links.length - 1)].focus(); }
    if (e.key === "ArrowUp" && at >= 0) { e.preventDefault(); (at === 0 ? input.current : links[at - 1])?.focus(); }
    if (e.key === "Enter" && e.target === input.current && links[0]) { e.preventDefault(); links[0].click(); }
  };

  const status = !q.trim() ? "Search flasks, jugs, bottles and guides." : !index ? (failed ? "Search is unavailable just now." : "Loading…") : results.length ? `${results.length === MAX ? "Top " : ""}${results.length} result${results.length > 1 ? "s" : ""}` : "Nothing found. Try a model (SLD, RIT), a size or 'bottle'.";

  return (
    <>
      <button type="button" onClick={open} aria-label="Search the site" title="Search (press /)" className={cn("h-10 w-10 place-items-center rounded-full ring-1 ring-current/20 transition hover:bg-current/10", className)}>
        <Search className="h-4 w-4" strokeWidth={1.6} aria-hidden />
      </button>
      <dialog
        ref={dialog}
        aria-label="Search the site"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="mx-auto mt-[10vh] w-[min(40rem,92vw)] overflow-hidden rounded-3xl bg-bone-50 p-0 text-ink-950 shadow-deep backdrop:bg-ink-950/60 backdrop:backdrop-blur-sm"
      >
        <div onKeyDown={move}>
          <div className="flex items-center gap-3 border-b border-ink-950/10 px-5">
            <Search className="h-5 w-5 shrink-0 text-stone-600" aria-hidden />
            <label htmlFor="site-search" className="sr-only">Search</label>
            <input ref={input} id="site-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search flasks, jugs, guides…" autoComplete="off" aria-describedby="site-search-status" className="h-16 min-w-0 flex-1 rounded-lg bg-transparent text-base placeholder:text-stone-600 focus-visible:-outline-offset-2 [&::-webkit-search-cancel-button]:hidden" />
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close search" className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-ink-950/5"><X className="h-4 w-4" aria-hidden /></button>
          </div>
          <p id="site-search-status" aria-live="polite" className="px-5 pt-3 text-xs text-stone-600">{status}</p>
          <ul ref={list} className="max-h-[60vh] overflow-y-auto p-2">
            {results.map((r) => (
              <li key={r.u}>
                <Link href={r.u} onClick={() => dialog.current?.close()} className="block rounded-xl px-3 py-2.5 transition hover:bg-bone-100 focus-visible:bg-bone-100">
                  <span className="flex items-baseline justify-between gap-3"><span className="font-medium">{r.t}</span><span className="shrink-0 text-xs text-stone-600">{r.k}</span></span>
                  {r.d && <span className="mt-0.5 block truncate text-sm text-stone-600">{r.d}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}

"use client";
import { useState, type ReactNode } from "react";
import { useSearchString } from "@/lib/use-search-string";
import { cn } from "@/lib/utils";

/**
 * Filter, sort and page the shop. The cards are rendered on the server and handed in as nodes, so every
 * product keeps its server HTML and its own Add-to-basket island; this only decides which show, in what order.
 * State lives in the URL (?cat=, ?sort=, ?page=) so a filtered view can be shared or bookmarked. The default
 * view (no query) is the grouped catalogue, fully rendered for crawlers.
 */
export type BrowseItem = { id: string; group: string; price: number; card: ReactNode };
type Sort = "featured" | "price-asc" | "price-desc";
type View = { cat: string | null; sort: Sort; page: number };

const PER_GROUP = 6; // grouped view: first cards of each category, then "Show all"
const PER_PAGE = 12; // filtered or sorted view
const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];
export const groupSlug = (g: string) => g.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function fromQuery(q: string, groups: string[]): View {
  const p = new URLSearchParams(q);
  const cat = p.get("cat");
  const sort = SORTS.some((s) => s.value === p.get("sort")) ? (p.get("sort") as Sort) : "featured";
  return { cat: groups.some((g) => groupSlug(g) === cat) ? cat : null, sort, page: Math.max(1, Math.min(20, Number(p.get("page")) || 1)) };
}

export function ShopBrowser({ items }: { items: BrowseItem[] }) {
  const groups = [...new Set(items.map((i) => i.group))];
  const fromUrl = fromQuery(useSearchString(), groups);
  const [chosen, setChosen] = useState<View | null>(null);
  const [opened, setOpened] = useState<string[]>([]);
  const view = chosen ?? fromUrl;

  const set = (next: Partial<View>) => {
    const v = { ...view, page: 1, ...next };
    setChosen(v);
    const q = new URLSearchParams();
    if (v.cat) q.set("cat", v.cat);
    if (v.sort !== "featured") q.set("sort", v.sort);
    if (v.page > 1) q.set("page", String(v.page));
    try { history.replaceState(history.state, "", q.size ? `?${q}` : location.pathname); } catch { /* the view still changes */ }
  };

  const grouped = !view.cat && view.sort === "featured";
  const pool = items.filter((i) => !view.cat || groupSlug(i.group) === view.cat);
  const sorted = view.sort === "featured" ? pool : [...pool].sort((a, b) => (view.sort === "price-asc" ? a.price - b.price : b.price - a.price));
  const shown = sorted.slice(0, view.page * PER_PAGE);
  const chip = (on: boolean) => cn("inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm transition", on ? "border-ink-950 bg-ink-950 text-bone-50" : "border-ink-950/15 bg-bone-50 hover:border-ink-950/40");

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* One swipeable row on a phone, so the first products still land on the first screen; wraps from sm up. */}
        <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          <button type="button" aria-pressed={!view.cat} onClick={() => set({ cat: null })} className={chip(!view.cat)}>All <span className="text-xs opacity-75 tnum">{items.length}</span></button>
          {groups.map((g) => {
            const on = view.cat === groupSlug(g);
            return <button key={g} type="button" aria-pressed={on} onClick={() => set({ cat: on ? null : groupSlug(g) })} className={chip(on)}>{g} <span className="text-xs opacity-75 tnum">{items.filter((i) => i.group === g).length}</span></button>;
          })}
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-stone-600">Sort</span>
          <select value={view.sort} onChange={(e) => set({ sort: e.target.value as Sort })} className="min-h-10 rounded-full border border-ink-950/50 bg-bone-50 px-4 text-sm">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">{grouped ? `${items.length} products in ${groups.length} categories` : `Showing ${shown.length} of ${sorted.length} products`}</p>

      {grouped ? (
        groups.map((g) => {
          const list = items.filter((i) => i.group === g);
          const all = opened.includes(g);
          return (
            <section key={g} id={groupSlug(g)} aria-labelledby={`${groupSlug(g)}-h`} className="mt-10 scroll-mt-28 first-of-type:mt-8">
              <h2 id={`${groupSlug(g)}-h`} className="font-display text-2xl">{g}</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(all ? list : list.slice(0, PER_GROUP)).map((i) => <li key={i.id}>{i.card}</li>)}</ul>
              {list.length > PER_GROUP && !all && (
                <button type="button" onClick={() => setOpened((o) => [...o, g])} className="mt-5 inline-flex min-h-10 items-center rounded-full border border-ink-950/15 px-5 text-sm font-medium transition hover:border-ink-950/40">
                  Show all {list.length} {g.toLowerCase()}
                </button>
              )}
            </section>
          );
        })
      ) : (
        <>
          {/* Keeps the heading outline whole: the cards' h3s sit under an h2 in this view too. */}
          <h2 className="sr-only">{view.cat ? groups.find((g) => groupSlug(g) === view.cat) : "All products"}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{shown.map((i) => <li key={i.id}>{i.card}</li>)}</ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="text-sm text-stone-600">Showing {shown.length} of {sorted.length}</p>
            {shown.length < sorted.length && (
              <button type="button" onClick={() => set({ page: view.page + 1 })} className="inline-flex min-h-10 items-center rounded-full border border-ink-950/15 px-5 text-sm font-medium transition hover:border-ink-950/40">
                Show {Math.min(PER_PAGE, sorted.length - shown.length)} more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

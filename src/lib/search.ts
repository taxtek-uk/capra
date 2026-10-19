import { NAV } from "@/content/nav";
import { SERIES, seriesHref } from "@/content/products";
import { publishedJournal } from "@/lib/posts";
import { COLLECTIONS, collectionPath } from "@/content/collections";
import { REGIONS, regionPath, localityPath } from "@/content/markets";

/** One searchable thing: title, where it lives, what kind it is, and a line of text to match and show. */
export type SearchEntry = { t: string; u: string; k: string; d?: string };

/** The site search index, built from the same content the pages render. First entry for a URL wins. */
export async function searchIndex(): Promise<SearchEntry[]> {
  const posts = await publishedJournal();
  const all: SearchEntry[] = [
    ...SERIES.map((s) => ({ t: `CAPRA ${s.name}`, u: seriesHref(s), k: s.sizes.map((z) => z.model).join(" "), d: `${s.summary} ${s.seo.keywords.join(" ")}` })),
    ...NAV.groups.map((g) => ({ t: g.eyebrow, u: g.href, k: "Range" })),
    ...posts.map((p) => ({ t: p.title, u: `/blog/${p.slug}`, k: "Guide", d: p.excerpt })),
    ...COLLECTIONS.map((c) => ({ t: c.label, u: collectionPath(c.slug), k: "Thermos guide", d: `${c.description} ${c.keywords.join(" ")}` })),
    ...REGIONS.map((r) => ({ t: `Thermos delivery in ${r.name}`, u: regionPath(r.slug), k: "Delivery", d: "City and town addresses, delivery charges and trade enquiries" })),
    ...REGIONS.flatMap((r) => [...new Set(r.localities.map((l) => l.district))].map((d) => ({ t: `${d} delivery destinations`, u: localityPath(r.slug, d), k: "Delivery", d: `Thermos flasks, vacuum jugs, bottles and wholesale supply in ${r.name}: ${r.localities.filter((l) => l.district === d).map((l) => l.name).join(", ")}` }))),
    ...[...NAV.links, ...NAV.help, ...NAV.legal].map((i) => ({ t: i.label, u: i.href, k: "Page" })),
    { t: "Your basket", u: "/cart", k: "Page" },
    { t: "Your account and orders", u: "/account", k: "Page", d: "Sign in with an emailed code to see your orders" },
  ];
  const seen = new Set<string>();
  // Keep locality names searchable even in districts with many census subdivisions.
  return all.filter((e) => !seen.has(e.u) && seen.add(e.u)).map((e) => (e.d ? { ...e, d: e.d.slice(0, e.k === "Delivery" ? 4000 : 160) } : e));
}

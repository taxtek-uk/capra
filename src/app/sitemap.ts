import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { SERIES, seriesHref } from "@/content/products";
import { publishedJournal } from "@/lib/posts";
import { overrides } from "@/lib/catalogue";
import { COLLECTIONS, collectionPath } from "@/content/collections";
import { REGIONS, regionPath } from "@/content/markets";

/**
 * `lastModified` only where we know it (edited products, journal posts): stamping every URL with the build
 * time tells Google the whole site changed on every deploy. Product URLs carry their photos as image entries.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, edits] = await Promise.all([publishedJournal(), overrides()]);
  const u = (path: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({ url: `${BRAND.domain}${path}`, changeFrequency, priority });
  const unlisted = new Set([...edits].filter(([, o]) => !o.sellable).map(([slug]) => slug));
  return [
    u("/", 1, "weekly"), u("/shop", 0.95, "weekly"), u("/vacuum-jugs", 0.95, "weekly"), u("/insulated-bottles", 0.9, "weekly"), u("/prices", 0.9, "weekly"),
    ...SERIES.filter((s) => !unlisted.has(s.slug)).map((s) => {
      const at = edits.get(s.slug)?.updatedAt;
      return { ...u(seriesHref(s), 0.9, "weekly"), ...(at ? { lastModified: at } : {}), images: s.images.map((i) => `${BRAND.domain}${i.src}`) };
    }),
    u("/wholesale", 0.7), u("/blog", 0.7, "weekly"),
    u("/dealers", 0.7), u("/thermos-flasks", 0.9),
    ...COLLECTIONS.map((c) => u(collectionPath(c.slug), 0.8, "weekly")),
    ...REGIONS.map((r) => u(regionPath(r.slug), 0.6)),
    ...posts.map((p) => ({ url: `${BRAND.domain}/blog/${p.slug}`, lastModified: new Date(p.updated), changeFrequency: "yearly" as const, priority: 0.6, ...(p.image ? { images: [`${BRAND.domain}${p.image}`] } : {}) })),
    u("/delivery", 0.6), u("/help", 0.6), u("/care-guide", 0.5), u("/warranty", 0.5), u("/about", 0.5), u("/contact", 0.6),
    u("/privacy-policy", 0.2, "yearly"), u("/terms-of-service", 0.2, "yearly"),
  ];
}

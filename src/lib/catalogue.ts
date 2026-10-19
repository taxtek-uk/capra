import { cache } from "react";
import { db } from "./db";

/**
 * The `products` table overlays the shipped range in src/content/products.ts, one row per series slug.
 * /admin owns copy, imagery, SEO and the shop facts (listed, stock). It never owns a price.
 * Missing table or no database: every series shows as shipped.
 */
export interface Override {
  name: string | null;
  summary: string | null;
  blurb: string | null;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string[];
  hidden: boolean;
  sellable: boolean;
  /** null = no cap (made in our own factory); 0 = out of stock. */
  stock: number | null;
  updatedAt: string;
}

export const overrides = cache(async (): Promise<Map<string, Override>> => {
  const sql = db();
  if (!sql) return new Map();
  try {
    const rows = await sql`select * from products`;
    return new Map(
      rows.map((r) => [
        String(r.slug),
        {
          name: (r.name as string) || null,
          summary: (r.summary as string) || null,
          blurb: (r.blurb as string) || null,
          image: (r.image as string) || null,
          seoTitle: (r.seo_title as string) || null,
          seoDescription: (r.seo_description as string) || null,
          keywords: (r.keywords as string[]) ?? [],
          hidden: Boolean(r.hidden),
          sellable: r.sellable !== false,
          stock: r.stock == null ? null : Number(r.stock),
          updatedAt: new Date(String(r.updated_at)).toISOString(),
        },
      ]),
    );
  } catch {
    return new Map(); // table not applied yet
  }
});

"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { csvList, safeImagePath } from "@/lib/forms";
import { FAMILIES, SERIES, seriesHref } from "@/content/products";

const Schema = z.object({
  slug: z.string().trim().min(1).max(120),
  name: z.string().trim().max(160).optional().default(""),
  summary: z.string().trim().max(400).optional().default(""),
  blurb: z.string().trim().max(2000).optional().default(""),
  image: z.string().trim().max(500).optional().default(""),
  seoTitle: z.string().trim().max(80).optional().default(""),
  seoDescription: z.string().trim().max(300).optional().default(""),
  keywords: z.string().trim().max(600).optional().default(""),
  hidden: z.string().optional(),
  sellable: z.string().optional(),
  stock: z.string().trim().max(8).optional().default(""),
});

/** "" → null (no cap); a number → a hard stock count, floored at zero. */
const stockOf = (v: string) => (v === "" ? null : Math.max(0, Math.round(Number(v) || 0)));

/** Every public page that could be showing this product. */
const touched = (slug: string) => {
  const s = SERIES.find((x) => x.slug === slug);
  return s ? ["/", "/shop", "/prices", FAMILIES[s.family].path, seriesHref(s), "/sitemap.xml", "/llms.txt"] : [];
};

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const sql = db();
  if (!sql) return;
  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || !SERIES.some((s) => s.slug === parsed.data.slug)) redirect("/admin/products");
  const d = parsed.data;
  await sql`
    insert into products (slug, name, summary, blurb, image, seo_title, seo_description, keywords, hidden, sellable, stock, updated_at)
    values (${d.slug}, ${d.name || null}, ${d.summary || null}, ${d.blurb || null}, ${safeImagePath(d.image) || null}, ${d.seoTitle || null}, ${d.seoDescription || null},
            ${csvList(d.keywords)}, ${d.hidden === "on"}, ${d.sellable === "on"}, ${stockOf(d.stock)}, now())
    on conflict (slug) do update set name = excluded.name, summary = excluded.summary, blurb = excluded.blurb, image = excluded.image,
      seo_title = excluded.seo_title, seo_description = excluded.seo_description, keywords = excluded.keywords, hidden = excluded.hidden,
      sellable = excluded.sellable, stock = excluded.stock, updated_at = now()`;
  for (const p of touched(d.slug)) revalidatePath(p);
  revalidatePath("/admin/products");
  redirect(`/admin/products/edit?slug=${d.slug}&e=saved`);
}

/** Removes the override; the product reverts to the copy that ships with the site. */
export async function resetProduct(formData: FormData) {
  await requireAdmin();
  const sql = db();
  const slug = String(formData.get("slug") ?? "");
  if (!sql || !slug) return;
  await sql`delete from products where slug = ${slug}`;
  for (const p of touched(slug)) revalidatePath(p);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

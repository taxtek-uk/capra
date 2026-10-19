"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { CATEGORIES, getJournal } from "@/lib/posts";
import { csvList, parseFaqs, safeImagePath, slugify } from "@/lib/forms";

const Schema = z.object({
  slug: z.string().trim().max(80).optional().default(""),
  title: z.string().trim().min(4).max(140),
  seoTitle: z.string().trim().max(80).optional().default(""),
  description: z.string().trim().min(10).max(300),
  category: z.enum(CATEGORIES),
  body: z.string().trim().max(60_000).optional().default(""),
  image: z.string().trim().max(500).optional().default(""),
  imageAlt: z.string().trim().max(200).optional().default(""),
  keywords: z.string().trim().max(600).optional().default(""),
  areas: z.string().trim().max(600).optional().default(""),
  faqs: z.string().trim().max(8000).optional().default(""),
  author: z.string().trim().max(80).optional().default(""),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().default(new Date().toISOString().slice(0, 10)),
  publish: z.string().optional(),
  original: z.string().trim().max(80).optional().default(""),
});

export async function savePost(formData: FormData) {
  await requireAdmin();
  const sql = db();
  if (!sql) return;
  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/admin/journal/${formData.get("original") || "new"}?e=invalid`);
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  const publish = d.publish === "on";
  const seoTitle = d.seoTitle || null;

  // Publishing is what the SEO gate checks, so publishing is what these limits guard.
  const title = seoTitle ?? d.title;
  if (publish && (title.length > 60 || d.description.length < 70 || d.description.length > 160))
    redirect(`/admin/journal/${d.original || slug}?e=seo`);

  await sql`
    insert into posts (slug, title, seo_title, description, category, body, image, image_alt, keywords, areas, faqs, author, published, published_at, updated_at)
    values (${slug}, ${d.title}, ${seoTitle}, ${d.description}, ${d.category}, ${d.body}, ${safeImagePath(d.image)}, ${d.imageAlt},
            ${csvList(d.keywords)}, ${csvList(d.areas)}, ${JSON.stringify(parseFaqs(d.faqs))}, ${d.author || null}, ${publish}, ${d.date}, now())
    on conflict (slug) do update set
      title = excluded.title, seo_title = excluded.seo_title, description = excluded.description, category = excluded.category,
      body = excluded.body, image = excluded.image, image_alt = excluded.image_alt, keywords = excluded.keywords,
      areas = excluded.areas, faqs = excluded.faqs, author = excluded.author, published = excluded.published,
      published_at = excluded.published_at, updated_at = now()`;

  // A renamed slug leaves its old row behind; drop it so the post does not exist twice.
  if (d.original && d.original !== slug && d.original !== "new") await sql`delete from posts where slug = ${d.original}`;

  for (const p of ["/blog", `/blog/${slug}`, d.original ? `/blog/${d.original}` : "/blog", "/sitemap.xml", "/llms.txt", "/"]) revalidatePath(p);
  redirect(`/admin/journal/${slug}?e=saved`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const sql = db();
  const slug = String(formData.get("slug") ?? "");
  if (!sql || !slug) return;
  await sql`delete from posts where slug = ${slug}`;
  for (const p of ["/blog", `/blog/${slug}`, "/sitemap.xml", "/llms.txt", "/"]) revalidatePath(p);
  redirect("/admin/journal");
}

/** Publish / unpublish from the list, without opening the editor. */
export async function togglePost(formData: FormData) {
  await requireAdmin();
  const sql = db();
  const slug = String(formData.get("slug") ?? "");
  if (!sql || !slug) return;
  const post = await getJournal(slug);
  if (!post) return;
  const next = !post.published;
  await sql`
    insert into posts (slug, title, seo_title, description, category, body, image, image_alt, keywords, areas, faqs, author, published, published_at, updated_at)
    values (${slug}, ${post.title}, ${post.seoTitle}, ${post.excerpt}, ${post.category}, ${post.body}, ${post.image}, ${post.imageAlt},
            ${post.keywords}, ${post.areas}, ${JSON.stringify(post.faqs)}, ${post.author}, ${next}, ${post.date}, now())
    on conflict (slug) do update set published = ${next}, updated_at = now()`;
  for (const p of ["/blog", `/blog/${slug}`, "/sitemap.xml", "/llms.txt", "/"]) revalidatePath(p);
  revalidatePath("/admin/journal");
}

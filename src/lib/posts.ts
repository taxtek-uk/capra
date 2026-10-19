import { db } from "./db";
import { POSTS, type Post } from "@/content/blog";

/**
 * The journal, from the database with `src/content/blog.ts` as the shipped default.
 *
 * A slug present in the `posts` table wins; the built-in posts show through until one is
 * edited in /admin, at which point the edit is saved as a row and takes over. Editing a
 * built-in post therefore never needs an import step, and unpublishing one is a row with
 * published = false. If the table is missing (schema not applied yet) the built-ins stand
 * on their own, so the public site cannot break on a database change.
 */
export interface Journal {
  slug: string;
  title: string;
  seoTitle: string | null;
  excerpt: string;
  category: string;
  date: string;
  /** Last edit, YYYY-MM-DD: the row's updated_at, or the publish date for a built-in. Never earlier than `date`. */
  updated: string;
  image: string;
  imageAlt: string;
  body: string;
  /** `image` comes from a built-in post only; an edit in /admin saves the body as text and drops it. */
  sections: { heading?: string; paragraphs: string[]; image?: { src: string; alt: string; w: number; h: number } }[];
  keywords: string[];
  areas: string[];
  faqs: { q: string; a: string }[];
  author: string | null;
  published: boolean;
  builtIn: boolean;
}

export const CATEGORIES = ["Guides", "Prices", "Care", "Buying advice"] as const;

/** "## Heading" opens a section; blank lines separate paragraphs. */
export function toSections(body: string) {
  const out: { heading?: string; paragraphs: string[] }[] = [];
  for (const raw of body.split(/\n{2,}/)) {
    const block = raw.trim();
    if (!block) continue;
    if (/^#{2,3}\s+/.test(block)) {
      const [first, ...rest] = block.split("\n");
      out.push({ heading: first.replace(/^#{2,3}\s+/, "").trim(), paragraphs: rest.map((l) => l.trim()).filter(Boolean) });
    } else {
      if (!out.length) out.push({ paragraphs: [] });
      out[out.length - 1].paragraphs.push(block.replace(/\n+/g, " "));
    }
  }
  return out.filter((s) => s.heading || s.paragraphs.length);
}

export const fromSections = (sections: Post["sections"]) =>
  sections.map((s) => [s.heading ? `## ${s.heading}` : null, ...s.paragraphs].filter(Boolean).join("\n\n")).join("\n\n");

const fromStatic = (p: Post): Journal => ({
  slug: p.slug,
  title: p.title,
  seoTitle: p.seoTitle ?? null,
  excerpt: p.excerpt,
  category: p.category,
  date: p.date,
  updated: p.date,
  image: p.image.src,
  imageAlt: p.image.alt,
  body: fromSections(p.sections),
  sections: p.sections,
  keywords: p.keywords ?? [],
  areas: p.areas ?? [],
  faqs: p.faqs ?? [],
  author: null,
  published: true,
  builtIn: true,
});

type DbRow = Record<string, unknown>;
const fromRow = (r: DbRow): Journal => {
  const body = String(r.body ?? "");
  const published = new Date(String(r.published_at ?? r.created_at)).toISOString().slice(0, 10);
  return {
    slug: String(r.slug),
    title: String(r.title),
    seoTitle: (r.seo_title as string) || null,
    excerpt: String(r.description ?? ""),
    category: String(r.category ?? "Guides"),
    date: published,
    updated: r.updated_at ? [published, new Date(String(r.updated_at)).toISOString().slice(0, 10)].sort()[1] : published,
    image: String(r.image ?? ""),
    imageAlt: String(r.image_alt ?? ""),
    body,
    sections: toSections(body),
    keywords: (r.keywords as string[]) ?? [],
    areas: (r.areas as string[]) ?? [],
    faqs: (r.faqs as { q: string; a: string }[]) ?? [],
    author: (r.author as string) || null,
    published: Boolean(r.published),
    builtIn: false,
  };
};

async function rows(): Promise<Journal[]> {
  const sql = db();
  if (!sql) return [];
  try {
    return ((await sql`select * from posts`) as DbRow[]).map(fromRow);
  } catch {
    return []; // table not applied yet — the built-ins carry the site
  }
}

/** Every post the admin can act on: database rows first, built-ins that have not been edited after. */
export async function allJournal(): Promise<Journal[]> {
  const db = await rows();
  const overridden = new Set(db.map((p) => p.slug));
  return [...db, ...POSTS.filter((p) => !overridden.has(p.slug)).map(fromStatic)].sort((a, b) => b.date.localeCompare(a.date));
}

/** What the public site shows. */
export async function publishedJournal(): Promise<Journal[]> {
  return (await allJournal()).filter((p) => p.published);
}

export async function getJournal(slug: string): Promise<Journal | null> {
  return (await allJournal()).find((p) => p.slug === slug) ?? null;
}

export const readingMins = (p: Journal) =>
  Math.max(2, Math.round(p.sections.flatMap((s) => s.paragraphs).join(" ").split(/\s+/).length / 200));

export const wordCount = (p: Journal) => p.sections.flatMap((s) => s.paragraphs).join(" ").split(/\s+/).filter(Boolean).length;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });

/** The same rules `npm run check:seo` enforces, shown to the author before they publish. */
export function seoChecks(p: Journal) {
  const title = p.seoTitle ?? p.title;
  const words = wordCount(p);
  return [
    { label: "Title 60 characters or fewer", ok: title.length <= 60 && title.length > 10, detail: `${title.length}/60` },
    { label: "Description 70–160 characters", ok: p.excerpt.length >= 70 && p.excerpt.length <= 160, detail: `${p.excerpt.length}/160` },
    { label: "Cover image with alt text", ok: Boolean(p.image && p.imageAlt), detail: p.image ? (p.imageAlt ? "set" : "alt missing") : "no image" },
    { label: "At least one subheading", ok: p.sections.some((s) => s.heading), detail: `${p.sections.filter((s) => s.heading).length} headings` },
    { label: "600+ words", ok: words >= 600, detail: `${words} words` },
    { label: "Keywords set", ok: p.keywords.length > 0, detail: `${p.keywords.length}` },
    { label: "Local areas set (GEO)", ok: p.areas.length > 0, detail: p.areas.join(", ") || "none" },
    { label: "FAQ block for AI answers", ok: p.faqs.length > 0, detail: `${p.faqs.length} questions` },
  ];
}

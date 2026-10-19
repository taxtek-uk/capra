import { GET as brief } from "../llms.txt/route";
import { BRAND } from "@/lib/brand";
import { publishedJournal } from "@/lib/posts";

export const revalidate = 3600;

/**
 * /llms-full.txt — the /llms.txt brief followed by the full text of every published guide, as Markdown,
 * so a retrieval bot can read the articles without crawling and stripping each page.
 */
export async function GET() {
  const [head, posts] = await Promise.all([brief().then((r) => r.text()), publishedJournal()]);
  const guides = posts.map((p) => [
    `## ${p.title}`,
    `Source: ${BRAND.domain}/blog/${p.slug} · Published ${p.date}${p.updated > p.date ? ` · Updated ${p.updated}` : ""}`,
    p.excerpt,
    ...p.sections.flatMap((s) => [...(s.heading ? [`### ${s.heading}`] : []), ...s.paragraphs]),
    ...(p.faqs.length ? ["### Questions", ...p.faqs.map((f) => `**${f.q}** ${f.a}`)] : []),
  ].join("\n\n"));
  return new Response(`${head.trimEnd()}\n\n# Guides, full text\n\n${guides.join("\n\n---\n\n")}\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

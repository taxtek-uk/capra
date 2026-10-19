import { htmlToMarkdown } from "@/lib/markdown";

/**
 * /<page>.md (rewritten here in next.config.ts): the page's own content as Markdown, without navigation,
 * for answer engines and retrieval bots. Takes a site path only and reads the live page, so it can never
 * say anything the page does not. noindex: it is an alternate form, not a second copy for search.
 */
const PATH = /^\/[a-z0-9\-/]{0,200}$/;

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segs = (await params).path;
  const path = segs.join("/") === "index" ? "/" : `/${segs.join("/")}`;
  const notFound = () => new Response("Not found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  if (!PATH.test(path) || path.startsWith("/admin") || path.startsWith("/account") || path.startsWith("/md")) return notFound();

  const { origin } = new URL(req.url);
  const res = await fetch(new URL(path, origin), { headers: { "user-agent": "capra-md" }, redirect: "manual" }).catch(() => null);
  if (!res?.ok) return notFound();
  const html = await res.text();
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) return notFound();

  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? new URL(path, origin).href;
  const body = `Source: ${canonical}\n\n${htmlToMarkdown(html, canonical.replace(/^(https?:\/\/[^/]+).*$/, "$1"))}`;
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=3600, s-maxage=86400" },
  });
}

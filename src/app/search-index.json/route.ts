import { searchIndex } from "@/lib/search";

/** Rebuilt hourly, like the sitemap; fetched by the search dialog only when someone opens it. */
export const revalidate = 3600;

export async function GET() {
  return Response.json(await searchIndex(), { headers: { "x-robots-tag": "noindex" } });
}

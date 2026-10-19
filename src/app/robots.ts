import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

/**
 * Search and AI agents can retrieve public content. Access does not guarantee indexing or citation;
 * training controls and search retrieval are different uses. Only private paths are closed.
 */
const AI_AGENTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "Google-Extended",
  "PerplexityBot", "Perplexity-User", "Applebot", "Applebot-Extended", "meta-externalagent", "FacebookBot",
  "Amazonbot", "DuckAssistBot", "cohere-ai", "YouBot", "CCBot", "Bytespider",
];
const CLOSED = ["/api/", "/admin/", "/account", "/cart", "/checkout", "/order/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: CLOSED }, { userAgent: AI_AGENTS, allow: "/", disallow: CLOSED }],
    sitemap: `${BRAND.domain}/sitemap.xml`,
    host: BRAND.domain,
  };
}

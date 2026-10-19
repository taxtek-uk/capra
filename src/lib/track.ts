import { createHash } from "node:crypto";

/** Salted, truncated IP hash — enough to count unique visitors, useless as an identifier. */
export const hashIp = (ip: string) =>
  createHash("sha256").update(`${ip}|${process.env.ADMIN_DASH_TOKEN ?? "capra"}`).digest("hex").slice(0, 32);

const BOT = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pingdom|monitor|curl|wget|python-requests|node-fetch|gptbot|claudebot|perplexity|ahrefs|semrush|facebookexternalhit|whatsapp|preview/i;
export const isBot = (ua: string) => !ua || BOT.test(ua);

/** A beacon from this machine: `next dev`, the perf gate and local audits share the production database
 *  through .env.local, and Lighthouse's emulated phone does not say it is Lighthouse. No visitor arrives on loopback. */
export const isLocal = (ip: string) => /^(::1$|127\.|::ffff:127\.)/.test(ip);

/** Deliberately small UA parsing: three labels the dashboard groups by, no dependency. */
export function parseUa(ua: string) {
  const device = /iPad|Tablet|PlayBook|Silk/i.test(ua) ? "tablet" : /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua) ? "mobile" : "desktop";
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /SamsungBrowser/.test(ua) ? "Samsung Internet" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Safari\//.test(ua) ? "Safari" : "Other";
  const os =
    /Windows/.test(ua) ? "Windows" :
    /iPhone|iPad|iPod/.test(ua) ? "iOS" :
    /Android/.test(ua) ? "Android" :
    /Mac OS X/.test(ua) ? "macOS" :
    /Linux/.test(ua) ? "Linux" : "Other";
  return { device, browser, os };
}

/** Vercel's edge geo headers. Empty everywhere else, which is fine — the columns are nullable. */
export function geoOf(h: Headers) {
  const g = (k: string) => {
    const v = h.get(k);
    return v ? decodeURIComponent(v).slice(0, 80) : null;
  };
  return {
    country: g("x-vercel-ip-country"),
    region: g("x-vercel-ip-country-region"),
    city: g("x-vercel-ip-city"),
    latitude: g("x-vercel-ip-latitude"),
    longitude: g("x-vercel-ip-longitude"),
  };
}

/** Referrer → a channel name the owner can act on. */
export function channelOf(referrer: string | null, utmSource: string | null, utmMedium: string | null) {
  if (utmMedium && /cpc|ppc|paid/i.test(utmMedium)) return "Paid";
  if (utmSource) return "Campaign";
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (/google|bing|duckduckgo|yahoo|ecosia|brave/.test(host)) return "Search";
    if (/facebook|instagram|linkedin|twitter|x\.com|pinterest|tiktok|youtube|reddit/.test(host)) return "Social";
    if (/chatgpt|openai|perplexity|claude|gemini|copilot/.test(host)) return "AI";
    return "Referral";
  } catch {
    return "Direct";
  }
}

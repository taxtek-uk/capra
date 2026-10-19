import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { ipOf, localLimit } from "@/lib/ratelimit";
import { geoOf, hashIp, isBot, isLocal, parseUa } from "@/lib/track";

/**
 * Visit tracking. First-party, no third-party script, no raw IP stored: geo comes from
 * Vercel's edge headers and the IP is only kept as a salted hash for unique counts.
 * Beacons are fire-and-forget — this route never fails a page.
 */
const id = z.string().trim().min(8).max(64);
const txt = (n: number) => z.string().trim().max(n).nullish().transform((v) => v || null);

const Item = z.discriminatedUnion("t", [
  z.object({
    t: z.literal("view"),
    id, sid: id, vid: id,
    path: z.string().trim().min(1).max(300),
    title: txt(200), referrer: txt(400), screen: txt(20), language: txt(20),
    utmSource: txt(80), utmMedium: txt(80), utmCampaign: txt(80), ref: txt(40),
  }),
  z.object({ t: z.literal("ping"), id, sid: id, ms: z.number().int().min(0).max(6 * 3600_000), scroll: z.number().int().min(0).max(100).default(0) }),
  z.object({
    t: z.literal("event"),
    sid: id, vid: id,
    name: z.string().trim().min(1).max(60),
    path: txt(300), label: txt(200),
    meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  }),
]);
const Schema = z.array(Item).min(1).max(20);

export async function POST(req: Request) {
  const ip = ipOf(req);
  // Rate limit before validation: a beacon storm must cost one map lookup, not a parse.
  // A dropped beacon answers 204, never 429/503: the browser logs any error status in the visitor's console,
  // and nothing on the page can act on it.
  // In memory, never the database: a heartbeat every 15 seconds per open tab is the bulk of all requests,
  // and on Redis it used up the plan that every enquiry and sign-in depended on (17 Oct 2026).
  if (!localLimit(`track:${ip}`, 300, 10 * 60_000).ok) return new Response(null, { status: 204 });

  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  if (isBot(ua) || isLocal(ip)) return new Response(null, { status: 204 });

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });
  const sql = db();
  if (!sql) return new Response(null, { status: 204 });

  const geo = geoOf(h);
  const { device, browser, os } = parseUa(ua);

  // Neon query promises are lazy: collect writes before sending one HTTP transaction.
  const queries = [];
  for (const it of parsed.data) {
    if (it.t === "view") {
      queries.push(sql`
        insert into sessions (id, visitor_id, landing_path, referrer, utm_source, utm_medium, utm_campaign, ref_code,
                              country, region, city, latitude, longitude, device, browser, os, screen, language, ip_hash, views)
        values (${it.sid}, ${it.vid}, ${it.path}, ${it.referrer}, ${it.utmSource}, ${it.utmMedium}, ${it.utmCampaign}, ${it.ref},
                ${geo.country}, ${geo.region}, ${geo.city}, ${geo.latitude}, ${geo.longitude}, ${device}, ${browser}, ${os}, ${it.screen}, ${it.language}, ${hashIp(ip)}, 1)
        on conflict (id) do update set views = sessions.views + 1, last_seen_at = now()`);
      queries.push(sql`
        insert into page_views (id, session_id, visitor_id, path, title, referrer)
        values (${it.id}, ${it.sid}, ${it.vid}, ${it.path}, ${it.title}, ${it.referrer})
        on conflict (id) do nothing`);
    } else if (it.t === "ping") {
      // Cumulative per view, so a late beacon can never shorten a visit.
      queries.push(sql`update page_views set duration_ms = greatest(duration_ms, ${it.ms}), max_scroll = greatest(max_scroll, ${it.scroll}) where id = ${it.id}`);
      // ponytail: re-sums the visit each ping. Fine at this traffic; make it a delta if it ever shows up in the logs.
      queries.push(sql`update sessions set duration_ms = (select coalesce(sum(duration_ms), 0) from page_views where session_id = ${it.sid}), last_seen_at = now() where id = ${it.sid}`);
    } else {
      queries.push(sql`insert into events (session_id, visitor_id, path, name, label, meta) values (${it.sid}, ${it.vid}, ${it.path}, ${it.name}, ${it.label}, ${JSON.stringify(it.meta ?? {})})`);
      // Page-speed readings are measurements, not actions: they stay out of the visit's action count.
      if (it.name !== "web_vital") queries.push(sql`update sessions set events = sessions.events + 1, last_seen_at = now() where id = ${it.sid}`);
    }
  }
  try {
    await sql.transaction(queries, {
      fetchOptions: { signal: AbortSignal.timeout(8_000) },
    });
  } catch (error) {
    // A lost response can follow a successful commit. Retrying could double-count
    // views/events, so leave delivery best-effort and report failure to the caller.
    // Log codes only: driver errors can contain SQL, visitor data or credentials.
    const failure = error as { code?: string; sourceError?: { name?: string; cause?: { code?: string } } };
    console.warn("[track] Database batch failed", {
      code: failure?.sourceError?.cause?.code ?? failure?.code ?? failure?.sourceError?.name ?? "UNKNOWN",
      items: parsed.data.length,
    });
    return new Response(null, { status: 204 });
  }
  return new Response(null, { status: 204 });
}

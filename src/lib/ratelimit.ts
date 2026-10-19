import { createHash } from "node:crypto";
import { db } from "@/lib/db";

type Result = { ok: boolean; retryAfter: number };
type Failure = "configuration" | "query" | "response";

/**
 * Shared rate limits, counted in the site's own Postgres (`rate_limits` in docs/schema.sql). There is no Redis
 * (18 Oct 2026): the Upstash plan ran out of requests on 17 Oct and, failing closed, refused every enquiry,
 * quote, order and sign-in for 21 hours.
 *
 * One atomic upsert per check: a fixed window per bucket on the database clock, identifiers hashed. A burst
 * across a window edge can reach twice the limit, which is fine at these limits.
 *
 * When the database cannot answer:
 * - "closed" (the default) refuses: sign-in, codes and saved baskets, where the limit stops guessing or abuse.
 * - "open" lets the request through, held by a per-instance limit instead: enquiries, the basket and
 *   orders. Losing a customer costs more than a few extra requests (decided 18 Oct 2026).
 */
export async function rateLimit(key: string, limit: number, windowMs: number, onFailure: "closed" | "open" = "closed"): Promise<Result> {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(windowMs) || windowMs < 1)
    throw new Error("Invalid rate limit policy");
  // The policy is part of the bucket, so two limits on the same key never share a count.
  const bucket = `${limit}:${windowMs}:${createHash("sha256").update(key).digest("hex")}`;
  const failed = (reason: Failure): Result => {
    // Fixed fields only: never keys, emails, IPs, SQL or driver errors.
    console.error(JSON.stringify({ event: "rate_limit_dependency_failure", dependency: "postgres", reason, onFailure }));
    return onFailure === "open" ? localLimit(bucket, limit, windowMs) : { ok: false, retryAfter: 60 };
  };

  const sql = db();
  if (!sql) return failed("configuration");
  let rows: Record<string, unknown>[];
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    rows = await Promise.race([
      sql`
        insert into rate_limits as r (bucket, hits, window_start) values (${bucket}, 1, now())
        on conflict (bucket) do update set
          hits = case when r.window_start <= now() - make_interval(secs => ${windowMs}::float8 / 1000) then 1 else r.hits + 1 end,
          window_start = case when r.window_start <= now() - make_interval(secs => ${windowMs}::float8 / 1000) then now() else r.window_start end
        returning hits, extract(epoch from window_start + make_interval(secs => ${windowMs}::float8 / 1000) - now()) as retry_after`,
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), 3000); }),
    ]);
  } catch {
    return failed("query");
  } finally {
    clearTimeout(timer);
  }
  const hits = Number(rows?.[0]?.hits), retry = Number(rows?.[0]?.retry_after);
  if (!Number.isSafeInteger(hits) || hits < 1 || !Number.isFinite(retry)) return failed("response");
  return hits <= limit ? { ok: true, retryAfter: 0 } : { ok: false, retryAfter: Math.max(1, Math.ceil(retry)) };
}

/** Daily cron: the longest window is 15 minutes, so a bucket idle for a day holds nothing. */
export async function purgeRateLimits() {
  const sql = db();
  if (!sql) return 0;
  return (await sql`delete from rate_limits where window_start < now() - interval '1 day' returning 1`).length;
}

const local = new Map<string, number[]>();
/**
 * Per-instance sliding window: the visit beacon's only limit, and the backstop for "open" routes while Postgres
 * is down. ponytail: N instances allow N × the limit; a shared count is what `rateLimit` is for.
 */
export function localLimit(key: string, limit: number, windowMs: number): Result {
  const now = Date.now();
  if (local.size > 10_000) local.clear(); // bounds memory; a reset only forgives, never blocks
  const recent = (local.get(key) ?? []).filter((t) => t > now - windowMs);
  if (recent.length >= limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
  recent.push(now);
  local.set(key, recent);
  return { ok: true, retryAfter: 0 };
}

export const ipOf = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

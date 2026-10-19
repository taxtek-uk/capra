import { db } from "@/lib/db";

/**
 * Read side of the visit tracking. Every query is windowed in days and excludes bots.
 * Deltas compare the window against the window before it, which is the only comparison
 * the owner asked a question about ("is this week better than last week?").
 */
export type Row = Record<string, string | number | null>;

const pct = (now: number, prev: number) => (prev > 0 ? ((now - prev) / prev) * 100 : now > 0 ? 100 : null);

export async function overview(days: number) {
  const sql = db();
  if (!sql) return null;
  const [s] = (await sql`
    select
      count(*) filter (where started_at >= now() - make_interval(days => ${days}))::int as sessions,
      count(*) filter (where started_at <  now() - make_interval(days => ${days}))::int as prev_sessions,
      count(distinct visitor_id) filter (where started_at >= now() - make_interval(days => ${days}))::int as visitors,
      count(distinct visitor_id) filter (where started_at <  now() - make_interval(days => ${days}))::int as prev_visitors,
      coalesce(avg(duration_ms) filter (where started_at >= now() - make_interval(days => ${days})), 0)::float as avg_ms,
      coalesce(avg(duration_ms) filter (where started_at <  now() - make_interval(days => ${days})), 0)::float as prev_avg_ms,
      count(*) filter (where started_at >= now() - make_interval(days => ${days}) and views <= 1)::int as bounced
    from sessions
    where bot = false and started_at >= now() - make_interval(days => ${days * 2})`) as Row[];
  const [v] = (await sql`
    select
      count(*) filter (where created_at >= now() - make_interval(days => ${days}))::int as views,
      count(*) filter (where created_at <  now() - make_interval(days => ${days}))::int as prev_views
    from page_views where created_at >= now() - make_interval(days => ${days * 2})`) as Row[];
  const [l] = (await sql`select count(distinct session_id)::int as live from page_views where created_at > now() - interval '5 minutes'`) as Row[];

  const n = (k: string, o: Row = s) => Number(o?.[k] ?? 0);
  return {
    sessions: n("sessions"),
    visitors: n("visitors"),
    views: Number(v?.views ?? 0),
    avgMs: n("avg_ms"),
    bounceRate: n("sessions") ? (n("bounced") / n("sessions")) * 100 : 0,
    live: Number(l?.live ?? 0),
    delta: {
      sessions: pct(n("sessions"), n("prev_sessions")),
      visitors: pct(n("visitors"), n("prev_visitors")),
      views: pct(Number(v?.views ?? 0), Number(v?.prev_views ?? 0)),
      avgMs: pct(n("avg_ms"), n("prev_avg_ms")),
    },
  };
}

/** Daily views + unique visitors, zero-filled so the chart never shows a gap as a dip. */
export async function series(days: number) {
  const sql = db();
  if (!sql) return [];
  const rows = (await sql`
    select to_char(d.day, 'DD Mon') as label, d.day::date as day,
           count(pv.id)::int as views,
           count(distinct pv.visitor_id)::int as visitors
    from generate_series(current_date - make_interval(days => ${days - 1}), current_date, interval '1 day') as d(day)
    left join page_views pv on pv.created_at >= d.day and pv.created_at < d.day + interval '1 day'
    group by d.day order by d.day`) as Row[];
  return rows.map((r) => ({ label: String(r.label), a: Number(r.views), b: Number(r.visitors) }));
}

export async function topPages(days: number, limit = 10) {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select path, count(*)::int as views, count(distinct visitor_id)::int as visitors,
           coalesce(avg(nullif(duration_ms, 0)), 0)::float as avg_ms,
           coalesce(avg(nullif(max_scroll, 0)), 0)::float as avg_scroll
    from page_views where created_at >= now() - make_interval(days => ${days})
    group by path order by views desc limit ${limit}`) as Row[];
}

export async function sources(days: number, limit = 8) {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select coalesce(nullif(utm_source, ''), nullif(regexp_replace(split_part(split_part(referrer, '//', 2), '/', 1), '^www\\.', ''), ''), 'Direct') as source,
           count(*)::int as sessions
    from sessions where bot = false and started_at >= now() - make_interval(days => ${days})
    group by 1 order by sessions desc limit ${limit}`) as Row[];
}

/** Every visit since tracking began — the one number that is not windowed. */
export async function allTime() {
  const sql = db();
  if (!sql) return null;
  const [r] = (await sql`
    select count(distinct visitor_id)::int as visitors, count(*)::int as visits,
           coalesce(sum(views), 0)::int as views, min(started_at) as since
    from sessions where bot = false`) as Row[];
  return { visitors: Number(r?.visitors ?? 0), visits: Number(r?.visits ?? 0), views: Number(r?.views ?? 0), since: r?.since ? String(r.since) : null };
}

export const CHANNELS = ["Search", "Social", "AI assistants", "Other sites", "Direct"] as const;
export type Channel = (typeof CHANNELS)[number];

/**
 * Sources folded into channels, with visitors, visits and views each, plus the visitor
 * delta against the window before. A referrer from our own domain counts as Direct.
 * ponytail: host patterns are a hand list — add a new network here when it shows up in `sources()`.
 */
export async function channels(days: number) {
  const empty = () => ({ visitors: 0, visits: 0, views: 0, delta: null as number | null });
  const out = Object.fromEntries(CHANNELS.map((c) => [c, empty()])) as Record<Channel, ReturnType<typeof empty>>;
  const sql = db();
  if (!sql) return out;
  const rows = (await sql`
    with s as (
      select visitor_id, views, started_at >= now() - make_interval(days => ${days}) as cur,
             lower(coalesce(nullif(utm_source, ''), regexp_replace(split_part(split_part(coalesce(referrer, ''), '//', 2), '/', 1), '^www\\.', ''))) as host,
             lower(coalesce(utm_medium, '')) as medium
      from sessions where bot = false and started_at >= now() - make_interval(days => ${days * 2})
    )
    select case
             when host = '' or host like '%capra.pk' or host like 'localhost%' then 'Direct'
             when host ~ '(chatgpt|openai|perplexity|claude\\.ai|gemini|copilot|deepseek|grok|meta\\.ai|you\\.com|phind|mistral)' then 'AI assistants'
             when medium = 'social' or host ~ '(facebook|instagram|^ig$|^fb$|tiktok|linkedin|pinterest|twitter|^t\\.co$|^x\\.com$|youtube|whatsapp|wl\\.co)' then 'Social'
             when medium in ('cpc', 'organic') or host ~ '(google|bing|yahoo|duckduckgo|baidu|ecosia|brave|yandex)' then 'Search'
             else 'Other sites'
           end as channel,
           count(distinct visitor_id) filter (where cur)::int as visitors,
           count(distinct visitor_id) filter (where not cur)::int as prev_visitors,
           count(*) filter (where cur)::int as visits,
           coalesce(sum(views) filter (where cur), 0)::int as views
    from s group by 1`) as Row[];
  for (const r of rows) {
    const c = out[r.channel as Channel];
    if (!c) continue;
    c.visitors = Number(r.visitors);
    c.visits = Number(r.visits);
    c.views = Number(r.views);
    c.delta = pct(c.visitors, Number(r.prev_visitors));
  }
  return out;
}

export async function places(days: number, limit = 10) {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select coalesce(nullif(city, ''), 'Unknown') as city, coalesce(nullif(region, ''), '') as region,
           coalesce(nullif(country, ''), '') as country, count(*)::int as sessions
    from sessions where bot = false and started_at >= now() - make_interval(days => ${days})
    group by 1, 2, 3 order by sessions desc limit ${limit}`) as Row[];
}

export async function breakdown(days: number, column: "device" | "browser" | "os") {
  const sql = db();
  if (!sql) return [];
  if (column === "device")
    return (await sql`select coalesce(device, 'unknown') as label, count(*)::int as sessions from sessions where bot = false and started_at >= now() - make_interval(days => ${days}) group by 1 order by sessions desc`) as Row[];
  if (column === "browser")
    return (await sql`select coalesce(browser, 'unknown') as label, count(*)::int as sessions from sessions where bot = false and started_at >= now() - make_interval(days => ${days}) group by 1 order by sessions desc limit 8`) as Row[];
  return (await sql`select coalesce(os, 'unknown') as label, count(*)::int as sessions from sessions where bot = false and started_at >= now() - make_interval(days => ${days}) group by 1 order by sessions desc limit 8`) as Row[];
}

export async function topEvents(days: number, limit = 10) {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select name, count(*)::int as n, count(distinct session_id)::int as sessions
    from events where name <> 'web_vital' and created_at >= now() - make_interval(days => ${days})
    group by name order by n desc limit ${limit}`) as Row[];
}

/**
 * Page speed as real visitors felt it: the 75th percentile of each metric (Google's own cut-off for
 * "good"), overall and per device, from the `web_vital` events the Tracker sends.
 */
export async function webVitals(days: number) {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select e.label as metric, case when grouping(s.device) = 1 then 'all' else coalesce(s.device, 'unknown') end as device,
           percentile_cont(0.75) within group (order by (e.meta->>'value')::float) as p75, count(*)::int as n
    from events e left join sessions s on s.id = e.session_id
    where e.name = 'web_vital' and e.created_at >= now() - make_interval(days => ${days}) and (s.bot is null or s.bot = false)
    group by grouping sets ((e.label), (e.label, s.device))`) as Row[];
}

/** Recent visits with enough context to read a story: where from, where to, how long. */
export async function recentSessions(limit = 40, offset = 0) {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select s.id, s.visitor_id, s.landing_path, s.referrer, s.utm_source, s.ref_code, s.city, s.region, s.country,
           s.device, s.browser, s.os, s.views, s.events, s.duration_ms, s.started_at, s.last_seen_at,
           (select path from page_views p where p.session_id = s.id order by created_at desc limit 1) as last_path
    from sessions s where s.bot = false
    order by s.started_at desc limit ${limit} offset ${offset}`) as Row[];
}

export async function sessionDetail(id: string) {
  const sql = db();
  if (!sql) return { session: null, views: [], events: [] };
  const [session] = (await sql`select * from sessions where id = ${id}`) as Row[];
  const views = (await sql`select path, title, duration_ms, max_scroll, created_at from page_views where session_id = ${id} order by created_at`) as Row[];
  const events = (await sql`select name, label, path, meta, created_at from events where session_id = ${id} and name <> 'web_vital' order by created_at`) as Row[];
  return { session: session ?? null, views, events };
}

/** One feed of everything that happened: orders, enquiries and tracked events. */
export async function activity(limit = 12) {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    (select 'order' as kind, ref as title, coalesce(contact->>'name', '') || ' · ' || coalesce(address->>'city', '') as detail, total::float as amount, created_at from orders)
    union all
    (select 'enquiry', coalesce(kind, 'contact'), name, null, created_at from enquiries)
    union all
    (select 'event', name, coalesce(label, path, ''), null, created_at from events where name not in ('form_submit', 'web_vital'))
    order by created_at desc limit ${limit}`) as Row[];
}

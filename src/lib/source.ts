/**
 * v1 source-tracking parity. Remembers the consultant code (`?ref=`), the UTM pair and the
 * path the visitor first landed on, for 30 days.
 *
 * Stored in localStorage *and* a cookie: the admin CRM routes leads on `assignment_source`,
 * whose `referral_code` and `source_path` values both come from here, so losing this context
 * silently reassigns a consultant's lead to the postcode pool. localStorage alone is cleared
 * too easily to be the only copy.
 */
export interface SourceContext {
  ref: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  /** Path the visitor first landed on. This is what the CRM stores as `source_path`. */
  landingPath: string | null;
  /** First segment of `landingPath` — the consultant vanity slug when there is one. */
  sourceSlug: string | null;
  /** Epoch ms of first capture. Entries older than TTL_MS are discarded. */
  savedAt: number;
}

const KEY = "capra:source";
const COOKIE = "capra_source";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const clip = (v: string | null | undefined, n: number) => {
  const s = v?.trim();
  return s ? s.slice(0, n) : null;
};

const slugOf = (path: string | null) => {
  if (!path) return null;
  const [seg] = path.split("/").filter(Boolean);
  return seg ? clip(decodeURIComponent(seg).toLowerCase(), 60) : null;
};

const fresh = (c: SourceContext | null): SourceContext | null =>
  c && typeof c.savedAt === "number" && Date.now() - c.savedAt < TTL_MS ? c : null;

function fromCookie(): SourceContext | null {
  try {
    const hit = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
    return hit ? (JSON.parse(decodeURIComponent(hit.slice(COOKIE.length + 1))) as SourceContext) : null;
  } catch {
    return null;
  }
}

function persist(next: SourceContext) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode — the cookie below is the fallback */
  }
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=${Math.floor(TTL_MS / 1000)}; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}

/** Call once per page load. First touch wins: an existing code is never overwritten by a later visit. */
export function captureSource(): SourceContext | null {
  try {
    const q = new URLSearchParams(location.search);
    const prev = readSource();
    const landingPath = prev?.landingPath ?? location.pathname;
    const next: SourceContext = {
      ref: clip(q.get("ref") ?? q.get("consultant"), 40) ?? prev?.ref ?? null,
      utmSource: clip(q.get("utm_source"), 80) ?? prev?.utmSource ?? null,
      utmCampaign: clip(q.get("utm_campaign"), 80) ?? prev?.utmCampaign ?? null,
      landingPath: clip(landingPath, 300),
      sourceSlug: slugOf(landingPath),
      savedAt: prev?.savedAt ?? Date.now(),
    };
    persist(next);
    return next;
  } catch {
    return null;
  }
}

export function readSource(): SourceContext | null {
  let local: SourceContext | null = null;
  try {
    local = JSON.parse(localStorage.getItem(KEY) ?? "null") as SourceContext | null;
  } catch {
    /* fall through to the cookie */
  }
  return fresh(local) ?? fresh(fromCookie());
}

/** The subset the APIs accept. Keep in sync with the `meta` schemas in `src/app/api/**`. */
export function sourceMeta() {
  const s = readSource();
  return {
    ref: s?.ref ?? null,
    utmSource: s?.utmSource ?? null,
    utmCampaign: s?.utmCampaign ?? null,
    landingPath: s?.landingPath ?? null,
    sourceSlug: s?.sourceSlug ?? null,
  };
}

/**
 * On-page SEO gate. Reads the prerendered HTML in `.next/server/app` after `npm run build`
 * and fails if any indexable page is missing the tags search and generative engines rely on,
 * or if a title/description runs past the length Google will show.
 *
 * Run: npm run build && npm run check:seo
 */
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = `${process.env.NEXT_DIST_DIR || ".next"}/server/app`;
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;
/** Framework-internal shells that never reach a crawler. */
const IGNORE = [/^\/_global-error$/, /^\/_not-found$/];

if (!existsSync(ROOT)) {
  console.error("No build output found. Run `npm run build` first.");
  process.exit(1);
}

const html: string[] = [];
(function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith(".html")) html.push(p);
  }
})(ROOT);

const decode = (s: string) =>
  s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x2F;/g, "/").replace(/&amp;/g, "&");
const pick = (h: string, re: RegExp) => {
  const m = h.match(re);
  return m ? decode(m[1]).trim() : null;
};

type Issue = { route: string; problem: string };
const issues: Issue[] = [];
const seenTitle = new Map<string, string[]>();
const seenDesc = new Map<string, string[]>();
let checked = 0;
/** noindex pages: never required in (and never wanted in) the sitemap. */
const noindexRoutes = new Set<string>();

for (const file of html.sort()) {
  const route = ("/" + relative(ROOT, file).replace(/\.html$/, "")).replace(/^\/index$/, "/");
  if (IGNORE.some((re) => re.test(route))) continue;
  const h = readFileSync(file, "utf8");
  const add = (problem: string) => issues.push({ route, problem });

  const robots = pick(h, /<meta name="robots" content="([\s\S]*?)"/) ?? "";
  const noindex = robots.includes("noindex");
  if (noindex) noindexRoutes.add(route);
  const title = pick(h, /<title>([\s\S]*?)<\/title>/);
  const desc = pick(h, /<meta name="description" content="([\s\S]*?)"/);
  const canonical = pick(h, /<link rel="canonical" href="([\s\S]*?)"/);
  const h1s = h.match(/<h1[\s>]/g)?.length ?? 0;
  const ogCount = h.match(/<meta property="og:/g)?.length ?? 0;
  const twCount = h.match(/<meta name="twitter:/g)?.length ?? 0;
  const jsonLd = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

  if (noindex) continue; // a noindex page has nothing left to prove
  checked++;

  if (!title) add("missing <title>");
  else {
    if (title.length > TITLE_MAX) add(`title ${title.length} chars (max ${TITLE_MAX}): ${title}`);
    (seenTitle.get(title) ?? seenTitle.set(title, []).get(title)!).push(route);
  }

  if (!desc) add("missing meta description");
  else {
    if (desc.length > DESC_MAX) add(`description ${desc.length} chars (max ${DESC_MAX})`);
    if (desc.length < DESC_MIN) add(`description ${desc.length} chars (min ${DESC_MIN})`);
    (seenDesc.get(desc) ?? seenDesc.set(desc, []).get(desc)!).push(route);
  }

  if (!canonical) add("missing canonical");
  else if (!canonical.startsWith("https://")) add(`canonical is not absolute: ${canonical}`);

  if (h1s !== 1) add(`${h1s} <h1> tags (want exactly 1)`);
  if (ogCount < 6) add(`only ${ogCount} og: tags`);
  if (twCount < 3) add(`only ${twCount} twitter: tags`);
  if (!jsonLd.length) add("no JSON-LD");

  for (const block of jsonLd) {
    try {
      JSON.parse(block);
    } catch {
      add("malformed JSON-LD");
    }
  }
  const types = jsonLd.join("");
  if (!types.includes('"BreadcrumbList"') && route !== "/") add("no BreadcrumbList");
  if (!types.includes('"WebSite"')) add("no WebSite node");
  if (!types.includes('"LocalBusiness"')) add("no LocalBusiness node");

  const imgNoAlt = [...h.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)].length;
  if (imgNoAlt) add(`${imgNoAlt} <img> without alt`);
}

/**
 * The sitemap must only advertise URLs that answer 200. Listing a redirect source
 * (as /smart-devices/orvibo once did) wastes crawl budget and dilutes the signal.
 */
const sitemapFile = join(ROOT, "sitemap.xml.body");
if (existsSync(sitemapFile)) {
  const xml = readFileSync(sitemapFile, "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const config = readFileSync("next.config.ts", "utf8");
  const redirectSources = [...config.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]);
  const rendered = new Set(
    html.map((f) => ("/" + relative(ROOT, f).replace(/\.html$/, "")).replace(/^\/index$/, "/")),
  );
  /** Routes that render on demand, so they leave no .html behind. */
  const dynamicRoutes = new Set<string>([]);

  for (const url of urls) {
    const path = url.replace(/^https?:\/\/[^/]+/, "") || "/";
    if (redirectSources.includes(path)) issues.push({ route: path, problem: "sitemap lists a URL that redirects" });
    else if (!rendered.has(path) && !dynamicRoutes.has(path)) issues.push({ route: path, problem: "sitemap lists a URL with no page" });
  }
  const orphans = [...rendered].filter(
    (r) => !r.startsWith("/_") && !r.startsWith("/admin") && !noindexRoutes.has(r) && !urls.some((u) => u.endsWith(r === "/" ? "/" : r)),
  );
  for (const r of orphans) issues.push({ route: r, problem: "page exists but is not in the sitemap" });
  console.log(`Sitemap: ${urls.length} URLs.`);
}

for (const [title, routes] of seenTitle) if (routes.length > 1) issues.push({ route: routes.join(", "), problem: `duplicate title: ${title}` });
for (const [, routes] of seenDesc) if (routes.length > 1) issues.push({ route: routes.join(", "), problem: "duplicate meta description" });

const byRoute = new Map<string, string[]>();
for (const { route, problem } of issues) (byRoute.get(route) ?? byRoute.set(route, []).get(route)!).push(problem);

for (const [route, problems] of [...byRoute].sort()) {
  console.log(`\n${route}`);
  for (const p of problems) console.log(`  ✗ ${p}`);
}

console.log(`\n${checked} indexable pages checked, ${issues.length} issue(s).`);
if (issues.length) process.exit(1);
console.log("SEO gate passed.");

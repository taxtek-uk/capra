/** Audit production pages, sequentially to avoid CPU contention. Run a production server first.
 * BASE_URL=http://localhost:3100 npm run audit:lighthouse
 * AUDIT_PATHS=/,/shop AUDIT_DEVICE=desktop npm run audit:lighthouse
 * Uses Lighthouse's standard simulated throttling; results are lab data, not field Core Web Vitals.
 */
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const base = process.env.BASE_URL || 'http://localhost:3100';
const device = process.env.AUDIT_DEVICE || 'mobile';
const privatePages = process.env.AUDIT_PRIVATE === 'true';
const categories = ['performance', 'accessibility', 'best-practices', ...(!privatePages ? ['seo'] : [])];
if (!['mobile', 'desktop'].includes(device)) throw new Error('AUDIT_DEVICE must be mobile or desktop');
const xml = await fetch(`${base}/sitemap.xml`).then(r => { if (!r.ok) throw new Error(`Sitemap ${r.status}`); return r.text(); });
const paths = process.env.AUDIT_PATHS?.split(',') || [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname))];
const dir = path.resolve(process.env.AUDIT_OUTPUT || `artifacts/lighthouse/${device}`);
await mkdir(dir, { recursive: true });
const chrome = await launch({ chromeFlags: ['--headless=new', '--disable-dev-shm-usage'] });
const results = [];
const runs = new Map();
try {
  for (const route of paths) {
    const result = await lighthouse(`${base}${route}`, { port: chrome.port, output: ['json', 'html'], logLevel: 'error', onlyCategories: categories }, device === 'desktop' ? desktopConfig : undefined);
    if (!result || result.lhr.runtimeError) throw new Error(`${route}: ${result?.lhr.runtimeError?.message || 'no report'}`);
    if (result.lhr.configSettings.formFactor !== device) throw new Error(`Requested ${device}, but Lighthouse used ${result.lhr.configSettings.formFactor}`);
    const { lhr } = result;
    const run = (runs.get(route) || 0) + 1;
    runs.set(route, run);
    const name = (route === '/' ? 'home' : route.slice(1).replaceAll('/', '__')) + (run > 1 ? `--run-${run}` : '');
    await Promise.all(result.report.map((r, i) => writeFile(path.join(dir, `${name}.${i ? 'html' : 'json'}`), r)));
    const row = { route, device, scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score || 0) * 100)])), lcpMs: lhr.audits['largest-contentful-paint'].numericValue, tbtMs: lhr.audits['total-blocking-time'].numericValue, cls: lhr.audits['cumulative-layout-shift'].numericValue, failedAudits: Object.values(lhr.audits).filter(a => a.score !== null && a.score < 1 && ['binary', 'numeric'].includes(a.scoreDisplayMode)).map(a => ({ id: a.id, title: a.title, score: a.score, value: a.displayValue })) };
    results.push(row);
    await writeFile(path.join(dir, 'summary.json'), JSON.stringify({ auditedAt: new Date().toISOString(), lighthouseVersion: lhr.lighthouseVersion, base, device, privatePages, results }, null, 2) + '\n');
    console.log(route, JSON.stringify(row.scores), `LCP ${Math.round(row.lcpMs)}ms; TBT ${Math.round(row.tbtMs)}ms; CLS ${row.cls.toFixed(3)}`);
  }
} finally { await chrome.kill(); }
// An explicit, repeatable quality budget, not a claim that every Lighthouse opportunity disappears.
const failures = results.filter(r => r.scores.performance < 90 || r.scores.accessibility < 100 || r.scores['best-practices'] < 100 || (!privatePages && r.scores.seo < 100));
console.log(`${results.length} ${device} routes audited; ${failures.length} outside budget (${privatePages ? '90/100/100; SEO intentionally excluded for private pages' : '90/100/100/100'}). Reports: ${dir}`);
if (failures.length) process.exitCode = 1;

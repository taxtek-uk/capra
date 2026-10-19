/** Read-only browser crawl plus local basket interactions; never submits an order or enquiry. */
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://localhost:3100';
const xml = await fetch(`${base}/sitemap.xml`).then(r => r.text());
const routes = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname))];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const issues: string[] = [];
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
// Browser verification must not record synthetic visits in the live analytics database.
await mobile.route('**/api/track', route => route.fulfill({ status: 204 }));
const page = await mobile.newPage();
page.on('pageerror', e => issues.push(`Browser error at ${page.url()}: ${e.message}`));
const links = new Map<string, Set<string>>();
try {
  for (const route of routes) {
    const res = await page.goto(`${base}${route}`, { waitUntil: 'load' });
    assert.equal(res?.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, `${route} H1`);
    const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
    assert.equal(new URL(canonical || '').href, new URL(route, 'https://www.capra.pk').href, `${route} canonical`);
    const data = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      links: [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map(a => a.getAttribute('href') || '').filter(h => h.startsWith('/') || h.startsWith('#')),
    }));
    if (data.overflow) issues.push(`${route}: horizontal overflow on 390px viewport`);
    for (const href of data.links) {
      const url = new URL(href, `${base}${route}`);
      if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api') || url.pathname.startsWith('/order/')) continue;
      const key = url.pathname;
      const anchors = links.get(key) || new Set<string>();
      if (url.hash) anchors.add(decodeURIComponent(url.hash.slice(1)));
      links.set(key, anchors);
    }
    console.log(`Checked ${route}`);
  }
  for (const [route, anchors] of links) {
    const res = await fetch(`${base}${route}`, { redirect: 'manual' });
    if (route.startsWith('/account') && res.status === 307 && res.headers.get('location')?.includes('/account/sign-in')) continue;
    if (res.status !== 200) { issues.push(`Broken or redirected internal link ${route}: ${res.status}`); continue; }
    if (anchors.size) {
      const html = await res.text();
      for (const id of anchors) if (!html.includes(`id="${id}"`)) issues.push(`Broken anchor ${route}#${id}`);
    }
  }
  for (const route of ['/delivery/unknown', '/thermos-flasks/500ml', '/md/admin', '/cart.md']) {
    const res = await fetch(`${base}${route}`);
    assert.equal(res.status, 404, `${route} must not advertise nonexistent or private content`);
  }
  for (const route of ['/thermos-flasks/3-litre', '/delivery/sindh', '/dealers']) {
    const res = await fetch(`${base}${route}.md`);
    assert.equal(res.status, 200, `${route}.md`);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex');
    assert.ok((await res.text()).includes(`Source: https://www.capra.pk${route}`));
  }
  await page.goto(`${base}/thermos-flasks/3-litre`);
  const first = page.locator('article').filter({ has: page.getByRole('button', { name: /add/i }) }).first();
  await first.getByRole('button', { name: /add/i }).click();
  const cart = await page.evaluate(() => Object.entries(localStorage).find(([k]) => /cart|basket/.test(k)));
  assert.ok(cart && cart[1].includes('3l/'), '3 litre collection quick-add must add a 3 litre model');
  await page.goto(`${base}/delivery`);
  await page.getByRole('button', { name: 'Search the site', exact: true }).filter({ visible: true }).first().click();
  const input = page.getByRole('dialog').getByRole('searchbox');
  await input.fill('thermos Burewala');
  await page.getByRole('dialog').getByRole('link', { name: /Vehari/ }).waitFor();
  await page.keyboard.press('Escape');
  await page.goto(`${base}/`);
  assert.equal(await page.locator('footer canvas').getAttribute('width'), null, 'Offscreen footer must not initialise the GPU during page load');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector<HTMLCanvasElement>('footer canvas')?.style.opacity === '1');
  console.log('Footer starts only when approached');
  await mkdir('artifacts/browser', { recursive: true });
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/thermos-flasks/3-litre', '/delivery/sindh', '/dealers']) {
      await page.goto(`${base}${route}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) issues.push(`${route}: overflow at ${width}px`);
      if (width === 390 || width === 1440) await page.screenshot({ path: `artifacts/browser/${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}-${width}.png`, fullPage: true, animations: 'disabled' });
      console.log(`Layout ${width}px ${route}`);
    }
  }
  console.log(`${routes.length} indexable pages, ${links.size} internal destinations, Markdown, missing routes, city search, 3L quick-add and responsive layouts checked.`);
  assert.deepEqual(issues, [], issues.join('\n'));
} finally { await browser.close(); }

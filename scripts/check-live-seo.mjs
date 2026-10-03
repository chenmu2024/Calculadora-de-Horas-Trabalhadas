import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Read-only. Run after deployment; defaults to the production canonical domain.
const base = new URL(process.argv[2] ?? 'https://calculadoradehorastrabalhadas.org');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const canonicalUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
const failures = [];
for (const canonical of canonicalUrls) {
  try {
    const response = await fetch(new URL(canonical.pathname, base), { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`rel="canonical" href="${canonical.href}"`), 'canonical');
    assert.ok(html.includes('id="jsonld-schema"'), 'schema');
    assert.ok(!/name="robots"[^>]*content="[^"]*noindex/.test(html), 'indexable');
    if (canonical.pathname.includes('/guia-clt/')) assert.ok(/id="art[1-4]-/.test(html), 'article body');
  } catch (error) { failures.push({ path: canonical.pathname, error: error.message }); }
}
for (const pathname of ['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt', '/og-image.png']) {
  try { assert.equal((await fetch(new URL(pathname, base), { signal: AbortSignal.timeout(15000) })).status, 200); }
  catch (error) { failures.push({ path: pathname, error: error.message }); }
}
const missing = await fetch(new URL('/__seo_missing_page__', base), { signal: AbortSignal.timeout(15000) });
if (missing.status !== 404) failures.push({ path: '/__seo_missing_page__', error: `Expected 404, got ${missing.status}` });
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
for (const rule of config.redirects) {
  const response = await fetch(new URL(rule.source, base), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
  if (![301, 308].includes(response.status) || new URL(response.headers.get('location') ?? '/', base).pathname !== rule.destination) failures.push({ path: rule.source, error: 'Missing permanent redirect to canonical path' });
}
console.log(JSON.stringify({ base: base.origin, pages: canonicalUrls.length, aliasRedirects: config.redirects.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;

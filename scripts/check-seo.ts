import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PAGE_META } from '../src/components/SEOHead';
import { ARTICLE_META } from '../src/utils/articles';
import { TAB_ROUTES } from '../src/utils/routes';
import { buildStructuredData } from '../src/utils/structuredData';
import { CONTENT_UPDATED } from '../src/utils/editorial';
import { HOURS_CONTENT } from '../src/utils/hoursContent';
import { WIDGET_META } from '../src/utils/widgets';

const pages = [...Object.entries(TAB_ROUTES).map(([tab, path]) => ({ tab, path, meta: PAGE_META[tab] })), ...ARTICLE_META.map(row => ({ tab: 'blog', path: `/guia-clt/${row.slug}`, meta: { ...row, canonical: `https://calculadoradehorastrabalhadas.org/guia-clt/${row.slug}` } }))];
pages.push({ tab: 'widgets', path: '/widgets', meta: WIDGET_META });
assert.equal(new Set(pages.map(page => page.meta.title)).size, pages.length, 'Titles must be unique');
assert.equal(new Set(pages.map(page => page.meta.canonical)).size, pages.length, 'Canonicals must be unique');
for (const page of pages) {
  const html = await readFile(page.path === '/' ? 'dist/index.html' : `dist${page.path}/index.html`, 'utf8');
  const schema = JSON.parse(html.match(/<script id="jsonld-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
  assert.deepEqual(schema, buildStructuredData(page.tab, page.meta), page.path);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, page.path);
  assert.ok(html.includes(`rel="canonical" href="${page.meta.canonical}"`));
  for (const property of ['og:url', 'twitter:url']) assert.ok(html.includes(`content="${page.meta.canonical}"`), `${page.path}: ${property}`);
  if (HOURS_CONTENT[page.tab]) {
    assert.ok(html.includes('Memória de cálculo'), `${page.path}: initial calculation`);
    assert.ok(html.includes('Como é calculado'), `${page.path}: initial formula`);
    assert.ok(html.includes('Perguntas frequentes'), `${page.path}: visible FAQ`);
    assert.ok(html.includes('<input'), `${page.path}: initial calculator`);
    assert.ok(!html.includes('AggregateRating') && !html.includes('"@type":"Review"'));
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1].replace(/\/$/, '') || '/';
    if (/\.[a-z0-9]+$/i.test(href)) continue;
    assert.ok(href === '/embed/horas' || pages.some(row => row.path === href), `${page.path}: broken internal link ${href}`);
  }
  const article = ARTICLE_META.find(row => page.path.endsWith('/' + row.slug));
  if (article) assert.ok(html.includes(`id="art${article.id}-`), page.path);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const page of pages) assert.ok(sitemap.includes(`<loc>${page.meta.canonical}</loc>`), page.path);
assert.equal((sitemap.match(/<url>/g) ?? []).length, pages.length);
assert.equal((sitemap.match(new RegExp(`<lastmod>${CONTENT_UPDATED}</lastmod>`, 'g')) ?? []).length, pages.length);
for (const filename of ['llms.txt', 'llms-full.txt']) assert.equal(await readFile(`dist/${filename}`, 'utf8'), await readFile(`public/${filename}`, 'utf8'), `Refresh public/${filename} from its generated dist counterpart after editorial changes`);
assert.ok((await readFile('dist/404.html', 'utf8')).includes('noindex, follow'));
const embed = await readFile('dist/embed/horas/index.html', 'utf8');
assert.ok(embed.includes('noindex, follow'));
assert.ok(embed.includes('https://calculadoradehorastrabalhadas.org/'));
assert.ok(embed.indexOf('id="results"') < embed.indexOf('id="memory"'));
assert.ok(!sitemap.includes('/embed/horas'));
console.log(`Verified ${pages.length} initial HTML pages, schemas, sitemap and AI context snapshots.`);

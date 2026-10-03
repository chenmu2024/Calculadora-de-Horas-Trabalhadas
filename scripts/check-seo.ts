import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PAGE_META } from '../src/components/SEOHead';
import { ARTICLE_META } from '../src/utils/articles';
import { TAB_ROUTES } from '../src/utils/routes';
import { buildStructuredData } from '../src/utils/structuredData';
import { CONTENT_UPDATED } from '../src/utils/editorial';

const pages = [...Object.entries(TAB_ROUTES).map(([tab, path]) => ({ tab, path, meta: PAGE_META[tab] })), ...ARTICLE_META.map(row => ({ tab: 'blog', path: `/guia-clt/${row.slug}`, meta: { ...row, canonical: `https://calculadoradehorastrabalhadas.org/guia-clt/${row.slug}` } }))];
for (const page of pages) {
  const html = await readFile(page.path === '/' ? 'dist/index.html' : `dist${page.path}/index.html`, 'utf8');
  const schema = JSON.parse(html.match(/<script id="jsonld-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
  assert.deepEqual(schema, buildStructuredData(page.tab, page.meta), page.path);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, page.path);
  assert.ok(html.includes(`rel="canonical" href="${page.meta.canonical}"`));
  const article = ARTICLE_META.find(row => page.path.endsWith('/' + row.slug));
  if (article) assert.ok(html.includes(`id="art${article.id}-`), page.path);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<url>/g) ?? []).length, pages.length);
assert.equal((sitemap.match(new RegExp(`<lastmod>${CONTENT_UPDATED}</lastmod>`, 'g')) ?? []).length, pages.length);
for (const filename of ['llms.txt', 'llms-full.txt']) assert.equal(await readFile(`dist/${filename}`, 'utf8'), await readFile(`public/${filename}`, 'utf8'), `Refresh public/${filename} from its generated dist counterpart after editorial changes`);
assert.ok((await readFile('dist/404.html', 'utf8')).includes('noindex, follow'));
console.log(`Verified ${pages.length} initial HTML pages, schemas, sitemap and AI context snapshots.`);

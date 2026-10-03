import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { PAGE_META } from '../src/components/SEOHead';
import { PAGE_H1_TITLES } from '../src/App';
import SEOContent from '../src/components/SEOContent';
import FAQSection from '../src/components/FAQSection';
import { TAB_ROUTES } from '../src/utils/routes';
import { ARTICLE_META } from '../src/utils/articles';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const base = await readFile('dist/index.html', 'utf8');
const pages = [...Object.entries(TAB_ROUTES).map(([tab, path]) => ({ tab, path, meta: PAGE_META[tab], h1: PAGE_H1_TITLES[tab] })), ...ARTICLE_META.map(article => ({ tab: 'blog', path: `/guia-clt/${article.slug}`, meta: { ...article, canonical: `https://calculadoradehorastrabalhadas.org/guia-clt/${article.slug}` }, h1: article.title }))];
for (const page of [...pages, { tab: 'not-found', path: '/404', meta: PAGE_META['not-found'], h1: 'Página Não Encontrada' }]) {
  let html = base.replace(/<title>.*?<\/title>/s, `<title>${escape(page.meta.title)}</title>`);
  const attributes: Record<string, string> = { description: page.meta.description, 'og:title': page.meta.title, 'og:description': page.meta.description, 'og:url': page.meta.canonical, 'twitter:title': page.meta.title, 'twitter:description': page.meta.description, 'twitter:url': page.meta.canonical };
  for (const [name, value] of Object.entries(attributes)) {
    html = html.replace(new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*("\\s*\/?>)`), `$1${escape(value)}$2`);
  }
  html = html.replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${page.meta.canonical}$2`);
  html = html.replace(/(<link rel="alternate" hreflang="pt-BR" href=")[^"]*("\s*\/?>)/, `$1${page.meta.canonical}$2`);
  if (page.tab === 'not-found') html = html.replace(/(<meta name="robots" content=")[^"]*("\s*\/?>)/, '$1noindex, follow$2');
  const content = page.tab === 'not-found' ? '<p>A página não existe. <a href="/">Voltar ao início</a></p>' : renderToStaticMarkup(<><SEOContent activeTab={page.tab} onSelectTab={() => {}} /><FAQSection activeTab={page.tab} onSelectTab={() => {}} /></>);
  const navigation = Object.entries(TAB_ROUTES).map(([tab, path]) => `<li><a href="${path}">${escape(PAGE_H1_TITLES[tab])}</a></li>`).join('');
  const fallback = `<main><h1>${escape(page.h1)}</h1><p>${escape(page.meta.description)}</p>${content}<nav aria-label="Calculadoras"><ul>${navigation}</ul></nav><noscript>Ative JavaScript para calcular e editar os valores.</noscript></main>`;
  html = html.replace(/(<div id="root">)[\s\S]*?(<\/div>\s*<script type="module")/, `$1${fallback}$2`);
  const schema = { '@context': 'https://schema.org', '@type': page.path.startsWith('/guia-clt/') ? 'Article' : 'WebPage', name: page.meta.title, description: page.meta.description, url: page.meta.canonical, inLanguage: 'pt-BR' };
  html = html.replace('</head>', `<script id="jsonld-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script></head>`);
  const filename = page.path === '/' ? 'dist/index.html' : page.path === '/404' ? 'dist/404.html' : `dist${page.path}/index.html`;
  await mkdir(join(filename, '..'), { recursive: true });
  await writeFile(filename, html);
}
const redirects = pages.filter(page => page.path !== '/').map(page => `${page.path} ${page.path}/index.html 200`).join('\n');
await writeFile('dist/_redirects', redirects + '\n/* /404.html 404\n');
// Vercel supports a normal 404 file and these explicit rewrites; no broad SPA fallback.
await writeFile('vercel.json', JSON.stringify({ rewrites: pages.filter(page => page.path !== '/').map(page => ({ source: page.path, destination: page.path + '/index.html' })) }, null, 2) + '\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${page.meta.canonical}</loc></url>`).join('')}</urlset>`;
await writeFile('dist/sitemap.xml', sitemap);
async function list(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? list(join(directory, entry.name)) : [join(directory, entry.name).replace(/\\/g, '/')]));
  return nested.flat();
}
const assets = (await list('dist')).filter(file => !file.endsWith('/sw.js') && !file.endsWith('/_redirects') && !file.endsWith('/404.html')).map(file => '/' + file.slice(5));
const pagePaths = pages.map(page => page.path);
const urls = [...new Set([...assets, ...pagePaths, ...pagePaths.filter(path => path !== '/').map(path => path + '/')])];
const hash = createHash('sha256');
for (const asset of assets) hash.update(await readFile('dist' + asset));
let worker = await readFile('public/sw.js', 'utf8');
worker = worker.replace("'horas-clt-dev'", `'horas-clt-${hash.digest('hex').slice(0, 12)}'`).replace("['/', '/index.html', '/manifest.json']", JSON.stringify(urls)).replace("const PAGE_PATHS = ['/'];", `const PAGE_PATHS = ${JSON.stringify(pagePaths)};`);
await writeFile('dist/sw.js', worker);
console.log(`Pre-rendered ${pages.length} pages; versioned offline cache includes ${urls.length} resources.`);

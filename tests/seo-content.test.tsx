import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import StaticPageContent from '../src/components/StaticPageContent';
import { ARTICLE_META } from '../src/utils/articles';
import { buildStructuredData } from '../src/utils/structuredData';
import { CONTENT_UPDATED, SITE_URL } from '../src/utils/editorial';
import { PAGE_META } from '../src/components/SEOHead';
import { buildAIContext, htmlToText } from '../scripts/ai-context';

test('each article exposes its own complete body without window or JavaScript', () => {
  for (const article of ARTICLE_META) {
    const html = renderToStaticMarkup(<StaticPageContent tab="blog" articleId={article.id} />);
    assert.ok(html.includes(`id="art${article.id}-`), article.slug);
    assert.ok(html.includes('Índice do Conteúdo do Artigo'));
    assert.ok(html.includes('/sobre#metodologia-editorial'));
    assert.ok(html.includes('Referência oficial:'));
    assert.ok(!html.includes('Especialista em'));
    for (const other of ARTICLE_META.filter(row => row.id !== article.id)) assert.ok(!html.includes(`id="art${other.id}-`));
  }
});

test('institutional pages and guide directory do not fall back to daily content', () => {
  const markers = { about: 'metodologia-editorial', contact: 'Entre em Contato Conosco', terms: 'term-1', privacy: 'priv-1', blog: '/guia-clt/como-calcular-hora-de-trabalho' };
  for (const [tab, marker] of Object.entries(markers)) {
    const html = renderToStaticMarkup(<StaticPageContent tab={tab} />);
    assert.ok(html.includes(marker), tab);
    assert.ok(!html.includes('Resposta rápida e método de cálculo'));
  }
});

test('article graph uses the exact article identity and editorial organization', () => {
  for (const row of ARTICLE_META) {
    const canonical = `${SITE_URL}/guia-clt/${row.slug}`;
    const graph = buildStructuredData('blog', { ...row, canonical })['@graph'];
    const article = graph.find(node => node['@type'] === 'Article')!;
    assert.equal(article.headline, row.title);
    assert.equal(article.url, canonical);
    assert.equal(article.dateModified, CONTENT_UPDATED);
    assert.deepEqual(article.mainEntityOfPage, { '@id': canonical + '#webpage' });
    assert.equal(article.datePublished, undefined);
    assert.ok(!graph.some(node => node['@type'] === 'Person' || node['@type'] === 'WebApplication'));
    assert.equal((graph.find(node => node['@type'] === 'BreadcrumbList')!.itemListElement as unknown[]).length, 3);
  }
  for (const tab of ['about', 'terms', 'privacy', 'contact', 'blog']) assert.ok(!buildStructuredData(tab, PAGE_META[tab])['@graph'].some(node => node['@type'] === 'WebApplication'));
});

test('AI summaries preserve conditions and link all complete articles', () => {
  const context = buildAIContext(['escala12x36', 'ferias', 'contact'].map(tab => ({ tab, meta: PAGE_META[tab], text: htmlToText(renderToStaticMarkup(<StaticPageContent tab={tab} />)) })));
  assert.ok(context.summary.includes('não são acréscimos automáticos'));
  assert.ok(context.summary.includes('venda de 10 dias pressupõe direito a 30 dias'));
  assert.ok(context.summary.includes('sem envio direto pelo servidor'));
  assert.ok(!context.summary.includes('plataforma líder'));
  for (const row of ARTICLE_META) assert.ok(context.summary.includes(`${SITE_URL}/guia-clt/${row.slug}`));
  assert.ok(context.full.includes('Método editorial'));
  assert.ok(!context.full.includes('<svg'));
});

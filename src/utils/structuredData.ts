import { ARTICLE_META } from './articles';
import { CONTENT_UPDATED, EDITOR_NAME, SITE_URL, TOOL_ANSWERS } from './editorial';

export function buildStructuredData(tab: string, meta: { title: string; description: string; canonical: string }) {
  const article = ARTICLE_META.find(row => meta.canonical === `${SITE_URL}/guia-clt/${row.slug}`);
  const organization = `${SITE_URL}/#organization`;
  const website = `${SITE_URL}/#website`;
  const pageId = `${meta.canonical}#webpage`;
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': organization, name: EDITOR_NAME, url: `${SITE_URL}/`, logo: `${SITE_URL}/icon-192.png`, publishingPrinciples: `${SITE_URL}/sobre#metodologia-editorial` },
    { '@type': 'WebSite', '@id': website, name: EDITOR_NAME, url: `${SITE_URL}/`, inLanguage: 'pt-BR', publisher: { '@id': organization } },
    { '@type': tab === 'about' ? 'AboutPage' : tab === 'contact' ? 'ContactPage' : tab === 'blog' && !article ? 'CollectionPage' : 'WebPage', '@id': pageId, name: meta.title, description: meta.description, url: meta.canonical, inLanguage: 'pt-BR', isPartOf: { '@id': website }, ...(tab !== 'not-found' ? { dateModified: CONTENT_UPDATED } : {}) },
  ];
  if (article) graph.push({ '@type': 'Article', '@id': `${meta.canonical}#article`, headline: article.title, description: article.description, url: meta.canonical, mainEntityOfPage: { '@id': pageId }, inLanguage: 'pt-BR', author: { '@id': organization }, publisher: { '@id': organization }, image: `${SITE_URL}/og-image.png`, dateModified: CONTENT_UPDATED });
  if (TOOL_ANSWERS[tab]) graph.push({ '@type': 'WebApplication', '@id': `${meta.canonical}#calculator`, name: meta.title, description: meta.description, url: meta.canonical, applicationCategory: 'BusinessApplication', operatingSystem: 'All', browserRequirements: 'Requires JavaScript', inLanguage: 'pt-BR', publisher: { '@id': organization }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' }, isPartOf: { '@id': pageId } });
  if (meta.canonical !== `${SITE_URL}/` && tab !== 'not-found') {
    const items = [{ '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` }];
    if (article) items.push({ '@type': 'ListItem', position: 2, name: 'Guia CLT', item: `${SITE_URL}/guia-clt` });
    items.push({ '@type': 'ListItem', position: items.length + 1, name: meta.title, item: meta.canonical });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${meta.canonical}#breadcrumb`, itemListElement: items });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

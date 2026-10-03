import { ARTICLE_META } from '../src/utils/articles';
import { CONTENT_UPDATED, EDITOR_NAME, SITE_URL, SOURCES, TOOL_ANSWERS } from '../src/utils/editorial';

export function buildAIContext(pages: { tab: string; meta: { title: string; description: string; canonical: string }; text: string }[]) {
  const summary = `# ${EDITOR_NAME}\n\n> Ferramentas gratuitas de cálculo de jornada e simulações trabalhistas no Brasil. Resultados dependem das premissas, categoria e convenção coletiva. Não representam parecer jurídico ou concessão de benefício.\n\nRevisão do conteúdo: ${CONTENT_UPDATED}. Tabelas fiscais: 2026.\n\n## Calculadoras e páginas\n\n${pages.filter(page => !page.meta.canonical.includes('/guia-clt/')).map(page => `- [${page.meta.title}](${page.meta.canonical}): ${TOOL_ANSWERS[page.tab]?.answer ?? (page.tab === 'contact' ? 'Página de contato; o formulário abre o aplicativo de e-mail, sem envio direto pelo servidor.' : page.meta.description)}`).join('\n')}\n\n## Artigos completos\n\n${ARTICLE_META.map(article => `- [${article.title}](${SITE_URL}/guia-clt/${article.slug}): ${article.description}`).join('\n')}\n\n## Fontes e método\n\n${Object.values(SOURCES).map(source => `- [${source.name}](${source.url})`).join('\n')}\n- [Autoria editorial, limites e correções](${SITE_URL}/sobre#metodologia-editorial)\n- [Documentação completa](${SITE_URL}/llms-full.txt)\n\nEste arquivo auxilia a leitura; não garante inclusão, classificação ou citação em mecanismos de busca ou respostas de IA.\n`;
  const full = `${summary}\n## Conteúdo das páginas\n\n${pages.map(page => `### ${page.meta.title}\n\nURL: ${page.meta.canonical}\nRevisão: ${CONTENT_UPDATED}\n\n${page.text}\n`).join('\n')}`;
  return { summary, full };
}

export function htmlToText(html: string): string {
  return html.replace(/<svg\b[\s\S]*?<\/svg>/g, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href: string, text: string) => `${text.replace(/<[^>]*>/g, '')} (${href.startsWith('/') ? SITE_URL + href : href})`)
    .replace(/<\/(p|h[1-6]|li|section|tr|div)>/g, '\n')
    .replace(/<[^>]*>/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

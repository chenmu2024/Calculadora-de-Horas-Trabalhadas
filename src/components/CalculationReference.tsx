import { CONTENT_UPDATED, CONTENT_UPDATED_LABEL, SOURCES, TOOL_ANSWERS } from '../utils/editorial';
import { ARTICLE_META } from '../utils/articles';
import { getHrefForTab } from '../utils/routes';

export default function CalculationReference({ activeTab }: { activeTab: string }) {
  const entry = TOOL_ANSWERS[activeTab];
  if (!entry) return null;
  const sources = [SOURCES.clt, ...(entry.fiscal ? [SOURCES.irrf, SOURCES.inss] : []), ...(activeTab === 'seguro' ? [SOURCES.seguro] : [])];
  const articleIds = activeTab === 'rate' || activeTab === 'cltpj' ? ['3'] : activeTab === 'night' || activeTab === 'overtime' || activeTab === 'escala12x36' ? ['4'] : activeTab === 'timesheet' || activeTab === 'banco' || activeTab === 'monthly' ? ['2', '1'] : ['1'];
  return (
    <section className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-4 text-sm" aria-label="Método, exemplo e referências">
      <h2 className="font-bold text-lg">Resposta rápida e método de cálculo</h2>
      <p>{entry.answer}</p>
      <h3 className="font-semibold">Exemplo com as premissas informadas</h3>
      <p>{entry.example}</p>
      <p className="text-xs">Simulação informativa. Confira contrato, categoria e convenção coletiva. Revisão do conteúdo: <time dateTime={CONTENT_UPDATED}>{CONTENT_UPDATED_LABEL}</time>. Tabelas fiscais: ano de 2026.</p>
      <h3 className="font-semibold">Fontes oficiais e limites</h3>
      <ul className="list-disc pl-5">{sources.map(source => <li key={source.url}><a className="text-blue-600 underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></li>)}</ul>
      <p><a className="text-blue-600 underline" href="/sobre#metodologia-editorial">Método editorial e correção de divergências</a></p>
      <nav aria-label="Leituras e calculadoras relacionadas" className="flex flex-wrap gap-3">
        {ARTICLE_META.filter(article => articleIds.includes(article.id)).map(article => <a className="text-blue-600 underline" key={article.id} href={`/guia-clt/${article.slug}`}>{article.title}</a>)}
        {entry.related.map(tab => <a className="text-blue-600 underline" key={tab} href={getHrefForTab(tab)}>{TOOL_ANSWERS[tab]?.example ? getHrefForTab(tab).slice(1).replace(/-/g, ' ') : tab}</a>)}
      </nav>
    </section>
  );
}

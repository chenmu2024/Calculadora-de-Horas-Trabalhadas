import { HOURS_CONTENT } from '../utils/hoursContent';
import { CONTENT_UPDATED, CONTENT_UPDATED_LABEL, SOURCES, TOOL_ANSWERS } from '../utils/editorial';
import { getHrefForTab } from '../utils/routes';

export default function HoursToolContent({ tab }: { tab: string }) {
  const entry = HOURS_CONTENT[tab];
  if (!entry) return null;
  const legal = ['daily', 'banco', 'overtime', 'rate'].includes(tab);
  return <section className="tool-card space-y-4 text-sm">
    <h2 className="text-lg font-bold">Como é calculado</h2><p>{entry.formula}</p>
    <h3 className="font-bold">Exemplo</h3><p>{entry.example}</p>
    <h3 className="font-bold">Como usar</h3><p>{entry.use}</p>
    <p><strong>Entradas:</strong> {entry.inputs}</p><p><strong>Resultados:</strong> {entry.outputs}</p>
    <h3 className="font-bold">Ferramentas relacionadas</h3>
    <nav aria-label="Ferramentas relacionadas" className="flex flex-wrap gap-3">{TOOL_ANSWERS[tab].related.map(id => <a className="text-blue-600 underline" href={getHrefForTab(id)} key={id}>{id === 'daily' ? 'Horas Trabalhadas' : getHrefForTab(id).slice(1).replace(/-/g, ' ')}</a>)}</nav>
    <h2 className="text-lg font-bold">Perguntas frequentes</h2>{entry.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    <h3 className="font-bold">Aplicação e limites</h3><p>{entry.limits}</p>
    {legal && <p>Fonte oficial: <a className="text-blue-600 underline" href={SOURCES.clt.url}>{SOURCES.clt.name}</a>. Confira o contrato e a convenção coletiva.</p>}
    {tab === 'business' && <p>Referências: <a className="text-blue-600 underline" href="https://legis.sigepe.gov.br/sigepe-bgp-ws-legis/legis-service/download/?id=0026440285-ALPDF%2F2025">Calendário federal de 2026 — Portaria MGI 11.460</a>; <a className="text-blue-600 underline" href="https://www2.camara.leg.br/legin/fed/lei/1995/lei-9093-12-setembro-1995-348594-normaatualizada-pl.pdf">Lei 9.093 — feriados locais</a>.</p>}
    <p>Atualização do conteúdo: <time dateTime={CONTENT_UPDATED}>{CONTENT_UPDATED_LABEL}</time>.</p>
  </section>;
}

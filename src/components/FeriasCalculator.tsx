import { copyText as writeClipboard } from '../utils/browser';
import React, { useState } from 'react';
import { Calendar, Copy, Check, Printer } from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';
import LaborBreakdown, { formatLaborBRL as formatBRL, type LaborRow } from './LaborBreakdown';
import { calculateFerias } from '../lib/calculations/ferias';
import { LABOR_REVIEWED } from '../lib/legal-rules/2026';

interface FeriasCalculatorProps { onSelectTab?: (tab: string) => void }

export default function FeriasCalculator({ onSelectTab }: FeriasCalculatorProps) {
  const [salary, setSalary] = useState('3200');
  const [average, setAverage] = useState('0');
  const [mode, setMode] = useState<'integrais' | 'proporcionais'>('integrais');
  const [months, setMonths] = useState('6');
  const [absences, setAbsences] = useState('0');
  const [taken, setTaken] = useState('0');
  const [sell, setSell] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calculated, setCalculated] = useState(false);
  let result: ReturnType<typeof calculateFerias> | null = null;
  let error = '';
  try { result = calculateFerias({ salary, average, mode, months, absences, taken, sell }); }
  catch (cause) { error = (cause as Error).message; }
  const rows: LaborRow[] = result ? [
    { label: 'Remuneração base', value: result.base, formula: 'Salário bruto + média de adicionais e comissões.', informational: true },
    { label: 'Adicionais incluídos', value: result.average, formula: 'Média informada, já incluída na remuneração base; não é somada novamente.', informational: true },
    { label: 'Valor das férias', value: result.vacation, formula: 'Remuneração base × ' + result.daysOff + ' dias ÷ 30.' },
    { label: '1/3 constitucional sobre férias', value: result.third, formula: 'Valor das férias ÷ 3.' },
    { label: 'Abono pecuniário', value: result.abono, formula: 'Remuneração base × ' + result.soldDays + ' dias convertidos ÷ 30.' },
    { label: '1/3 sobre abono', value: result.abonoThird, formula: 'Abono pecuniário ÷ 3. O terço total é distribuído entre férias e abono, sem duplicar valores.' },
  ] : [];
  const copyResults = async () => {
    if (!result) return;
    const summary = ['Cálculo de férias — estimativa bruta', 'Dias de descanso: ' + result.daysOff, ...rows.map(row => row.label + ': ' + formatBRL(row.value)), 'Total bruto estimado: ' + formatBRL(result.total), 'Sem INSS/IRRF e sem salário dos dias trabalhados. Regras revisadas em 14/10/2026.'].join('\n');
    if (await writeClipboard(summary)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Art. 129 a 145 da CLT • 1/3 Constitucional
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
            Simulação de férias + 1/3 constitucional
          </h2>
        </div>
        <button
          disabled={!result} onClick={() => window.print()}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Imprimir</span>
        </button>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Salário Base */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="fer-sal" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Salário Bruto Atual (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">R$</span>
            <input
              id="fer-sal"
              type="number" min="0.01" step="0.01" inputMode="decimal"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="3200"
            />
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Diária: <strong>R$ {result ? (result.base / 30).toFixed(2) : '—'}</strong>
          </span>
        </div>

        <label className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 grid gap-2 text-xs font-bold">Tipo de férias
          <select aria-label="Tipo de férias" value={mode} onChange={e => { setMode(e.target.value as typeof mode); setSell(false); setTaken('0'); }} className="w-full border rounded-xl p-2.5 bg-white dark:bg-neutral-900"><option value="integrais">Férias integrais</option><option value="proporcionais">Férias proporcionais (indenizadas)</option></select>
        </label>
        {([
          ['fer-average', 'Média de adicionais, horas extras e comissões (R$)', average, setAverage, 1000000000, '0.01'],
          ['fer-absences', 'Faltas injustificadas no período aquisitivo', absences, setAbsences, 366, '1'],
          ['fer-taken', 'Dias já gozados ou quitados neste período', taken, setTaken, 30, '0.01'],
        ] as const).map(([id, label, value, setter, max, step]) => <div key={id} className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
          <label htmlFor={id} className="block text-xs font-bold">{label}</label>
          <input id={id} type="number" min="0" max={max} step={step} value={value} onChange={e => setter(e.target.value)} className="w-full border rounded-xl p-2.5 bg-white dark:bg-neutral-900" />
        </div>)}
        {mode === 'proporcionais' && <label className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 grid gap-2 text-xs font-bold">Meses do período aquisitivo (0 a 12)<input type="number" min="0" max="12" step="1" value={months} onChange={e => setMonths(e.target.value)} className="border rounded-xl p-2.5 bg-white dark:bg-neutral-900" /><span className="font-normal">Conte cada mês de serviço e a fração final de pelo menos 15 dias.</span></label>}
        <label className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex items-start gap-3 text-xs font-bold">
          <input type="checkbox" checked={sell} disabled={mode === 'proporcionais'} onChange={e => setSell(e.target.checked)} className="mt-1" />
          <span>Converter 1/3 do direito anual em abono<span className="block font-normal mt-2">30, 24, 18 ou 12 dias de direito permitem converter 10, 8, 6 ou 4 dias. Abono indisponível para férias proporcionais indenizadas.</span></span>
        </label>
      </div>
      <button type="button" onClick={() => setCalculated(true)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-5 py-3">Calcular férias</button>
      <p className="text-xs text-neutral-600 dark:text-neutral-300">Os resultados válidos são atualizados ao editar. Regras atualizadas em: <time dateTime={LABOR_REVIEWED}>14/10/2026</time>. Salário e demais entradas ficam apenas nesta página, sem armazenamento.</p>
      {error && <p role="alert" className="border border-red-300 bg-red-50 text-red-800 p-4 rounded-xl">{error}</p>}

      {result && <>
        {calculated && <p role="status" className="text-sm">Cálculo atualizado. Confira o detalhamento abaixo.</p>}
        <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-6 shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div><span className="text-neutral-300">Direito apurado</span><p className="font-bold text-teal-300">{result.entitlement.toLocaleString('pt-BR')} dias</p></div>
            <div><span className="text-neutral-300">Dias de férias restantes</span><p className="font-bold text-teal-300">{result.daysOff.toLocaleString('pt-BR')} dias de descanso</p></div>
            <div><span className="text-neutral-300">Convertidos em abono</span><p className="font-bold text-teal-300">{result.soldDays} dias</p></div>
          </div>
          <LaborBreakdown rows={rows} />
          <div className="bg-teal-950/80 p-5 rounded-xl border border-teal-800 space-y-3">
            <h3 className="text-sm text-teal-200 font-semibold">Total bruto estimado</h3>
            <p className="text-3xl font-black break-words">{formatBRL(result.total)}</p>
            <p className="text-xs text-teal-100">Férias + terço + abono + terço sobre abono. Sem estimar INSS/IRRF, adiantamento do 13º ou salário dos dias trabalhados.</p>
            <button onClick={copyResults} className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center gap-2">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copiado!' : 'Copiar cálculo de férias'}</button>
          </div>
        </div>
        {result.annualDays === 0 && <p role="note" className="text-sm">Mais de 32 faltas injustificadas no período: não há dias de férias nessa faixa do art. 130. Confira o registro e as hipóteses de ausência justificada.</p>}
      </>}

      {/* Legal Box */}
      <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 p-5 rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-teal-600" />
          Regras de Pagamento de Férias (Artigo 145 da CLT)
        </h4>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          O pagamento da remuneração das férias e, se for o caso, do abono pecuniário, deverá ser efetuado <strong>até 2 (dois) dias antes do início do respectivo período</strong>.
        </p>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Férias concedidas após o prazo concessivo podem ser devidas em dobro (art. 137). O atraso apenas no pagamento não gera automaticamente a dobra: o STF invalidou a Súmula 450 do TST na ADPF 501.
        </p>
      </div>

      <p className="text-sm">Está saindo da empresa? <a className="text-blue-600 underline" href="/calculadora-de-rescisao">Calcule sua rescisão trabalhista</a>.</p>
      {onSelectTab && <InternalLinkCTA currentTab="ferias" onSelectTab={onSelectTab} />}
    </div>
  );
}

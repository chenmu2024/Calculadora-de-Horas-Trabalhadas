import { terminationDates } from '../utils/termination';
import { copyText as writeClipboard } from '../utils/browser';
import React, { useState, useEffect } from 'react';
import { Copy, Check, Printer, AlertTriangle, Briefcase, Sparkles } from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';
import LaborBreakdown, { formatLaborBRL as formatBRL, type LaborRow } from './LaborBreakdown';
import { calculateRescisao, type TerminationType, type NoticeType } from '../lib/calculations/rescisao';
import { LABOR_REVIEWED } from '../lib/legal-rules/2026';

interface RescisaoCalculatorProps { onSelectTab?: (tab: string) => void }
type TipoDesligamento = TerminationType;
type TipoAvisoPrevio = NoticeType;

export default function RescisaoCalculator({ onSelectTab }: RescisaoCalculatorProps) {
  const [grossSalary, setGrossSalary] = useState('3500.00');
  const [tipoDesligamento, setTipoDesligamento] = useState<TipoDesligamento>('sem_justa_causa');
  const [tipoAviso, setTipoAviso] = useState<TipoAvisoPrevio>('indenizado');
  const [yearsWorked, setYearsWorked] = useState('2');
  const [workedDaysMonth, setWorkedDaysMonth] = useState('15');
  const [months13th, setMonths13th] = useState('7');
  const [monthsVacation, setMonthsVacation] = useState('7');
  const [fgtsBalance, setFgtsBalance] = useState('');
  const [fgtsBase, setFgtsBase] = useState('');
  const [withdrawal, setWithdrawal] = useState<'rescisao' | 'aniversario'>('rescisao');
  const [variableAverage, setVariableAverage] = useState('0');
  const [overtimeAverage, setOvertimeAverage] = useState('0');
  const [advance13, setAdvance13] = useState('0');
  const [credits, setCredits] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [absences, setAbsences] = useState('0');
  const [unworkedDays, setUnworkedDays] = useState('30');
  const [dates, setDates] = useState({ admission: '', last: '', start13: '', vacation: '', projectDays: '' });
  const [dateMode, setDateMode] = useState(false);
  const [simpleDays, setSimpleDays] = useState('0');
  const [doubleDays, setDoubleDays] = useState('0');
  const [copied, setCopied] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [dateError, setDateError] = useState('');
  const [appliedDates, setAppliedDates] = useState('');
  const dateSignature = JSON.stringify([dates, tipoDesligamento, tipoAviso]);

  // Remove only this calculator's legacy input keys; never load or save salary inputs.
  useEffect(() => {
    try {
      for (const key of Object.keys(localStorage)) if (key.startsWith('calc_rescisao_')) localStorage.removeItem(key);
    } catch { /* Calculation also works when browser storage is unavailable. */ }
  }, []);

  let result: ReturnType<typeof calculateRescisao> | null = null;
  let error = '';
  try {
    if (dateMode && appliedDates !== dateSignature) throw new Error('Preencha e aplique as datas atualizadas ou selecione avos manuais.');
    result = calculateRescisao({ salary: grossSalary, overtime: overtimeAverage, average: variableAverage, type: tipoDesligamento, notice: tipoAviso,
      years: yearsWorked, salaryDays: workedDaysMonth, months13: months13th, monthsVacation,
      simpleDays, doubleDays, absences, advance13, credits, deductions, unworkedNoticeDays: unworkedDays,
      fgtsBalance, fgtsBase, withdrawal, dates: dateMode ? dates : undefined });
  } catch (cause) { error = (cause as Error).message; }
  const projection = result?.projection;
  const avisoDays = result?.noticeDays ?? 0;
  const m13Final = result?.months13 ?? 0;
  const rows: LaborRow[] = result ? [
    { label: 'Saldo de salário', value: result.salaryBalance, formula: 'Remuneração base ÷ 30 × ' + result.salaryDays + ' dias ainda não pagos.' },
    { label: 'Aviso prévio indenizado', value: result.notice, formula: 'Base ÷ 30 × ' + result.noticeDays + ' dias × ' + (tipoDesligamento === 'acordo_mutuo' ? '50%' : '100%') + '. Aviso trabalhado ou dispensado não gera indenização nesta simulação.' },
    { label: '13º proporcional', value: result.thirteenth, formula: 'Base × ' + result.months13 + '/12. Meses com pelo menos 15 dias; anos separados no assistente de datas.' },
    { label: 'Férias integrais', value: result.simpleVacation, formula: 'Base ÷ 30 × ' + simpleDays + ' dias adquiridos, não gozados e não pagos, dentro do prazo concessivo.' },
    { label: 'Férias vencidas', value: result.doubleVacation, formula: 'Base ÷ 30 × ' + doubleDays + ' dias fora do prazo concessivo × 2. Não basta atraso no pagamento.' },
    { label: 'Férias proporcionais', value: result.vacation, formula: 'Base ÷ 30 × dias anuais após faltas × ' + result.vacationMonths + '/12.' },
    { label: '1/3 constitucional', value: result.third, formula: '(Férias integrais + vencidas em dobro + proporcionais) ÷ 3.' },
    { label: 'Outros créditos', value: result.credits, formula: 'Valor informado, sem reflexos automáticos nas demais verbas.' },
    { label: '13º já adiantado', value: result.advance13, formula: 'Adiantamento informado, abatido uma única vez.', deduction: true },
    { label: 'Aviso não cumprido', value: result.noticeDeduction, formula: 'No pedido de demissão: base ÷ 30 × dias não cumpridos (até 30), quando o desconto é aplicável.', deduction: true },
    { label: 'Outros descontos', value: result.otherDeductions, formula: 'Descontos informados. Confira autorização e limites legais com o RH.', deduction: true },
  ] : [];

  const fillExampleData = () => {
    setGrossSalary('3000'); setTipoDesligamento('sem_justa_causa'); setTipoAviso('indenizado');
    setYearsWorked('2'); setWorkedDaysMonth('15'); setMonths13th('6'); setMonthsVacation('6');
    setSimpleDays('30'); setDoubleDays('0'); setDateMode(false); setDates({ admission: '', last: '', start13: '', vacation: '', projectDays: '' });
    setFgtsBalance('10000'); setFgtsBase('12000'); setWithdrawal('rescisao'); setVariableAverage('0'); setOvertimeAverage('0');
    setAdvance13('0'); setCredits('0'); setDeductions('0'); setAbsences('0'); setUnworkedDays('30'); setDateError(''); setCalculated(false);
  };
  const copySummary = async () => {
    if (!result) return;
    const summary = ['Simulação de rescisão — valores antes de INSS e IRRF', ...rows.map(row => row.label + ': ' + (row.deduction ? '− ' : '') + formatBRL(row.value)),
      'Total estimado das verbas rescisórias: ' + formatBRL(result.total),
      'FGTS separado — saldo: ' + formatBRL(result.fgts.balance) + '; multa: ' + formatBRL(result.fgts.fine) + '; saque potencial: ' + formatBRL(result.fgts.available),
      'Regras revisadas em 14/10/2026. Estimativa informativa, sujeita aos documentos e bloqueios.'].join('\n');
    if (await writeClipboard(summary)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handlePrint = () => { if (result) window.print(); };

  return (
    <div className="space-y-6">
      <p className="text-xs text-neutral-600 dark:text-neutral-300" role="note">No modo manual, informe os avos incluindo a projeção do aviso. O assistente usa apenas períodos não quitados que você informar; confira pagamentos anteriores, férias parciais e acordos antes de aplicar.</p>
      <details open className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-xs space-y-3">
        <summary className="font-bold cursor-pointer">Assistente de datas e períodos não quitados</summary>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">{([['admission', 'Data de admissão'], ['last', 'Último dia do contrato sem projeção indenizada'], ['start13', 'Início do período de 13º ainda não quitado'], ['vacation', 'Início do primeiro período de férias não quitado nem gozado']] as const).map(([key, label]) => <label key={key} className="grid gap-1">{label}<input type="date" value={dates[key]} onChange={e => { setDates(current => ({ ...current, [key]: e.target.value })); setDateMode(true); setDateError(''); }} className="border rounded p-2 bg-white dark:bg-neutral-900" /></label>)}</div>
        {tipoDesligamento === 'acordo_mutuo' && tipoAviso === 'indenizado' && <label className="grid gap-1 mt-3">Dias de projeção previstos no acordo<input type="number" min="0" max="90" step="1" value={dates.projectDays} onChange={e => { setDates(current => ({ ...current, projectDays: e.target.value })); setDateMode(true); setDateError(''); }} className="border rounded p-2 bg-white dark:bg-neutral-900" /></label>}
        <p className="mt-3">Projeta o aviso indenizado na dispensa sem justa causa. No acordo mútuo, informe os dias de projeção conforme os documentos, sem presumir que o pagamento pela metade define a duração. No aviso trabalhado, informe o último dia já incluindo esse período. Conta 13º por ano e férias por aniversário; não detecta valores já pagos nem férias parcialmente gozadas.</p>
        <div className="flex flex-wrap gap-3 mt-3">
          <button type="button" className="bg-blue-600 text-white rounded px-3 py-2" onClick={() => {
            setDateMode(true);
            try {
              const period = terminationDates(dates.admission, dates.last, dates.start13, dates.vacation, tipoAviso !== 'indenizado' ? false : tipoDesligamento === 'acordo_mutuo' ? dates.projectDays.trim() === '' ? NaN : Number(dates.projectDays) : tipoDesligamento === 'sem_justa_causa');
              setSimpleDays(String(period.simple * 30)); setDoubleDays(String(period.doubled * 30)); setWorkedDaysMonth(String(period.suggestedSalaryDays)); setAppliedDates(dateSignature); setDateError('');
            } catch (cause) { setDateError((cause as Error).message); }
          }}>Aplicar datas aos cálculos</button>
          <button type="button" className="underline" onClick={() => { setDateMode(false); setDateError(''); }}>Usar avos manuais</button>
        </div>
        {dateError && <p role="alert" className="text-red-700 mt-3">{dateError}</p>}
        {projection && <p className="mt-3">Data projetada: {projection.projected}. 13º: {Object.entries(projection.byYear).map(([year, avos]) => year + ': ' + avos + '/12').join('; ')}. Férias proporcionais: {projection.avos}/12. Ao aplicar, o assistente sugere dias de saldo de salário pelo último mês, considerando mês integral como 30 dias; ajuste pagamentos já feitos conforme a folha. Para férias, sugere 30 dias por período completo: ajuste faltas e gozo parcial.</p>}
      </details>
      {/* Header Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Legislação CLT Art. 477
            </span>
            <span className="text-xs text-neutral-500 font-medium">Estimativa bruta • 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Simulação da rescisão trabalhista
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Confira as verbas por modalidade. FGTS é exibido separadamente; INSS e IRRF não são estimados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fillExampleData}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Preencher com Dados de Exemplo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Preencher Exemplo</span>
          </button>
          <button
            disabled={!result} onClick={copySummary}
            className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copiar Resumo"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button
            disabled={!result} onClick={handlePrint}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Imprimir ou Salvar PDF"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Banner de Prazo CLT */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          <strong>Prazo Legal de Pagamento (Art. 477, § 6º CLT):</strong> A empresa tem até 10 (dez) dias corridos a contar do término do contrato para realizar o pagamento integral das verbas rescisórias devidas ao trabalhador.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
        {/* Salário Bruto */}
        <div>
          <label htmlFor="rescisao-gross-salary" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Último Salário Bruto Mensal (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
            <input
              id="rescisao-gross-salary"
              aria-label="Último Salário Bruto Mensal em Reais"
              type="number" min="0" inputMode="decimal"
              step="0.01"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Quick Salary Presets */}
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-[10px] text-neutral-400 self-center">Atalhos:</span>
            {[
              { label: 'R$ 2.500', val: '2500.00' },
              { label: 'R$ 3.500', val: '3500.00' },
              { label: 'R$ 5.000', val: '5000.00' },
              { label: 'R$ 8.000', val: '8000.00' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setGrossSalary(preset.val)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  grossSalary === preset.val
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Desligamento */}
        <div>
          <label htmlFor="rescisao-tipo-desligamento" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Tipo de Desligamento / Motivo
          </label>
          <select
            id="rescisao-tipo-desligamento"
            aria-label="Tipo de Desligamento ou Motivo"
            value={tipoDesligamento}
            onChange={(e) => { setTipoDesligamento(e.target.value as TipoDesligamento); setTipoAviso(e.target.value === 'pedido_demissao' ? 'trabalhado' : 'indenizado'); }}
            className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="sem_justa_causa">Demissão sem justa causa (Pelo empregador)</option>
            <option value="pedido_demissao">Pedido de demissão (Pelo empregado)</option>
            <option value="acordo_mutuo">Acordo Consensual entre as Partes (Art. 484-A)</option>
          </select>
        </div>

        {/* Anos de Serviço (Tempo de Empresa) */}
        <div>
          <label htmlFor="rescisao-years-worked" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Anos Completos de Serviço (Tempo de Empresa)
          </label>
          <input
            id="rescisao-years-worked"
            aria-label="Anos Completos de Serviço"
            type="number" inputMode="decimal"
            min="0"
            max="100"
            disabled={Boolean(projection)} value={projection?.years ?? yearsWorked}
            onChange={(e) => { setYearsWorked(e.target.value); }}
            className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Gera {avisoDays} dias de aviso prévio proporcional (30 dias + 3d/ano completo).
          </span>
        </div>

        {/* Tipo de Aviso Prévio */}
        <div>
          <label htmlFor="rescisao-tipo-aviso" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Aviso Prévio
          </label>
          <select
            id="rescisao-tipo-aviso"
            aria-label="Tipo de Aviso Prévio"
            value={tipoAviso}
            onChange={(e) => { setTipoAviso(e.target.value as TipoAvisoPrevio); }}
            className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {tipoDesligamento !== 'pedido_demissao' && <option value="indenizado">Indenizado (pago sem trabalhar)</option>}
            <option value="trabalhado">Trabalhado (Cumprido normalmente)</option>
            {tipoDesligamento === 'pedido_demissao' && <option value="dispensado">Dispensado sem desconto (confirme com o RH)</option>}
            {tipoDesligamento === 'pedido_demissao' && <option value="nao_cumprido">Não cumprido pelo empregado (com desconto)</option>}
          </select>
        </div>

        {/* Dias trabalhados no mês do desligamento */}
        <div>
          <label htmlFor="rescisao-worked-days" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Dias de saldo de salário ainda não pagos (0 a 30)
          </label>
          <input
            id="rescisao-worked-days"
            aria-label="Dias Trabalhados no Último Mês"
            type="number" inputMode="decimal"
            min="0"
            max="30"
            value={workedDaysMonth}
            onChange={(e) => setWorkedDaysMonth(e.target.value)}
            className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Meses trabalhados para 13º */}
        <div>
          <label htmlFor="rescisao-months-13th" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Avos de 13º ainda não quitados (0 a 12 no modo manual)
          </label>
          <input
            id="rescisao-months-13th"
            aria-label="Meses para Décimo Terceiro Salário"
            type="number" inputMode="decimal"
            min="0"
            max="12"
            disabled={Boolean(projection)} value={projection ? m13Final : months13th}
            onChange={(e) => { setMonths13th(e.target.value); }}
            className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Frações iguais ou superiores a 15 dias contam como 1 mês inteiro.
          </span>
        </div>

        {/* Meses para Férias Proporcionais */}
        <div>
          <label htmlFor="rescisao-months-vacation" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Avos de férias proporcionais (0 a 12)
          </label>
          <input
            id="rescisao-months-vacation"
            aria-label="Meses do Período Aquisitivo de Férias"
            type="number" inputMode="decimal"
            min="0"
            max="12"
            disabled={Boolean(projection)} value={projection?.avos ?? monthsVacation}
            onChange={(e) => { setMonthsVacation(e.target.value); }}
            className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Saldo de FGTS para Multa */}
        <div>
          <label htmlFor="rescisao-fgts-balance" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Saldo atual deste vínculo no FGTS (R$, opcional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
            <input
              id="rescisao-fgts-balance"
              aria-label="Saldo Acumulado no Extrato do FGTS em Reais"
              type="number" min="0" inputMode="decimal"
              step="0.01"
              value={fgtsBalance}
              onChange={(e) => setFgtsBalance(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Saldo atual antes da nova multa, para simular o saque. A multa usa outra base, informada abaixo.
          </span>
        </div>

        {/* Média Mensal de Horas Extras / Comissões */}
        <div>
          <label htmlFor="rescisao-variable-avg" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
            Média de adicionais e comissões (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
            <input
              id="rescisao-variable-avg"
              aria-label="Média Mensal de Horas Extras e Comissões em Reais"
              type="number" min="0" inputMode="decimal"
              step="0.01"
              value={variableAverage}
              onChange={(e) => setVariableAverage(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: 350.00"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Média de adicionais para integração de reflexos nas verbas rescisórias.
          </span>
        </div>

        {([
          ['res-overtime', 'Média de horas extras (R$)', overtimeAverage, setOvertimeAverage, 1000000000, '0.01'],
          ['res-advance', '13º já adiantado (R$)', advance13, setAdvance13, 1000000000, '0.01'],
          ['res-credits', 'Outros créditos (R$)', credits, setCredits, 1000000000, '0.01'],
          ['res-deductions', 'Outros descontos (R$)', deductions, setDeductions, 1000000000, '0.01'],
          ['res-absences', 'Faltas injustificadas no período incompleto de férias', absences, setAbsences, 366, '1'],
          ['res-simple', 'Dias de férias integrais pendentes (simples)', simpleDays, setSimpleDays, 3600, '0.01'],
          ['res-double', 'Dias de férias vencidas pendentes (em dobro)', doubleDays, setDoubleDays, 3600, '0.01'],
        ] as const).map(([id, label, value, setter, max, step]) => <div key={id}>
          <label htmlFor={id} className="block text-xs font-bold mb-1.5">{label}</label>
          <input id={id} type="number" min="0" max={max} step={step} value={value} onChange={event => setter(event.target.value)} className="w-full px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl" />
        </div>)}
        {tipoAviso === 'nao_cumprido' && <label className="grid gap-2 text-xs font-bold">Dias de aviso não cumpridos, sujeitos a desconto<input type="number" min="0" max="30" step="1" value={unworkedDays} onChange={e => setUnworkedDays(e.target.value)} className="border rounded-xl p-3 bg-white dark:bg-neutral-900" /></label>}
        <label className="grid gap-2 text-xs font-bold">Base total do FGTS para fins rescisórios (R$, opcional)<input type="number" min="0" step="0.01" value={fgtsBase} onChange={e => setFgtsBase(e.target.value)} className="border rounded-xl p-3 bg-white dark:bg-neutral-900" /><span className="font-normal">Informe a base total atualizada, incluindo depósitos rescisórios devidos. Não é necessariamente o saldo atual; confira o FGTS Digital/RH.</span></label>
        <label className="grid gap-2 text-xs font-bold">Modalidade de saque do FGTS<select aria-label="Modalidade de saque do FGTS" value={withdrawal} onChange={e => setWithdrawal(e.target.value as typeof withdrawal)} className="border rounded-xl p-3 bg-white dark:bg-neutral-900"><option value="rescisao">Saque-rescisão</option><option value="aniversario">Saque-aniversário</option></select></label>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 md:col-span-2">Férias pendentes: informe apenas dias ainda não gozados e não pagos, ajustados por faltas. A dobra se refere ao prazo de concessão vencido, não apenas à data de pagamento. Não duplique dias entre integrais, vencidas e proporcionais. Confirme o saldo de salário com a folha, especialmente em fevereiro e meses de 31 dias.</p>
      </div>

      <button type="button" onClick={() => setCalculated(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-5 py-3">Calcular rescisão</button>
      <p className="text-xs text-neutral-600 dark:text-neutral-300">Os resultados válidos são atualizados ao editar. Regras atualizadas em: <time dateTime={LABOR_REVIEWED}>14/10/2026</time>. Dados processados apenas nesta página, sem salvar salário ou datas.</p>
      {error && <p role="alert" className="border border-red-300 bg-red-50 text-red-800 p-4 rounded-xl">{error}</p>}
      {result && <>
        {calculated && <p role="status" className="text-sm">Cálculo atualizado. Confira o detalhamento abaixo.</p>}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 space-y-2">
            <h3 className="text-sm font-bold">Total estimado das verbas rescisórias</h3>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 break-words">{formatBRL(result.total)}</p>
            <p className="text-xs text-neutral-300">Bruto: {formatBRL(result.gross)} • Abatimentos informados e aviso: {formatBRL(result.deductions)}. Antes de INSS e IRRF; FGTS separado.</p>
          </div>
          <div className="p-4 sm:p-6"><LaborBreakdown rows={rows} /><p className="text-sm mt-4">Quer conferir esse valor? Use a <a className="text-blue-600 underline" href="/calculadora-de-ferias">Calculadora de Férias</a>.</p></div>
        </div>
        {result.total < 0 && <p role="note" className="text-sm text-amber-800 dark:text-amber-300">Os abatimentos superam as verbas estimadas. Não significa dívida automática: o art. 477, § 5º limita compensações; confirme o termo com o RH.</p>}
        <section className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 space-y-3" aria-label="FGTS separado das verbas rescisórias">
          <h3 className="font-bold">FGTS — estimativa separada</h3>
          <LaborBreakdown rows={[
            { label: 'Saldo informado', value: result.fgts.balance, formula: 'Saldo atual deste vínculo, antes da nova multa. Nenhum depósito faltante é presumido.' },
            { label: 'Multa rescisória', value: result.fgts.fine, formula: 'Base total para fins rescisórios × ' + (result.fgts.rate * 100) + '%. Sem base informada, não estimamos a multa.' },
            { label: 'Saldo potencialmente sacável', value: result.fgts.availableBalance, formula: 'Saldo informado × ' + (result.fgts.withdrawalRate * 100) + '%, conforme modalidade e tipo de rescisão.' },
            { label: 'Valor potencialmente disponível para saque', value: result.fgts.available, formula: 'Saldo potencialmente sacável + nova multa, antes de bloqueios e da análise da CAIXA.' },
          ]} />
          <p className="text-xs">No saque-aniversário, esta simulação considera apenas a multa rescisória. Saques excepcionais, garantias de empréstimos e bloqueios precisam ser conferidos no aplicativo FGTS. Estes valores não integram o total pago diretamente pela empresa.</p>
        </section>
        <p className="text-sm">{tipoDesligamento === 'sem_justa_causa' ? 'Seguro-desemprego depende dos requisitos e do histórico de solicitações; esta simulação não garante elegibilidade nem parcelas.' : 'Pedido de demissão e rescisão por acordo não dão direito ao seguro-desemprego.'}</p>
      </>}

      {onSelectTab && (
        <InternalLinkCTA
          currentTab="rescisao"
          onSelectTab={onSelectTab}
        />
      )}
    </div>
  );
}

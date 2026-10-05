import { storage, copyText as writeClipboard, nonNegative, notify } from '../utils/browser';
import { MINIMUM_WAGE_2026 } from '../utils/taxCalculations';
import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Briefcase, Copy, Check, Download, Printer, Sparkles, HelpCircle } from 'lucide-react';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';

interface HourlyRateCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function HourlyRateCalculator({ onSelectTab }: HourlyRateCalculatorProps) {
  const [activeTab, setActiveTab] = useState<'clt' | 'pj' | 'compare'>('clt');

  // CLT State
  const [salary, setSalary] = useState(() => storage.getItem('calc_rate_salary') || '3000');
  const [weeklyHours, setWeeklyHours] = useState(() => storage.getItem('calc_rate_hours') || '44');
  const [customDivisor, setCustomDivisor] = useState<string>(() => storage.getItem('calc_rate_div') || '220');
  const [useCustomDivisor, setUseCustomDivisor] = useState(false);
  const [customOvertimePct, setCustomOvertimePct] = useState('60'); // Custom CCT overtime pct
  const [hasPericulosidadeRate, setHasPericulosidadeRate] = useState(false);
  const [insalubridadeGradeRate, setInsalubridadeGradeRate] = useState<'0' | '10' | '20' | '40'>('0');
  const [copied, setCopied] = useState(false);

  // Project quote estimator state
  const [estimatedProjectHours, setEstimatedProjectHours] = useState('20');

  // PJ State
  const [desiredIncome, setDesiredIncome] = useState(() => storage.getItem('calc_rate_pj_des') || '6000');
  const [monthlyExpenses, setMonthlyExpenses] = useState(() => storage.getItem('calc_rate_pj_exp') || '500');
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(() => storage.getItem('calc_rate_pj_bill') || '30');
  const [taxRate, setTaxRate] = useState(() => storage.getItem('calc_rate_pj_tax') || '6');
  const [includeBenefitsProvision, setIncludeBenefitsProvision] = useState(() => storage.getItem('calc_rate_pj_prov') !== 'false');

  // CLT vs PJ Compare State
  const [compareCltSalary, setCompareCltSalary] = useState(() => storage.getItem('calc_rate_cmp_clt') || '4000');
  const [compareCltBenefits, setCompareCltBenefits] = useState(() => storage.getItem('calc_rate_cmp_bnef') || '800'); // VR, Health, etc.
  const [comparePjTaxPct, setComparePjTaxPct] = useState(() => storage.getItem('calc_rate_cmp_tax') || '6');
  const [comparePjAccounting, setComparePjAccounting] = useState(() => storage.getItem('calc_rate_cmp_acc') || '200');

  useEffect(() => {
    storage.setItem('calc_rate_salary', salary);
    storage.setItem('calc_rate_hours', weeklyHours);
    storage.setItem('calc_rate_div', customDivisor);
    storage.setItem('calc_rate_pj_des', desiredIncome);
    storage.setItem('calc_rate_pj_exp', monthlyExpenses);
    storage.setItem('calc_rate_pj_bill', billableHoursPerWeek);
    storage.setItem('calc_rate_pj_tax', taxRate);
    storage.setItem('calc_rate_pj_prov', String(includeBenefitsProvision));
    storage.setItem('calc_rate_cmp_clt', compareCltSalary);
    storage.setItem('calc_rate_cmp_bnef', compareCltBenefits);
    storage.setItem('calc_rate_cmp_tax', comparePjTaxPct);
    storage.setItem('calc_rate_cmp_acc', comparePjAccounting);
  }, [salary, weeklyHours, customDivisor, desiredIncome, monthlyExpenses, billableHoursPerWeek, taxRate, includeBenefitsProvision, compareCltSalary, compareCltBenefits, comparePjTaxPct, comparePjAccounting]);

  // CLT Calculations
  const s = nonNegative(salary, 0);
  const minimumWage = MINIMUM_WAGE_2026;
  const insalubridadePct = parseFloat(insalubridadeGradeRate) / 100;
  const insalubridadeAddition = minimumWage * insalubridadePct;
  const periculosidadeAddition = hasPericulosidadeRate ? s * 0.30 : 0;
  const totalRemunerationBase = s + insalubridadeAddition + periculosidadeAddition;

  const w = nonNegative(weeklyHours, 0);
  const divVal = useCustomDivisor ? (nonNegative(customDivisor, 220)) : (w * 5);
  const baseRate = divVal > 0 ? totalRemunerationBase / divVal : 0;

  // Overtime rates
  const he50 = baseRate * 1.5;
  const he100 = baseRate * 2.0;
  const customOtPctVal = (nonNegative(customOvertimePct, 60)) / 100;
  const customOtRate = baseRate * (1 + customOtPctVal);
  const adNoturno = baseRate * 1.20; // +20%
  const heNoturna50 = baseRate * 1.5 * 1.20; // 50% HE + 20% Noturno = +80% total
  const sobreaviso = baseRate * (1 / 3);

  // Project Estimator
  const projHours = nonNegative(estimatedProjectHours, 0);
  const projectTotalClt = projHours * baseRate;

  // PJ Calculations
  const netDesired = nonNegative(desiredIncome, 0);
  const exp = nonNegative(monthlyExpenses, 0);
  const billableW = nonNegative(billableHoursPerWeek, 1);
  const taxPct = (nonNegative(taxRate, 0)) / 100;

  // Monthly provision for vacations (8.33%) + 1/3 vacation (2.77%) + 13th (8.33%) = ~19.4% (round to 20%)
  const provisionMultiplier = includeBenefitsProvision ? 1.20 : 1.0;
  const grossIncomeNeeded = (netDesired * provisionMultiplier + exp) / (taxPct < 1 ? 1 - taxPct : Infinity);
  const billableHoursMonth = billableW * 4.33; // Average weeks per month
  const pjHourlyRate = billableHoursMonth > 0 ? grossIncomeNeeded / billableHoursMonth : 0;
  const projectTotalPj = projHours * pjHourlyRate;

  // CLT vs PJ Compare Math
  const cmpSal = nonNegative(compareCltSalary, 0);
  const cmpBnf = nonNegative(compareCltBenefits, 0);
  const cmpFgts = cmpSal * 0.08; // 8% FGTS
  const cmp13th = cmpSal / 12; // 8.33% 13th
  const cmpVac = (cmpSal * 1.33333) / 12; // Férias + 1/3 (11.11%)
  const cmpCltTotalPackage = cmpSal + cmpFgts + cmp13th + cmpVac + cmpBnf;

  const cmpPjTax = (nonNegative(comparePjTaxPct, 6)) / 100;
  const cmpPjAcc = nonNegative(comparePjAccounting, 200);
  const cmpEquivalentPjGross = (cmpCltTotalPackage + cmpPjAcc) / (cmpPjTax < 1 ? 1 - cmpPjTax : Infinity);

  const validTax = (value: string) => value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) < 100;
  const resultValid = activeTab === 'clt' ? salary.trim() !== '' && Number.isFinite(Number(salary)) && Number(salary) >= 0 && divVal > 0 : activeTab === 'pj' ? validTax(taxRate) && billableW > 0 : validTax(comparePjTaxPct);
  const displayedAmount = (value: number) => resultValid && Number.isFinite(value) ? value.toFixed(2).replace('.', ',') : '—';

  const selectPreset = (hours: string, div: string) => {
    setWeeklyHours(hours);
    setCustomDivisor(div);
    setUseCustomDivisor(false);
  };

  const copyResults = async () => {
    if (!resultValid) { notify('Corrija os dados antes de copiar.'); return; }
    let text = '';
    if (activeTab === 'clt') {
      text = `VALOR DA HORA DE TRABALHO (CLT):
• Salário Mensal: R$ ${s.toFixed(2)}
• Carga Semanal: ${w}h/semana (Divisor CLT: ${divVal}h)
• VALOR DA HORA BASE: R$ ${baseRate.toFixed(2)}/h

ADICIONAIS E HORAS EXTRAS:
• Hora Extra 50%: R$ ${he50.toFixed(2)}/h
• Hora Extra 100%: R$ ${he100.toFixed(2)}/h
• Adicional Noturno (20%): R$ ${adNoturno.toFixed(2)}/h
• Hora Extra Noturna (80%): R$ ${heNoturna50.toFixed(2)}/h
• Hora de Sobreaviso (1/3): R$ ${sobreaviso.toFixed(2)}/h

Calculado em calculadoradehorastrabalhadas.org`;
    } else if (activeTab === 'pj') {
      text = `VALOR DA HORA FREELANCER / PJ:
• Meta Líquida Mensal: R$ ${netDesired.toFixed(2)}
• Custos Fixos Mensais: R$ ${exp.toFixed(2)}
• Horas Faturáveis por Mês: ${billableHoursMonth.toFixed(0)}h (${billableW}h/sem)
• PREÇO MÍNIMO RECOMENDADO POR HORA: R$ ${pjHourlyRate.toFixed(2)}/h

Calculado em calculadoradehorastrabalhadas.org`;
    } else {
      text = `COMPARATIVO CLT x PJ:
• Salário CLT Base: R$ ${cmpSal.toFixed(2)}
• Pacote Total CLT (Salário + FGTS + 13º + Férias + Benefícios): R$ ${cmpCltTotalPackage.toFixed(2)}/mês
• Faturamento PJ Mínimo Equivalente: R$ ${cmpEquivalentPjGross.toFixed(2)}/mês

Calculado em calculadoradehorastrabalhadas.org`;
    }

    if (!await writeClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = async () => {
    if (!resultValid) { notify('Corrija os dados antes de exportar.'); return; }
    if (activeTab === 'clt') {
      generateTimesheetCSV([
        { date: 'Hora Base Normal', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${baseRate.toFixed(2)}` },
        { date: 'Hora Extra 50%', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${he50.toFixed(2)}` },
        { date: 'Hora Extra 100%', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${he100.toFixed(2)}` },
        { date: 'Adicional Noturno (20%)', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${adNoturno.toFixed(2)}` },
        { date: 'Hora Extra Noturna (80%)', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${heNoturna50.toFixed(2)}` },
        { date: 'Hora de Sobreaviso (1/3)', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${sobreaviso.toFixed(2)}` },
      ], 'Tabela_Valor_Hora_CLT');
    } else if (activeTab === 'compare') {
      generateTimesheetCSV([{ date: 'Pacote Total CLT', start: '', end: '', totalHours: `R$ ${cmpCltTotalPackage.toFixed(2)}` }, { date: 'Faturamento PJ Mínimo Equivalente', start: '', end: '', totalHours: `R$ ${cmpEquivalentPjGross.toFixed(2)}` }], 'Comparativo_CLT_PJ');
    } else {
      generateTimesheetCSV([
        { date: 'Meta Líquida Mensal', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${netDesired.toFixed(2)}` },
        { date: 'Custos Fixos e Impostos', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${exp.toFixed(2)}` },
        { date: 'Faturamento Bruto Mensal Necessário', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${displayedAmount(grossIncomeNeeded)}` },
        { date: 'VALOR RECOMENDADO POR HORA PJ', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${pjHourlyRate.toFixed(2)}` },
      ], 'Estimativa_Valor_Hora_PJ');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {!resultValid && <p role="alert" className="text-red-700 dark:text-red-300 text-sm">Informe divisor e horas faturáveis maiores que zero e alíquota entre 0% e menos de 100%.</p>}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Calculadora de Valor da Hora de Trabalho</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            Descubra o valor exato da sua hora de trabalho CLT (com adicionais) ou calcule quanto cobrar por hora como PJ/Freelancer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button disabled={!resultValid} onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar CSV
          </button>
          <button disabled={!resultValid} onClick={copyResults} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />} Copiar Resumo
          </button>
          <button disabled={!resultValid} onClick={() => { if (resultValid) window.print(); }} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Printer className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" /> Imprimir
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row bg-neutral-100 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-700 w-full sm:w-max">
        <button
          onClick={() => setActiveTab('clt')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'clt' ? 'bg-white text-blue-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Clock className="w-4 h-4" /> Trabalhador CLT
        </button>
        <button
          onClick={() => setActiveTab('pj')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pj' ? 'bg-white text-purple-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Freelancer / PJ
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'compare' ? 'bg-white text-amber-800 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> Comparador CLT × PJ
        </button>
      </div>

      {/* TAB 1: CLT */}
      <button className="tool-button" onClick={() => { setSalary(''); setCustomDivisor(''); setWeeklyHours(''); }}>Limpar</button>
      {activeTab === 'clt' && (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
              Selecione sua Jornada Semanal Padrão (Divisor CLT):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '44h / semana', div: '220', hours: '44', desc: 'Padrão Geral (Divisor 220)' },
                { label: '40h / semana', div: '200', hours: '40', desc: 'Escritórios / TI (Divisor 200)' },
                { label: '36h / semana', div: '180', hours: '36', desc: 'Saúde / Turnos (Divisor 180)' },
                { label: '30h / semana', div: '150', hours: '30', desc: 'Bancários / Meio Turno (Divisor 150)' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(p.hours, p.div)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    weeklyHours === p.hours && !useCustomDivisor
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="font-bold text-sm block text-neutral-900 dark:text-neutral-100">{p.label}</span>
                  <span className="text-[11px] text-neutral-500 block">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-neutral-50 dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
            <div>
              <label htmlFor="hourlyrate-salary" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Salário Mensal Bruto (R$)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">R$</span>
                <input
                  id="hourlyrate-salary"
                  aria-label="Salário Mensal Bruto em Reais"
                  type="number" min="0" inputMode="decimal"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 pl-10 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 3000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hourlyrate-weekly-hours" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Carga Horária Semanal (hs)</label>
              <div className="relative">
                <input
                  id="hourlyrate-weekly-hours"
                  aria-label="Carga Horária Semanal em horas"
                  type="number" min="0" inputMode="decimal"
                  value={weeklyHours}
                  onChange={e => { setWeeklyHours(e.target.value); setUseCustomDivisor(false); }}
                  className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 pr-10 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 44"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">h / sem</span>
              </div>
            </div>

            <div>
              <label htmlFor="hourlyrate-insalubridade" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Adicional de Insalubridade</label>
              <select
                id="hourlyrate-insalubridade"
                aria-label="Adicional de Insalubridade"
                value={insalubridadeGradeRate}
                onChange={e => setInsalubridadeGradeRate(e.target.value as any)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Não possui</option>
                <option value="10">Mínimo (10% = R$ 162,10)</option>
                <option value="20">Médio (20% = R$ 324,20)</option>
                <option value="40">Máximo (40% = R$ 648,40)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Periculosidade (+30%)</label>
              <button
                type="button"
                onClick={() => setHasPericulosidadeRate(!hasPericulosidadeRate)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  hasPericulosidadeRate
                    ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-400/20'
                    : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {hasPericulosidadeRate ? '✓ Com Periculosidade (+30%)' : 'Sem Periculosidade'}
              </button>
            </div>
          </div>

          {/* Main Result Card */}
          <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-emerald-100 text-xs uppercase font-bold tracking-wider block mb-1">
                Sua Hora Base Normal Vale
              </span>
              <div className="text-4xl font-extrabold font-mono tracking-tight">
                R$ {displayedAmount(baseRate)} <span className="text-lg font-normal text-emerald-200">/ hora</span>
              </div>
              <p className="text-emerald-100 text-xs mt-1">
                Salário mensal ÷ divisor; adicionais selecionados integram a base. Calculado com divisor de {divVal} horas mensais sobre base total de R$ {totalRemunerationBase.toFixed(2).replace('.', ',')}.
              </p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Overtime & Special Rates Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Tabela de Valores de Horas Extras e Adicionais
              </h3>
              <div className="flex items-center gap-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 rounded-xl">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Porcentagem Personalizada CCT:</span>
                <input
                  type="number" min="0" inputMode="decimal"
                  value={customOvertimePct}
                  onChange={e => setCustomOvertimePct(e.target.value)}
                  className="w-12 border border-neutral-300 dark:border-neutral-600 rounded px-1.5 py-0.5 text-center font-bold text-blue-900"
                />
                <span className="font-bold text-neutral-600 dark:text-neutral-400">%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resultValid && <details open className="tool-card"><summary>Memória de cálculo</summary><p>Salário mensal ÷ divisor = valor da hora. Base remuneratória R$ {totalRemunerationBase.toFixed(2)} ÷ {divVal} = R$ {displayedAmount(baseRate)}.</p></details>}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl space-y-1 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Hora Extra 50%</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-[10px]">+50%</span>
                </div>
                <div className="text-2xl font-black font-mono text-blue-600">
                  R$ {he50.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-[11px] text-neutral-500">Dias úteis e sábados após o expediente.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl space-y-1 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Hora Extra {customOvertimePct}% (CCT)</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-[10px]">+{customOvertimePct}%</span>
                </div>
                <div className="text-2xl font-black font-mono text-blue-700">
                  R$ {customOtRate.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-[11px] text-neutral-500">Adicional específico por Convenção Coletiva.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl space-y-1 hover:border-purple-300 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Hora Extra 100%</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold text-[10px]">+100%</span>
                </div>
                <div className="text-2xl font-black font-mono text-purple-600">
                  R$ {he100.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-[11px] text-neutral-500">Domingos, feriados e folgas semanais.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl space-y-1 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Adicional Noturno (20%)</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold text-[10px]">+20%</span>
                </div>
                <div className="text-2xl font-black font-mono text-indigo-600">
                  R$ {adNoturno.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-[11px] text-neutral-500">Trabalho urbano das 22h às 05h.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl space-y-1 hover:border-rose-300 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Hora Extra Noturna (80%)</span>
                  <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px]">+80%</span>
                </div>
                <div className="text-2xl font-black font-mono text-rose-600">
                  R$ {heNoturna50.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-[11px] text-neutral-500">Hora extra realizada em período noturno.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-xl space-y-1 hover:border-amber-300 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Hora de Sobreaviso</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">33.33%</span>
                </div>
                <div className="text-2xl font-black font-mono text-amber-600">
                  R$ {sobreaviso.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-[11px] text-neutral-500">Aguardando convocação fora da empresa.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PJ / FREELANCER */}
      {activeTab === 'pj' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Meta de Renda Líquida Mensal (R$)</label>
              <input aria-label="Meta de Renda Líquida Mensal (R$)"
                type="number" min="0" inputMode="decimal"
                value={desiredIncome}
                onChange={e => setDesiredIncome(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: 6000"
              />
              <p className="text-[11px] text-neutral-500 mt-1">O valor limpo que você quer colocar no bolso todo mês.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Custos Fixos Mensais (R$)</label>
              <input aria-label="Custos Fixos Mensais (R$)"
                type="number" min="0" inputMode="decimal"
                value={monthlyExpenses}
                onChange={e => setMonthlyExpenses(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: 500"
              />
              <p className="text-[11px] text-neutral-500 mt-1">MEI, contador, internet, software, equipamentos.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Horas Faturáveis por Semana (hs)</label>
              <input aria-label="Horas Faturáveis por Semana (hs)"
                type="number" min="0" inputMode="decimal"
                value={billableHoursPerWeek}
                onChange={e => setBillableHoursPerWeek(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: 30"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Horas realmente vendidas (descontando prospecção e administrativo).</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Alíquota de Imposto MEI / Simples (%)</label>
              <input aria-label="Alíquota de Imposto MEI / Simples (%)"
                type="number" min="0" inputMode="decimal"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: 6"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Ex: Simples Nacional Anexo III ~6% ou DAS MEI.</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="provision"
                checked={includeBenefitsProvision}
                onChange={e => setIncludeBenefitsProvision(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded cursor-pointer"
              />
              <label htmlFor="provision" className="cursor-pointer font-bold text-purple-900">
                Provisionar Férias + 13º Salário e Reserva de Emergência (+20%)
              </label>
            </div>
            <span className="text-purple-700 text-[11px] font-medium hidden sm:inline">
              Recomendado para equidade com benefícios CLT
            </span>
          </div>

          {/* Result Box */}
          <div className="bg-purple-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-purple-200 text-xs uppercase font-bold tracking-wider block mb-1">
                Preço Mínimo Recomendado por Hora PJ
              </span>
              <div className="text-4xl font-extrabold font-mono tracking-tight">
                R$ {displayedAmount(pjHourlyRate)} <span className="text-lg font-normal text-purple-200">/ hora</span>
              </div>
              <p className="text-purple-200 text-xs mt-1">
                Faturamento bruto necessário: R$ {displayedAmount(grossIncomeNeeded)}/mês para atingir R$ {netDesired.toFixed(2)} líquidos.
              </p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Project Quote Estimator */}
          <div className="bg-neutral-900 text-white p-5 rounded-2xl space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-400" /> Simulador de Orçamento e Proposta Comercial
                </h3>
                <p className="text-xs text-neutral-400">Calcule o valor total a cobrar de um cliente para um projeto específico.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Estimativa de Horas do Projeto</label>
                <div className="relative">
                  <input aria-label="Estimativa de Horas do Projeto"
                    type="number" min="0" inputMode="decimal"
                    value={estimatedProjectHours}
                    onChange={e => setEstimatedProjectHours(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-sm font-mono font-bold text-white outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: 20"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">horas</span>
                </div>
              </div>

              <div className="bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                <span className="text-xs text-neutral-400 block mb-1">Valor Total Estimado do Projeto:</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  R$ {displayedAmount(projectTotalPj)}
                </span>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  disabled={!resultValid} onClick={async () => {
                    if (!resultValid) return;
                    const text = `PROPOSTA COMERCIAL DE PROJETO:
• Estimativa do Projeto: ${projHours} horas de trabalho
• Valor da Hora do Profissional: R$ ${pjHourlyRate.toFixed(2)}/h
• VALOR TOTAL DO PROJETO: R$ ${projectTotalPj.toFixed(2)}

Calculado via calculadoradehorastrabalhadas.org`;
                    if (!await writeClipboard(text)) return;
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copiar Proposta Comercial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLT vs PJ COMPARATOR */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 p-5 rounded-2xl border border-amber-200">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Salário Bruto CLT Atual/Proposto (R$)</label>
              <input aria-label="Salário Bruto CLT Atual/Proposto (R$)"
                type="number" min="0" inputMode="decimal"
                value={compareCltSalary}
                onChange={e => setCompareCltSalary(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ex: 4000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Benefícios Mensais CLT (VR, Plano, VT) (R$)</label>
              <input aria-label="Benefícios Mensais CLT (VR, Plano, VT) (R$)"
                type="number" min="0" inputMode="decimal"
                value={compareCltBenefits}
                onChange={e => setCompareCltBenefits(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ex: 800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Imposto PJ Estimado (% Simples / MEI)</label>
              <input aria-label="Imposto PJ Estimado (% Simples / MEI)"
                type="number" min="0" inputMode="decimal"
                value={comparePjTaxPct}
                onChange={e => setComparePjTaxPct(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ex: 6"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Custo de Contabilidade/MEI Mensal (R$)</label>
              <input aria-label="Custo de Contabilidade/MEI Mensal (R$)"
                type="number" min="0" inputMode="decimal"
                value={comparePjAccounting}
                onChange={e => setComparePjAccounting(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ex: 200"
              />
            </div>
          </div>

          {/* Side-by-Side Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CLT Box */}
            <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                Pacote Real CLT (Custo Total do Emprego)
              </span>
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600 dark:text-neutral-400">Salário Base Mensal</span>
                  <span className="font-bold">R$ {cmpSal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600 dark:text-neutral-400">(+) FGTS Mensal (8%)</span>
                  <span className="font-bold text-emerald-600">+ R$ {cmpFgts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600 dark:text-neutral-400">(+) Proporcional 13º Salário (1/12)</span>
                  <span className="font-bold text-emerald-600">+ R$ {cmp13th.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600 dark:text-neutral-400">(+) Proporcional Férias + 1/3 (1/12)</span>
                  <span className="font-bold text-emerald-600">+ R$ {cmpVac.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600 dark:text-neutral-400">(+) Benefícios em Dinheiro/Cartão</span>
                  <span className="font-bold text-emerald-600">+ R$ {cmpBnf.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">PACOTE GLOBAL CLT:</span>
                  <span className="font-extrabold text-blue-700 font-mono">R$ {cmpCltTotalPackage.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* PJ Box */}
            <div className="bg-amber-500 text-white p-5 rounded-2xl shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                Faturamento PJ Mínimo Equivalente
              </span>
              <div className="pt-2">
                <div className="text-3xl font-extrabold font-mono tracking-tight">
                  R$ {displayedAmount(cmpEquivalentPjGross)} <span className="text-sm text-amber-100 font-normal">/ mês</span>
                </div>
                <p className="text-xs text-amber-100 mt-2 leading-relaxed">
                  Para compensar a falta de FGTS, 13º salário, férias remuneradas, aviso prévio e benefícios da CLT, sua nota fiscal PJ deve ter este valor mínimo.
                </p>
              </div>
              <div className="bg-amber-600/60 p-3 rounded-xl text-[11px] space-y-1 text-amber-50 border border-amber-400/40">
                <div className="flex justify-between">
                  <span>Impostos ({comparePjTaxPct}%):</span>
                  <span className="font-bold font-mono">- R$ {displayedAmount(cmpEquivalentPjGross * cmpPjTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contabilidade/Despesas Fixas:</span>
                  <span className="font-bold font-mono">- R$ {cmpPjAcc.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-amber-400/40 pt-1 font-bold text-white">
                  <span>Líquido PJ após despesas:</span>
                  <span className="font-mono">R$ {cmpCltTotalPackage.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Guide */}
      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-5 rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Como é feito o cálculo oficial do Divisor de Horas CLT?
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Pela Consolidação das Leis do Trabalho (CLT), o valor da hora é obtido dividindo o salário mensal pela quantidade de horas trabalhadas no mês. A fórmula padrão adotada pela Justiça do Trabalho considera <strong>5 semanas por mês</strong> (ou seja, Carga Semanal × 5):
        </p>
        <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300 font-mono">
          <li><strong>Jornada de 44h semanais:</strong> 44 × 5 = 220 horas mensais (Divisor 220).</li>
          <li><strong>Jornada de 40h semanais:</strong> 40 × 5 = 200 horas mensais (Divisor 200).</li>
          <li><strong>Jornada de 36h semanais:</strong> 36 × 5 = 180 horas mensais (Divisor 180).</li>
        </ul>
      </div>


    </div>
  );
}


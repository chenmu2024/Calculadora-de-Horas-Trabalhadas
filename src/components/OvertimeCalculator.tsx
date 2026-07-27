import { useState, useEffect } from 'react';
import { DollarSign, Clock, Printer, Copy, Check, Download, Sparkles, Moon } from 'lucide-react';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';

interface OvertimeCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function OvertimeCalculator({ onSelectTab }: OvertimeCalculatorProps) {
  const [salary, setSalary] = useState(() => localStorage.getItem('calc_ot_salary') || '2500');
  const [weeklyHours, setWeeklyHours] = useState(() => localStorage.getItem('calc_ot_hours') || '44');
  
  // Dual-tier Overtime Hours
  const [ot50Hours, setOt50Hours] = useState(() => localStorage.getItem('calc_ot_50h') || '10');
  const [ot100Hours, setOt100Hours] = useState(() => localStorage.getItem('calc_ot_100h') || '0');
  const [customOtPct, setCustomOtPct] = useState('60');
  const [otCustomHours, setOtCustomHours] = useState('0');

  // Hazard Allowances (Súmulas 132/264 TST)
  const [hasPericulosidade, setHasPericulosidade] = useState(false);
  const [insalubridadeGrade, setInsalubridadeGrade] = useState<'0' | '10' | '20' | '40'>('0');

  // Night Shift Allowance & Reduced Night Hour
  const [includeNight, setIncludeNight] = useState(() => localStorage.getItem('calc_ot_night') === 'true');

  // DSR Reflex on Overtime
  const [includeDSR, setIncludeDSR] = useState(() => localStorage.getItem('calc_ot_dsr_inc') === 'true');
  const [workingDays, setWorkingDays] = useState(() => localStorage.getItem('calc_ot_wdays') || '25');
  const [sundaysHolidays, setSundaysHolidays] = useState(() => localStorage.getItem('calc_ot_sdays') || '5');

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('calc_ot_salary', salary);
    localStorage.setItem('calc_ot_hours', weeklyHours);
    localStorage.setItem('calc_ot_50h', ot50Hours);
    localStorage.setItem('calc_ot_100h', ot100Hours);
    localStorage.setItem('calc_ot_night', String(includeNight));
    localStorage.setItem('calc_ot_dsr_inc', String(includeDSR));
    localStorage.setItem('calc_ot_wdays', workingDays);
    localStorage.setItem('calc_ot_sdays', sundaysHolidays);
  }, [salary, weeklyHours, ot50Hours, ot100Hours, includeNight, includeDSR, workingDays, sundaysHolidays]);

  const fillExample = () => {
    setSalary('3200');
    setWeeklyHours('44');
    setOt50Hours('12');
    setOt100Hours('4');
    setOtCustomHours('0');
    setHasPericulosidade(false);
    setInsalubridadeGrade('0');
    setIncludeNight(true);
    setIncludeDSR(true);
    setWorkingDays('25');
    setSundaysHolidays('5');
  };

  const calcOvertime = () => {
    const s = parseFloat(salary) || 0;
    const w = parseFloat(weeklyHours) || 0;
    const h50 = parseFloat(ot50Hours) || 0;
    const h100 = parseFloat(ot100Hours) || 0;
    const hCust = parseFloat(otCustomHours) || 0;
    const custPctVal = (parseFloat(customOtPct) || 60) / 100;

    const minimumWage = 1518.00;
    const insalubridadeVal = minimumWage * ((parseFloat(insalubridadeGrade) || 0) / 100);
    const periculosidadeVal = hasPericulosidade ? s * 0.30 : 0;
    const totalRemunerationBase = s + insalubridadeVal + periculosidadeVal;

    const wDays = parseFloat(workingDays) || 25;
    const sDays = parseFloat(sundaysHolidays) || 5;
    
    // CLT pattern: monthly divisor is weekly hours * 5
    const divisor = w * 5;
    if (divisor === 0) return {
      hourlyRate: 0,
      totalRemunerationBase: 0,
      ot50Rate: 0, ot50Val: 0,
      ot100Rate: 0, ot100Val: 0,
      otCustRate: 0, otCustVal: 0,
      totalOTValue: 0,
      dsrAmount: 0,
      grandTotalOT: 0,
      totalSalaryWithOT: 0
    };
    
    const baseHourlyRate = totalRemunerationBase / divisor;

    // Hora Noturna Reduzida (52m30s = 1.142857x) + Adicional Noturno (+20%)
    const nightTimeFactor = includeNight ? (60 / 52.5) : 1;
    const nightAllowanceFactor = includeNight ? 1.20 : 1;
    
    const effectiveHourlyRate = baseHourlyRate * nightAllowanceFactor * nightTimeFactor;

    const ot50Rate = effectiveHourlyRate * 1.50;
    const ot50Val = ot50Rate * h50;

    const ot100Rate = effectiveHourlyRate * 2.00;
    const ot100Val = ot100Rate * h100;

    const otCustRate = effectiveHourlyRate * (1 + custPctVal);
    const otCustVal = otCustRate * hCust;

    const totalOTValue = ot50Val + ot100Val + otCustVal;

    // DSR Calculation: (Valor das Horas Extras / Dias Úteis) * Dias de Repouso
    const dsrAmount = includeDSR && wDays > 0 ? (totalOTValue / wDays) * sDays : 0;
    const grandTotalOT = totalOTValue + dsrAmount;
    
    return {
      hourlyRate: baseHourlyRate,
      totalRemunerationBase,
      effectiveHourlyRate,
      ot50Rate, ot50Val,
      ot100Rate, ot100Val,
      otCustRate, otCustVal,
      totalOTValue,
      dsrAmount,
      grandTotalOT,
      totalSalaryWithOT: s + grandTotalOT
    };
  };

  const results = calcOvertime();

  const copyResult = () => {
    const text = `Cálculo de Horas Extras e DSR:
Salário Base: R$ ${salary}
Hora Normal Base: R$ ${results.hourlyRate.toFixed(2)}
${parseFloat(ot50Hours) > 0 ? `• Horas Extras 50%: ${ot50Hours}h = R$ ${results.ot50Val.toFixed(2)}\n` : ''}${parseFloat(ot100Hours) > 0 ? `• Horas Extras 100%: ${ot100Hours}h = R$ ${results.ot100Val.toFixed(2)}\n` : ''}${parseFloat(otCustomHours) > 0 ? `• Horas Extras ${customOtPct}%: ${otCustomHours}h = R$ ${results.otCustVal.toFixed(2)}\n` : ''}Total Bruto das Horas Extras: R$ ${results.totalOTValue.toFixed(2)}
${includeDSR ? `Reflexo no DSR (Súmula 172 TST): R$ ${results.dsrAmount.toFixed(2)}\n` : ''}TOTAL A RECEBER: R$ ${results.grandTotalOT.toFixed(2)}

Calculado em calculadoradehorastrabalhadas.org`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    generateTimesheetCSV([
      { date: 'Salário Base', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${salary}` },
      { date: 'Valor da Hora Normal', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${results.hourlyRate.toFixed(2)}` },
      { date: `Horas Extras 50% (${ot50Hours}h)`, start: '-', end: '-', breakTime: '-', totalHours: `R$ ${results.ot50Val.toFixed(2)}` },
      { date: `Horas Extras 100% (${ot100Hours}h)`, start: '-', end: '-', breakTime: '-', totalHours: `R$ ${results.ot100Val.toFixed(2)}` },
      { date: `Horas Extras ${customOtPct}% (${otCustomHours}h)`, start: '-', end: '-', breakTime: '-', totalHours: `R$ ${results.otCustVal.toFixed(2)}` },
      { date: 'Reflexo no DSR', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${results.dsrAmount.toFixed(2)}` },
      { date: 'TOTAL A RECEBER (HE + DSR)', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${results.grandTotalOT.toFixed(2)}` },
    ], 'Calculo_Horas_Extras');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Calculadora de Horas Extras e DSR</h2>
          <p className="text-neutral-600 text-sm mt-1">Calcule o valor das suas horas extras com acréscimos legais (50%, 100%, CCT) e reflexo no DSR (Súmula 172 do TST).</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto no-print">
          <button
            onClick={fillExample}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Preencher Exemplo
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar CSV
          </button>
          <button
            onClick={copyResult}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />} Copiar
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" /> Imprimir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="ot-salary" className="block text-xs font-bold text-neutral-700 mb-1">Salário Mensal Bruto (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">R$</span>
            <input 
              id="ot-salary"
              aria-label="Salário Mensal Bruto em Reais"
              type="number" 
              value={salary} 
              onChange={e => setSalary(e.target.value)} 
              className="w-full border border-neutral-300 rounded-xl p-2.5 pl-9 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" 
              placeholder="Ex: 2500"
            />
          </div>
          {/* Quick Salary Presets */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="text-[10px] text-neutral-400 self-center">Atalhos:</span>
            {[
              { label: 'R$ 1.518', val: '1518' },
              { label: 'R$ 2.500', val: '2500' },
              { label: 'R$ 3.500', val: '3500' },
              { label: 'R$ 5.000', val: '5000' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setSalary(preset.val)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  salary === preset.val
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="ot-weekly-hours" className="block text-xs font-bold text-neutral-700 mb-1">Carga Horária Semanal (hs)</label>
          <div className="relative">
             <input 
               id="ot-weekly-hours"
               aria-label="Carga Horária Semanal em horas"
               type="number" 
               value={weeklyHours} 
               onChange={e => setWeeklyHours(e.target.value)} 
               className="w-full border border-neutral-300 rounded-xl p-2.5 pr-8 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" 
               placeholder="Ex: 44"
             />
             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">h</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="text-[10px] text-neutral-400 self-center">Padrão:</span>
            {[
              { label: '44h (220h/mês)', val: '44' },
              { label: '40h (200h/mês)', val: '40' },
              { label: '36h (180h/mês)', val: '36' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setWeeklyHours(preset.val)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  weeklyHours === preset.val
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="ot-insalubridade" className="block text-xs font-bold text-neutral-700 mb-1">Insalubridade na Base (TST)</label>
          <select
            id="ot-insalubridade"
            aria-label="Insalubridade na base de cálculo"
            value={insalubridadeGrade}
            onChange={e => setInsalubridadeGrade(e.target.value as any)}
            className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Não possui</option>
            <option value="10">Mínimo (10% = R$ 151,80)</option>
            <option value="20">Médio (20% = R$ 303,60)</option>
            <option value="40">Máximo (40% = R$ 607,20)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">Periculosidade na Base (TST)</label>
          <button
            type="button"
            onClick={() => setHasPericulosidade(!hasPericulosidade)}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              hasPericulosidade
                ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-400/20'
                : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400'
            }`}
          >
            {hasPericulosidade ? '✓ Com Periculosidade (+30%)' : 'Sem Periculosidade'}
          </button>
        </div>
      </div>

      {/* Multi-tier Horas Extras Inputs */}
      <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 mb-6 space-y-4">
        <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-600" /> Lançamento de Horas Extras por Adicional (Simultâneo)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="ot-50-hours" className="text-xs font-bold text-neutral-800">HE 50% (Dias Úteis)</label>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">+50%</span>
            </div>
            <div className="relative">
              <input
                id="ot-50-hours"
                aria-label="Horas Extras 50%"
                type="number"
                value={ot50Hours}
                onChange={e => setOt50Hours(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg p-2 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">hs</span>
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Valor unitário: <strong>R$ {results.ot50Rate.toFixed(2)}/h</strong>
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="ot-100-hours" className="text-xs font-bold text-neutral-800">HE 100% (Dom / Feriados)</label>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">+100%</span>
            </div>
            <div className="relative">
              <input
                id="ot-100-hours"
                aria-label="Horas Extras 100%"
                type="number"
                value={ot100Hours}
                onChange={e => setOt100Hours(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg p-2 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">hs</span>
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Valor unitário: <strong>R$ {results.ot100Rate.toFixed(2)}/h</strong>
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-1">
                <label htmlFor="ot-custom-hours" className="text-xs font-bold text-neutral-800">HE Acordo/CCT</label>
                <input
                  id="ot-custom-pct"
                  aria-label="Percentual customizado de hora extra"
                  type="number"
                  value={customOtPct}
                  onChange={e => setCustomOtPct(e.target.value)}
                  className="w-10 border border-neutral-300 rounded px-1 py-0.5 text-center text-xs font-bold"
                />
                <span className="text-xs font-bold text-neutral-600">%</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">+{customOtPct}%</span>
            </div>
            <div className="relative">
              <input
                id="ot-custom-hours"
                aria-label="Horas Extras CCT"
                type="number"
                value={otCustomHours}
                onChange={e => setOtCustomHours(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg p-2 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">hs</span>
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Valor unitário: <strong>R$ {results.otCustRate.toFixed(2)}/h</strong>
            </span>
          </div>
        </div>
      </div>

      {/* DSR & Night shift options */}
      <div className="space-y-3 mb-6">
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="incDSR"
              aria-label="Incluir reflexo no DSR"
              checked={includeDSR}
              onChange={(e) => setIncludeDSR(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="incDSR" className="cursor-pointer font-bold text-neutral-800">
              Incluir Reflexo no DSR (Descanso Semanal Remunerado — Súmula 172 TST)
            </label>
          </div>

          {includeDSR && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Dias Úteis no Mês:</span>
              <input
                id="ot-working-days"
                aria-label="Dias Úteis no Mês para DSR"
                type="number"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                className="w-14 bg-white border border-neutral-300 rounded p-1 text-center font-bold"
              />
              <span className="text-neutral-500">Dom/Feriados:</span>
              <input
                id="ot-sundays-holidays"
                aria-label="Domingos e Feriados no Mês para DSR"
                type="number"
                value={sundaysHolidays}
                onChange={(e) => setSundaysHolidays(e.target.value)}
                className="w-14 bg-white border border-neutral-300 rounded p-1 text-center font-bold"
              />
            </div>
          )}
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="incNight"
              checked={includeNight}
              onChange={(e) => setIncludeNight(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
            <label htmlFor="incNight" className="cursor-pointer font-bold text-indigo-950 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-600" />
              Hora Extra Noturna (+20% Adicional Noturno e Hora Reduzida de 52m30s)
            </label>
          </div>
          <span className="text-[11px] text-indigo-700 font-medium">
            Art. 73 CLT (Fator Noturno 1,1428x + 20%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
         <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <p className="text-xs text-neutral-500 mb-1 font-medium">Hora Normal Base</p>
            <p className="text-xl font-bold font-mono text-neutral-700">R$ {results.hourlyRate.toFixed(2).replace('.', ',')}</p>
         </div>
         <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <p className="text-xs text-neutral-500 mb-1 font-medium">Total Bruto HE (50%/100%)</p>
            <p className="text-xl font-bold font-mono text-neutral-700">R$ {results.totalOTValue.toFixed(2).replace('.', ',')}</p>
         </div>
         <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <p className="text-xs text-neutral-500 mb-1 font-medium">Reflexo no DSR</p>
            <p className="text-xl font-bold font-mono text-emerald-600">R$ {results.dsrAmount.toFixed(2).replace('.', ',')}</p>
         </div>
         <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <p className="text-xs text-neutral-500 mb-1 font-medium">Salário Bruto + Extras</p>
            <p className="text-xl font-bold font-mono text-blue-700">R$ {results.totalSalaryWithOT.toFixed(2).replace('.', ',')}</p>
         </div>
      </div>

      <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">Total a Receber pelas Horas Extras + DSR no Mês</p>
          <div className="text-4xl font-extrabold font-mono tracking-tight">
            R$ {results.grandTotalOT.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-blue-100 mt-1">
            Salário Bruto Total Com Extras: R$ {results.totalSalaryWithOT.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="overtime" onSelectTab={onSelectTab} />}
    </div>
  );
}


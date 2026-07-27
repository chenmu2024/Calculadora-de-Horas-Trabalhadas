import React, { useState, useEffect } from 'react';
import { Moon, Clock, Copy, Check, Download, Printer, HelpCircle, ShieldAlert, Sparkles, Calculator } from 'lucide-react';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';

type WorkerSector = 'urban' | 'rural_agriculture' | 'rural_livestock' | 'custom';

interface NightHoursCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function NightHoursCalculator({ onSelectTab }: NightHoursCalculatorProps) {
  const [salary, setSalary] = useState(() => localStorage.getItem('calc_night_salary') || '3000');
  const [weeklyHours, setWeeklyHours] = useState(() => localStorage.getItem('calc_night_hours') || '44');
  const [sector, setSector] = useState<WorkerSector>(() => (localStorage.getItem('calc_night_sector') as WorkerSector) || 'urban');
  const [customRate, setCustomRate] = useState(() => localStorage.getItem('calc_night_custom') || '20');
  const [nightClockHours, setNightClockHours] = useState(() => localStorage.getItem('calc_night_clock') || '40');

  // Additional Hazard Allowances in Base Rate (OJ 259 SDI-1 TST)
  const [hasPericulosidade, setHasPericulosidade] = useState(false);
  const [insalubridadeGrade, setInsalubridadeGrade] = useState<'0' | '10' | '20' | '40'>('0');

  // Overtime Night Shift Combination
  const [nightOvertimeHours, setNightOvertimeHours] = useState('0');
  const [overtimePct, setOvertimePct] = useState('50');
  
  // Prorrogação Súmula 60 TST
  const [includeExtension, setIncludeExtension] = useState(() => localStorage.getItem('calc_night_ext') === 'true');
  const [extensionHours, setExtensionHours] = useState(() => localStorage.getItem('calc_night_ext_h') || '10');

  // DSR (Descanso Semanal Remunerado)
  const [includeDSR, setIncludeDSR] = useState(() => localStorage.getItem('calc_night_dsr') !== 'false');
  const [workingDaysMonth, setWorkingDaysMonth] = useState(() => localStorage.getItem('calc_night_wdays') || '25');
  const [sundaysHolidaysMonth, setSundaysHolidaysMonth] = useState(() => localStorage.getItem('calc_night_sdays') || '5');

  // Shift Helper Input
  const [startTime, setStartTime] = useState('22:00');
  const [endTime, setEndTime] = useState('06:00');
  const [shiftDays, setShiftDays] = useState('5');
  const [showShiftHelper, setShowShiftHelper] = useState(false);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('calc_night_salary', salary);
    localStorage.setItem('calc_night_hours', weeklyHours);
    localStorage.setItem('calc_night_sector', sector);
    localStorage.setItem('calc_night_custom', customRate);
    localStorage.setItem('calc_night_clock', nightClockHours);
    localStorage.setItem('calc_night_ext', String(includeExtension));
    localStorage.setItem('calc_night_ext_h', extensionHours);
    localStorage.setItem('calc_night_dsr', String(includeDSR));
    localStorage.setItem('calc_night_wdays', workingDaysMonth);
    localStorage.setItem('calc_night_sdays', sundaysHolidaysMonth);
  }, [salary, weeklyHours, sector, customRate, nightClockHours, includeExtension, extensionHours, includeDSR, workingDaysMonth, sundaysHolidaysMonth]);

  // Auto-calculate night hours from Shift Assistant
  const applyShiftAssistant = () => {
    const [startH] = startTime.split(':').map(Number);
    const [endH] = endTime.split(':').map(Number);
    const days = parseFloat(shiftDays) || 1;

    // Standard Urban Night: 22:00 to 05:00 (7 hours per shift)
    let nightH = 0;
    let extH = 0;

    if (startH === 22 && endH === 6) {
      nightH = 7 * days; // 22h to 05h = 7 clock hours
      extH = 1 * days;  // 05h to 06h = 1 hour extension
    } else if (startH === 22 && endH === 5) {
      nightH = 7 * days;
      extH = 0;
    } else {
      // General estimate
      nightH = 7 * days;
      extH = 0;
    }

    setNightClockHours(String(nightH));
    if (extH > 0) {
      setIncludeExtension(true);
      setExtensionHours(String(extH));
    }
  };

  // Sector Rules Setup
  const getSectorRules = () => {
    switch (sector) {
      case 'urban':
        return {
          name: 'Trabalhador Urbano (CLT Art. 73)',
          rate: 0.20,
          period: '22:00 às 05:00',
          fictaFactor: 60 / 52.5, // 1.142857 (52m30s)
          hasFicta: true,
        };
      case 'rural_agriculture':
        return {
          name: 'Trabalhador Rural (Lavoura - Lei 5.889/73)',
          rate: 0.25,
          period: '21:00 às 05:00',
          fictaFactor: 1.0, // 60m
          hasFicta: false,
        };
      case 'rural_livestock':
        return {
          name: 'Trabalhador Rural (Pecuária - Lei 5.889/73)',
          rate: 0.25,
          period: '20:00 às 04:00',
          fictaFactor: 1.0, // 60m
          hasFicta: false,
        };
      case 'custom':
        return {
          name: 'Convenção Coletiva / Acordo Específico',
          rate: (parseFloat(customRate) || 20) / 100,
          period: 'Personalizado',
          fictaFactor: 60 / 52.5,
          hasFicta: true,
        };
    }
  };

  const rules = getSectorRules();

  // Base Hourly Rate (including Insalubridade & Periculosidade per OJ 259 SDI-1 TST)
  const s = parseFloat(salary) || 0;
  const minimumWage = 1518.00;
  const insalubridadeAddition = minimumWage * ((parseFloat(insalubridadeGrade) || 0) / 100);
  const periculosidadeAddition = hasPericulosidade ? s * 0.30 : 0;
  const totalRemunerationBase = s + insalubridadeAddition + periculosidadeAddition;

  const w = parseFloat(weeklyHours) || 44;
  const divisor = w * 5; // CLT standard divisor
  const baseHourlyRate = divisor > 0 ? totalRemunerationBase / divisor : 0;

  const clockHoursVal = parseFloat(nightClockHours) || 0;
  const extHoursVal = includeExtension ? (parseFloat(extensionHours) || 0) : 0;
  const totalClockHours = clockHoursVal + extHoursVal;

  // Fictional hours conversion
  const fictaHours = totalClockHours * rules.fictaFactor;

  // Standard Night Bonus value
  const nightBonusRate = baseHourlyRate * rules.rate;
  const nightBonusTotal = nightBonusRate * fictaHours;

  // Overtime Night Shift Combination: (Base Rate + Night Bonus) * Overtime Multiplier
  const nightOtHoursVal = parseFloat(nightOvertimeHours) || 0;
  const otMult = (parseFloat(overtimePct) || 50) / 100;
  const nightOtFictaHours = nightOtHoursVal * rules.fictaFactor;
  // HE Noturna Rate = BaseRate * (1 + rules.rate) * (1 + otMult) or BaseRate * (1 + rules.rate + otMult)
  // Legal standard (Súmula 264 TST): Hora Extra Noturna = (Hora Normal + Adicional Noturno) * Adicional de Hora Extra
  const nightOtHourlyRate = (baseHourlyRate * (1 + rules.rate)) * (1 + otMult);
  const nightOtTotal = nightOtHourlyRate * nightOtFictaHours;

  const totalNightIncomeWithoutDSR = nightBonusTotal + nightOtTotal;

  // DSR calculation: (Total Night Income / Working Days) * Sundays & Holidays
  const workDays = parseFloat(workingDaysMonth) || 25;
  const restDays = parseFloat(sundaysHolidaysMonth) || 5;
  const dsrValue = (includeDSR && workDays > 0) ? (totalNightIncomeWithoutDSR / workDays) * restDays : 0;

  const grandTotal = totalNightIncomeWithoutDSR + dsrValue;

  const copySummary = () => {
    const text = `CÁLCULO DE ADICIONAL NOTURNO:
• Categoria: ${rules.name}
• Salário Base: R$ ${s.toFixed(2)} (Remuneração Base com adicionais: R$ ${totalRemunerationBase.toFixed(2)})
• Valor da Hora Normal Base: R$ ${baseHourlyRate.toFixed(2)}/h
• Horas de Relógio Noturnas: ${clockHoursVal}h
${includeExtension ? `• Prorrogação Noturna (Súmula 60 TST): ${extHoursVal}h\n` : ''}${rules.hasFicta ? `• Horas Fictas Reduzidas (52m30s): ${fictaHours.toFixed(2)}h\n` : ''}• Adicional Noturno (${(rules.rate * 100).toFixed(0)}%): R$ ${nightBonusTotal.toFixed(2)}
${nightOtHoursVal > 0 ? `• Horas Extras Noturnas (+${overtimePct}%): R$ ${nightOtTotal.toFixed(2)}\n` : ''}${includeDSR ? `• Reflexo no DSR (${restDays}d/s/f): R$ ${dsrValue.toFixed(2)}\n` : ''}
TOTAL A RECEBER: R$ ${grandTotal.toFixed(2)}

Calculado em calculadoradehorastrabalhadas.org`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    generateTimesheetCSV([
      { date: 'Salário Base Contratual', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${s.toFixed(2)}` },
      { date: 'Base Calculada (Insal./Peric.)', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${totalRemunerationBase.toFixed(2)}` },
      { date: 'Valor da Hora Normal Base', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${baseHourlyRate.toFixed(2)}` },
      { date: 'Horas Noturnas Relógio', start: '-', end: '-', breakTime: '-', totalHours: `${clockHoursVal}h` },
      ...(includeExtension ? [{ date: 'Prorrogação Noturna (Súmula 60)', start: '-', end: '-', breakTime: '-', totalHours: `${extHoursVal}h` }] : []),
      ...(rules.hasFicta ? [{ date: 'Horas Fictas Equivalentes', start: '-', end: '-', breakTime: '-', totalHours: `${fictaHours.toFixed(2)}h` }] : []),
      { date: `Adicional Noturno (${(rules.rate * 100).toFixed(0)}%)`, start: '-', end: '-', breakTime: '-', totalHours: `R$ ${nightBonusTotal.toFixed(2)}` },
      ...(nightOtHoursVal > 0 ? [{ date: `Horas Extras Noturnas (+${overtimePct}%)`, start: '-', end: '-', breakTime: '-', totalHours: `R$ ${nightOtTotal.toFixed(2)}` }] : []),
      ...(includeDSR ? [{ date: 'Reflexo no DSR (Descanso Semanal)', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${dsrValue.toFixed(2)}` }] : []),
      { date: 'TOTAL ADICIONAL + DSR', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${grandTotal.toFixed(2)}` },
    ], 'Calculo_Adicional_Noturno');
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Calculadora de Adicional Noturno</h2>
          <p className="text-neutral-600 text-sm mt-1">
            Calcule o adicional noturno com hora ficta reduzida (52min 30seg), prorrogação de jornada (Súmula 60 TST) e reflexo no DSR.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar CSV
          </button>
          <button onClick={copySummary} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />} Copiar Resumo
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Printer className="w-3.5 h-3.5 text-neutral-600" /> Imprimir
          </button>
        </div>
      </div>

      {/* Sector Selection */}
      <div>
        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
          Selecione o Tipo de Trabalhador / Atividade:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'urban', name: 'Urbano (CLT)', rate: '20%', time: '22h às 05h', ficta: 'Hora Ficta (52m30s)' },
            { id: 'rural_agriculture', name: 'Rural (Lavoura)', rate: '25%', time: '21h às 05h', ficta: 'Hora de 60 min' },
            { id: 'rural_livestock', name: 'Rural (Pecuária)', rate: '25%', time: '20h às 04h', ficta: 'Hora de 60 min' },
            { id: 'custom', name: 'Convenção CCT', rate: 'Acordo', time: 'Personalizado', ficta: 'Configurável' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSector(sec.id as WorkerSector)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                sector === sec.id
                  ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-neutral-900">{sec.name}</span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{sec.rate}</span>
              </div>
              <span className="text-[11px] text-neutral-500 block">{sec.time}</span>
              <span className="text-[10px] text-indigo-600 font-semibold block mt-1">{sec.ficta}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Inputs & Additional Hazard Allowances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Salário Mensal Bruto (R$)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">R$</span>
            <input
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 pl-10 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: 3000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Jornada Semanal (hs)</label>
          <div className="relative">
            <input
              type="number"
              value={weeklyHours}
              onChange={e => setWeeklyHours(e.target.value)}
              className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 pr-10 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: 44"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">h / sem</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Insalubridade na Base (TST)</label>
          <select
            value={insalubridadeGrade}
            onChange={e => setInsalubridadeGrade(e.target.value as any)}
            className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">Não possui</option>
            <option value="10">Mínimo (10% = R$ 151,80)</option>
            <option value="20">Médio (20% = R$ 303,60)</option>
            <option value="40">Máximo (40% = R$ 607,20)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Periculosidade na Base (TST)</label>
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

      {/* Night Hours & Shift Assistant */}
      <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" /> Horas Noturnas Trabalhadas no Mês
            </h3>
            <p className="text-xs text-neutral-500">Informe a quantidade total de horas de relógio ou use o assistente de turno.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowShiftHelper(!showShiftHelper)}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" /> {showShiftHelper ? 'Ocultar Assistente' : 'Assistente de Turno (Entrada/Saída)'}
          </button>
        </div>

        {showShiftHelper && (
          <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-bold text-indigo-900 mb-1">Horário Entrada</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-white border border-indigo-300 rounded-lg p-2 text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-indigo-900 mb-1">Horário Saída</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-white border border-indigo-300 rounded-lg p-2 text-xs font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-indigo-900 mb-1">Dias no Mês</label>
              <input
                type="number"
                value={shiftDays}
                onChange={e => setShiftDays(e.target.value)}
                className="w-full bg-white border border-indigo-300 rounded-lg p-2 text-xs font-bold text-center"
                placeholder="Ex: 22"
              />
            </div>
            <button
              type="button"
              onClick={applyShiftAssistant}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Calcular e Preencher
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Horas Noturnas Normais no Mês (Relógio)</label>
            <div className="relative">
              <input
                type="number"
                value={nightClockHours}
                onChange={e => setNightClockHours(e.target.value)}
                className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 pr-10 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 40"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">h</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Horas Extras Noturnas (HE + Noturno)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={nightOvertimeHours}
                  onChange={e => setNightOvertimeHours(e.target.value)}
                  className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 pr-10 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: 0"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">h</span>
              </div>
              <div className="w-28">
                <select
                  value={overtimePct}
                  onChange={e => setOvertimePct(e.target.value)}
                  className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="50">+50% HE</option>
                  <option value="100">+100% HE</option>
                  <option value="60">+60% HE</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sector === 'custom' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-4 text-xs">
          <label className="font-bold text-amber-900 whitespace-nowrap">Porcentagem do Adicional Noturno CCT (%):</label>
          <input
            type="number"
            value={customRate}
            onChange={e => setCustomRate(e.target.value)}
            className="w-24 border border-amber-300 bg-white rounded-lg p-2 text-sm font-bold text-center outline-none"
            placeholder="20"
          />
        </div>
      )}

      {/* Advanced Rules: Súmula 60 & DSR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Súmula 60 TST Extension */}
        <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sumula60"
              checked={includeExtension}
              onChange={e => setIncludeExtension(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
            <label htmlFor="sumula60" className="cursor-pointer font-bold text-xs text-neutral-800">
              Prorrogação de Jornada (Súmula 60 do TST)
            </label>
          </div>
          <p className="text-[11px] text-neutral-500">
            Se a jornada iniciou no horário noturno e continuou após as 05:00 da manhã, as horas diurnas prorrogadas também mantêm o adicional noturno.
          </p>

          {includeExtension && (
            <div className="pt-2 border-t border-neutral-100">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Horas Prorrogadas no Mês (após 05h)</label>
              <input
                type="number"
                value={extensionHours}
                onChange={e => setExtensionHours(e.target.value)}
                className="w-full border border-neutral-300 bg-neutral-50 rounded-lg p-2 text-xs font-mono font-bold outline-none"
                placeholder="Ex: 10"
              />
            </div>
          )}
        </div>

        {/* DSR Reflection */}
        <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dsrCheck"
              checked={includeDSR}
              onChange={e => setIncludeDSR(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
            <label htmlFor="dsrCheck" className="cursor-pointer font-bold text-xs text-neutral-800">
              Calcular Reflexo no DSR (Descanso Semanal Remunerado)
            </label>
          </div>
          <p className="text-[11px] text-neutral-500">
            O adicional noturno integra a remuneração para cálculo do DSR mensal.
          </p>

          {includeDSR && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Dias Úteis Mês</label>
                <input
                  type="number"
                  value={workingDaysMonth}
                  onChange={e => setWorkingDaysMonth(e.target.value)}
                  className="w-full border border-neutral-300 bg-neutral-50 rounded-lg p-2 text-xs font-mono font-bold outline-none"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Dom / Feriados</label>
                <input
                  type="number"
                  value={sundaysHolidaysMonth}
                  onChange={e => setSundaysHolidaysMonth(e.target.value)}
                  className="w-full border border-neutral-300 bg-neutral-50 rounded-lg p-2 text-xs font-mono font-bold outline-none"
                  placeholder="5"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
            {rules.hasFicta ? 'Horas Fictas Noturnas' : 'Horas Totais Noturnas'}
          </span>
          <span className="text-2xl font-bold font-mono text-neutral-800">
            {fictaHours.toFixed(2)} h
          </span>
          {rules.hasFicta && (
            <span className="text-[10px] text-neutral-400 block mt-1">Fator +14,28% (52m 30s)</span>
          )}
        </div>

        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
            Adicional Noturno
          </span>
          <span className="text-2xl font-bold font-mono text-indigo-600">
            R$ {nightBonusTotal.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-1">
            R$ {nightBonusRate.toFixed(2)} /h ({ (rules.rate * 100).toFixed(0) }%)
          </span>
        </div>

        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
            Horas Extras Noturnas
          </span>
          <span className="text-2xl font-bold font-mono text-purple-600">
            R$ {nightOtTotal.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-1">
            {nightOtHoursVal}h a +{overtimePct}% + Noturno
          </span>
        </div>

        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
            Reflexo no DSR
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600">
            R$ {dsrValue.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-1">({restDays} dias de descanso)</span>
        </div>
      </div>

      {/* Main Final Total Card */}
      <div className="bg-indigo-900 rounded-2xl p-6 border border-indigo-800 flex flex-col sm:flex-row items-center justify-between text-white shadow-md gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
            Total Final a Receber (Adicional + DSR)
          </span>
          <div className="text-4xl font-extrabold font-mono tracking-tight text-white">
            R$ {grandTotal.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-indigo-200 mt-1">
            Valor bruto acumulado a ser somado no seu holerite do mês.
          </p>
        </div>
        <div className="w-16 h-16 bg-indigo-800 rounded-2xl flex items-center justify-center shrink-0">
          <Moon className="w-8 h-8 text-indigo-200" />
        </div>
      </div>

      {/* Educational Legal Box */}
      <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          Como funciona a Hora Ficta e a Súmula 60 do TST?
        </h4>
        <p className="text-neutral-600 leading-relaxed">
          Na CLT urbana (Art. 73), a hora trabalhada no período noturno (22:00 às 05:00) dura <strong>52 minutos e 30 segundos</strong> (e não 60 minutos). Isso significa que 7 horas de relógio equivalem a <strong>8 horas noturnas remuneradas</strong> (fator de 1,142857).
        </p>
        <p className="text-neutral-600 leading-relaxed">
          <strong>Súmula 60, II do TST:</strong> Quando o empregado cumpre integralmente a jornada no período noturno e prorroga o trabalho após as 05:00 da manhã, o adicional noturno também é devido sobre essas horas diurnas de prorrogação.
        </p>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="night" onSelectTab={onSelectTab} />}
    </div>
  );
}


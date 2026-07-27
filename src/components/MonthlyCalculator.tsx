import { useState, useEffect } from 'react';
import { Calendar, Calculator, Download, Copy, Check, Printer, Clock, AlertCircle, Sparkles, Moon, ArrowRight } from 'lucide-react';
import { minutesToTime } from '../utils/time';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';

interface MonthlyCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function MonthlyCalculator({ onSelectTab }: MonthlyCalculatorProps) {
  const [calculationType, setCalculationType] = useState<'hourly' | 'monthly'>(() => (localStorage.getItem('calc_monthly_type') as any) || 'monthly');
  const [monthlySalary, setMonthlySalary] = useState(() => localStorage.getItem('calc_monthly_sal') || '3300.00');
  const [divisorCLT, setDivisorCLT] = useState(() => localStorage.getItem('calc_monthly_div') || '220');
  const [hourlyWageInput, setHourlyWageInput] = useState(() => localStorage.getItem('calc_monthly_hwage') || '15.00');

  const [workingDays, setWorkingDays] = useState(() => localStorage.getItem('calc_monthly_wdays') || '22');
  const [sundaysAndHolidays, setSundaysAndHolidays] = useState(() => localStorage.getItem('calc_monthly_sdays') || '8');
  const [dailyHours, setDailyHours] = useState(() => localStorage.getItem('calc_monthly_dhours') || '8');
  const [dailyMinutes, setDailyMinutes] = useState(() => localStorage.getItem('calc_monthly_dmins') || '48');

  const [overtime50Hours, setOvertime50Hours] = useState(() => localStorage.getItem('calc_monthly_ot50') || '10');
  const [overtime100Hours, setOvertime100Hours] = useState(() => localStorage.getItem('calc_monthly_ot100') || '2');
  const [nightShiftHours, setNightShiftHours] = useState(() => localStorage.getItem('calc_monthly_night') || '0');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('calc_monthly_type', calculationType);
    localStorage.setItem('calc_monthly_sal', monthlySalary);
    localStorage.setItem('calc_monthly_div', divisorCLT);
    localStorage.setItem('calc_monthly_hwage', hourlyWageInput);
    localStorage.setItem('calc_monthly_wdays', workingDays);
    localStorage.setItem('calc_monthly_sdays', sundaysAndHolidays);
    localStorage.setItem('calc_monthly_dhours', dailyHours);
    localStorage.setItem('calc_monthly_dmins', dailyMinutes);
    localStorage.setItem('calc_monthly_ot50', overtime50Hours);
    localStorage.setItem('calc_monthly_ot100', overtime100Hours);
    localStorage.setItem('calc_monthly_night', nightShiftHours);
  }, [calculationType, monthlySalary, divisorCLT, hourlyWageInput, workingDays, sundaysAndHolidays, dailyHours, dailyMinutes, overtime50Hours, overtime100Hours, nightShiftHours]);

  // Derive hourly wage
  const calculatedHourlyWage = calculationType === 'monthly'
    ? (parseFloat(monthlySalary) || 0) / (parseFloat(divisorCLT) || 220)
    : parseFloat(hourlyWageInput) || 0;

  const days = parseFloat(workingDays) || 0;
  const dsrDays = parseFloat(sundaysAndHolidays) || 0;
  const h = parseFloat(dailyHours) || 0;
  const m = parseFloat(dailyMinutes) || 0;
  const ot50 = parseFloat(overtime50Hours) || 0;
  const ot100 = parseFloat(overtime100Hours) || 0;
  const nightHours = parseFloat(nightShiftHours) || 0;

  // Monthly worked hours calculation
  const totalMinutesPerDay = (h * 60) + m;
  const totalMonthlyMinutes = totalMinutesPerDay * days;
  const totalMonthlyHoursFormatted = minutesToTime(totalMonthlyMinutes);

  // Base salary calculated or from monthly
  const baseSalary = calculationType === 'monthly'
    ? (parseFloat(monthlySalary) || 0)
    : (totalMonthlyMinutes / 60) * calculatedHourlyWage;

  // Overtime pay (50% and 100%)
  const overtime50Pay = ot50 * calculatedHourlyWage * 1.5;
  const overtime100Pay = ot100 * calculatedHourlyWage * 2.0;
  
  // Night shift bonus (20% + reduced hour factor 60/52.5 = 1.142857)
  const nightShiftPay = nightHours * calculatedHourlyWage * 1.142857 * 0.20;

  const totalOvertimeAndNightPay = overtime50Pay + overtime100Pay + nightShiftPay;

  // DSR Reflex calculation: (Total Overtime & Night pay / Working days) * DSR days
  const dsrReflex = days > 0 ? (totalOvertimeAndNightPay / days) * dsrDays : 0;

  const totalGrossPay = baseSalary + totalOvertimeAndNightPay + dsrReflex;

  // Quick preset handlers for days
  const setDaysPreset = (wd: string, sd: string) => {
    setWorkingDays(wd);
    setSundaysAndHolidays(sd);
  };

  const copySummary = () => {
    const text = `DEMONSTRATIVO MENSAL DE HORAS E VALORES (CLT):
• Dias Úteis Trabalhados: ${days} dias
• Domingos/Feriados (DSR): ${dsrDays} dias
• Horas Trabalhadas no Mês: ${totalMonthlyHoursFormatted} h
• Valor da Hora Base: R$ ${calculatedHourlyWage.toFixed(2).replace('.', ',')}
• Salário Base: R$ ${baseSalary.toFixed(2).replace('.', ',')}
• Horas Extras 50% (${ot50}h): R$ ${overtime50Pay.toFixed(2).replace('.', ',')}
• Horas Extras 100% (${ot100}h): R$ ${overtime100Pay.toFixed(2).replace('.', ',')}
• Adicional Noturno (${nightHours}h): R$ ${nightShiftPay.toFixed(2).replace('.', ',')}
• Reflexo DSR s/ Extras e Noturno: R$ ${dsrReflex.toFixed(2).replace('.', ',')}
• TOTAL BRUTO ESTIMADO: R$ ${totalGrossPay.toFixed(2).replace('.', ',')}

Calculado em calculadoradehorastrabalhadas.org`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    generateTimesheetCSV([
      { date: 'Dias Úteis Trabalhados', start: `${days} dias`, end: '-', breakTime: '-', totalHours: totalMonthlyHoursFormatted },
      { date: 'Salário Base', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${baseSalary.toFixed(2)}` },
      { date: 'Horas Extras 50%', start: `${ot50}h`, end: '1.5x', breakTime: '-', totalHours: `R$ ${overtime50Pay.toFixed(2)}` },
      { date: 'Horas Extras 100%', start: `${ot100}h`, end: '2.0x', breakTime: '-', totalHours: `R$ ${overtime100Pay.toFixed(2)}` },
      { date: 'Adicional Noturno (20%)', start: `${nightHours}h`, end: 'Hora Ficta', breakTime: '-', totalHours: `R$ ${nightShiftPay.toFixed(2)}` },
      { date: 'Reflexo DSR', start: `${dsrDays} dias`, end: '-', breakTime: '-', totalHours: `R$ ${dsrReflex.toFixed(2)}` },
      { date: 'TOTAL BRUTO ESTIMADO', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${totalGrossPay.toFixed(2)}` },
    ], 'Demostrativo Mensal de Horas CLT');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Calculadora de Horas Trabalhadas Mensal</h2>
          <p className="text-neutral-600 text-sm mt-1">
            Simule a jornada mensal, valor da hora (divisor 220h/200h CLT), DSR e reflexo de horas extras 50%, 100% e adicional noturno.
          </p>
        </div>

        {/* Mode selector */}
        <div className="bg-neutral-100 p-1 rounded-xl flex text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setCalculationType('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              calculationType === 'monthly' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Por Salário Mensal (CLT)
          </button>
          <button
            onClick={() => setCalculationType('hourly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              calculationType === 'hourly' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Por Valor da Hora
          </button>
        </div>
      </div>

      {/* Salary input mode section */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {calculationType === 'monthly' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">Salário Mensal Bruto (R$)</label>
              <input
                type="number"
                step="0.01"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 3300.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">Divisor CLT Contratual</label>
              <select
                value={divisorCLT}
                onChange={(e) => setDivisorCLT(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="220">220 Horas (44h Semanais - Padrão CLT)</option>
                <option value="200">200 Horas (40h Semanais)</option>
                <option value="180">180 Horas (36h Semanais / Escalas)</option>
                <option value="150">150 Horas (30h Semanais)</option>
              </select>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-200 flex flex-col justify-center">
              <span className="text-[11px] text-neutral-500 font-medium">Valor da Hora Calculado:</span>
              <span className="text-xl font-mono font-extrabold text-blue-700">
                R$ {calculatedHourlyWage.toFixed(2).replace('.', ',')} /h
              </span>
            </div>
          </>
        ) : (
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Valor da Hora Normal (R$)</label>
            <input
              type="number"
              step="0.01"
              value={hourlyWageInput}
              onChange={(e) => setHourlyWageInput(e.target.value)}
              className="w-full sm:w-1/2 bg-white border border-neutral-300 rounded-lg p-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 15.00"
            />
          </div>
        )}
      </div>

      {/* Days & Hours setup */}
      <div className="space-y-4 mb-6">
        {/* Quick Days Presets */}
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Preenchimento Rápido de Dias no Mês:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setDaysPreset('22', '8')}
              className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                workingDays === '22' && sundaysAndHolidays === '8'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              22 Úteis + 8 DSR (30d)
            </button>
            <button
              onClick={() => setDaysPreset('21', '9')}
              className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                workingDays === '21' && sundaysAndHolidays === '9'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              21 Úteis + 9 DSR (c/ Feriado)
            </button>
            <button
              onClick={() => setDaysPreset('26', '4')}
              className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                workingDays === '26' && sundaysAndHolidays === '4'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              26 Úteis + 4 DSR (Escala 6x1)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Dias Úteis Trabalhados no Mês</label>
            <input
              type="number"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              placeholder="Ex: 22"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Domingos e Feriados no Mês (DSR)</label>
            <input
              type="number"
              value={sundaysAndHolidays}
              onChange={(e) => setSundaysAndHolidays(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              placeholder="Ex: 8"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Jornada Diária (Horas:Minutos)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-1/2 border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                placeholder="8"
              />
              <span className="self-center font-bold text-neutral-400">:</span>
              <input
                type="number"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(e.target.value)}
                className="w-1/2 border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                placeholder="48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overtime 50%, 100% & Night Shift */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Horas Extras 50% (Dias Úteis/Sáb)</label>
          <input
            type="number"
            step="0.5"
            value={overtime50Hours}
            onChange={(e) => setOvertime50Hours(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: 10"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Horas Extras 100% (Dom/Feriados)</label>
          <input
            type="number"
            step="0.5"
            value={overtime100Hours}
            onChange={(e) => setOvertime100Hours(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: 2"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
            <Moon className="w-3.5 h-3.5 text-indigo-600" /> Horas Noturnas (22h às 05h)
          </label>
          <input
            type="number"
            step="0.5"
            value={nightShiftHours}
            onChange={(e) => setNightShiftHours(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: 0"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
        <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar CSV
        </button>
        <button onClick={copySummary} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />} Copiar Resumo
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
          <Printer className="w-3.5 h-3.5 text-neutral-600" /> Imprimir
        </button>
      </div>

      {/* Summary Box */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Horas Trabalhadas no Mês</p>
            <p className="text-3xl font-black font-mono text-blue-400 mt-1">{totalMonthlyHoursFormatted} h</p>
          </div>
          <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-neutral-300" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
            <span className="text-neutral-400 block mb-1">Salário Base</span>
            <span className="text-base font-bold font-mono text-white">R$ {baseSalary.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
            <span className="text-neutral-400 block mb-1">Extras 50% ({ot50}h)</span>
            <span className="text-base font-bold font-mono text-emerald-400">R$ {overtime50Pay.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
            <span className="text-neutral-400 block mb-1">Extras 100% ({ot100}h)</span>
            <span className="text-base font-bold font-mono text-emerald-400">R$ {overtime100Pay.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
            <span className="text-neutral-400 block mb-1">Reflexo DSR</span>
            <span className="text-base font-bold font-mono text-amber-400">R$ {dsrReflex.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-neutral-800">
          <div>
            <span className="text-neutral-400 text-xs block">TOTAL BRUTO MENSAL ESTIMADO:</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">R$ {totalGrossPay.toFixed(2).replace('.', ',')}</span>
          </div>
          
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('holerite')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Simular Descontos (Holerite)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="monthly" onSelectTab={onSelectTab} />}
    </div>
  );
}


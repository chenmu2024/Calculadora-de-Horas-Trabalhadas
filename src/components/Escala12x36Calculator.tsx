import React, { useState } from 'react';
import { Clock, DollarSign, AlertCircle, Copy, Check, Printer, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';

interface Escala12x36CalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function Escala12x36Calculator({ onSelectTab }: Escala12x36CalculatorProps) {
  const [salary, setSalary] = useState<string>('2400');
  const [shiftsCount, setShiftsCount] = useState<string>('15'); // 15 plantões no mês
  const [shiftType, setShiftType] = useState<'day' | 'night'>('day'); // Diurno (07h-19h) ou Noturno (19h-07h)
  const [holidaysWorked, setHolidaysWorked] = useState<string>('1'); // Feriados trabalhados
  const [holidayRate, setHolidayRate] = useState<'100' | '0'>('100'); // 100% ou já compensado
  const [insalubridade, setInsalubridade] = useState<'0' | '10' | '20' | '40'>('0');
  const [copied, setCopied] = useState(false);

  const baseSalary = parseFloat(salary) || 0;
  const shifts = parseInt(shiftsCount) || 15;
  const holidays = parseInt(holidaysWorked) || 0;
  const divisor = 220; // Divisor padrão CLT
  const hourlyRate = baseSalary > 0 ? baseSalary / divisor : 0;

  // Insalubridade
  const minWage = 1518; // Salário mínimo 2026
  const insalubridadeVal = (minWage * (parseFloat(insalubridade) / 100));

  // Total Hours
  const totalPhysicalHours = shifts * 12;

  // Night shift calculations (19h às 07h: 22h às 05h = 7h relógio + 2h prorrogação = 9h noturnas com hora ficta 52m30s)
  // Fator noturno: 7h relógio * 1.142857 = 8h + 2h prorrogação = 10h noturnas pagas por plantão
  const nightHoursPerShift = shiftType === 'night' ? 10 : 0;
  const totalNightHours = shifts * nightHoursPerShift;
  const nightBonusPerShift = shiftType === 'night' ? (nightHoursPerShift * hourlyRate * 0.20) : 0;
  const totalNightBonus = totalNightHours * hourlyRate * 0.20;

  // Holiday bonus (100% sobre as 12h do plantão)
  const holidayPay = holidayRate === '100' ? (holidays * 12 * hourlyRate * 2.0) : 0;

  // Gross total
  const estimatedGross = baseSalary + insalubridadeVal + totalNightBonus + holidayPay;

  const copyResults = () => {
    const text = `=== Resumo Escala 12x36 (CLT) ===\nSalário Base: R$ ${baseSalary.toFixed(2)}\nPlantões no Mês: ${shifts} plantões (${totalPhysicalHours}h)\nTipo de Turno: ${shiftType === 'night' ? 'Noturno (19h-07h)' : 'Diurno (07h-19h)'}\nAdicional Noturno: R$ ${totalNightBonus.toFixed(2)}\nFeriados Trabalhados (${holidays}): R$ ${holidayPay.toFixed(2)}\nTotal Bruto Estimado: R$ ${estimatedGross.toFixed(2)}\nCalculado em: https://calculadoradehorastrabalhadas.org/escala-12x36`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Artigo 59-A da CLT & Reforma Trabalhista
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
            Calculadora de Escala 12x36 (Plantões, Noturno e Feriados)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Salário Base */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="e12-sal" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Salário Bruto Mensal (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">R$</span>
            <input
              id="e12-sal"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="2400"
            />
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Hora normal: <strong>R$ {hourlyRate.toFixed(2)}/h</strong> (divisor 220)
          </span>
        </div>

        {/* Quantidade de Plantões */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="e12-shifts" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Plantões Trabalhados no Mês
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShiftsCount('15')}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                shiftsCount === '15'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              15 Plantões (180h)
            </button>
            <button
              type="button"
              onClick={() => setShiftsCount('16')}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                shiftsCount === '16'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              16 Plantões (192h)
            </button>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Mês de 30 dias = 15 plantões | Mês de 31 dias = até 16 plantões
          </span>
        </div>

        {/* Turno (Diurno ou Noturno) */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Tipo de Turno do Plantão
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShiftType('day')}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                shiftType === 'day'
                  ? 'bg-amber-500 text-neutral-900 border-amber-500 shadow-sm font-extrabold'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <Sun className="w-4 h-4" /> Diurno (07h-19h)
            </button>
            <button
              type="button"
              onClick={() => setShiftType('night')}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                shiftType === 'night'
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm font-extrabold'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <Moon className="w-4 h-4" /> Noturno (19h-07h)
            </button>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            {shiftType === 'night' ? 'Inclui adicional 20% + hora ficta 52m30s' : 'Sem incidência de adicional noturno'}
          </span>
        </div>

        {/* Feriados Trabalhados */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="e12-holidays" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Feriados Coincidentes no Plantão
          </label>
          <input
            id="e12-holidays"
            type="number"
            value={holidaysWorked}
            onChange={(e) => setHolidaysWorked(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 px-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0"
          />
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Plantão escalado em feriado nacional/municipal
          </span>
        </div>

        {/* Pagamento de Feriado */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Regra de Feriado (CCT / Súmula 444 TST)
          </label>
          <select
            value={holidayRate}
            onChange={(e) => setHolidayRate(e.target.value as any)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="100">Pagar em Dobro (+100% - Súmula 444)</option>
            <option value="0">Compensado / Sem Adicional (Art. 59-A CLT)</option>
          </select>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Verifique a convenção coletiva do seu sindicato
          </span>
        </div>

        {/* Adicional de Insalubridade */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Insalubridade (Hospital / Vigilância)
          </label>
          <select
            value={insalubridade}
            onChange={(e) => setInsalubridade(e.target.value as any)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Sem Insalubridade</option>
            <option value="10">Grau Mínimo (10% = R$ 151,80)</option>
            <option value="20">Grau Médio (20% = R$ 303,60)</option>
            <option value="40">Grau Máximo (40% = R$ 607,20)</option>
          </select>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Calculado sobre o salário mínimo de R$ 1.518,00
          </span>
        </div>
      </div>

      {/* Results Summary Card */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800">
          <div>
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Horas Físicas no Mês</span>
            <div className="text-3xl font-black font-mono text-blue-400">{totalPhysicalHours}h</div>
            <span className="text-xs text-neutral-400">{shifts} plantões de 12 horas</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Adicional Noturno (20%)</span>
            <div className="text-2xl font-bold font-mono text-indigo-300">
              R$ {totalNightBonus.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">
              {shiftType === 'night' ? `${totalNightHours}h noturnas computadas` : 'Não aplicável ao diurno'}
            </span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Feriados em Dobro</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              R$ {holidayPay.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">{holidays} plantão(ões) em feriado</span>
          </div>
        </div>

        {/* Total Bruto */}
        <div className="bg-neutral-800/80 p-4 rounded-xl border border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-neutral-400 block font-semibold">Salário Bruto Total Estimado no Mês:</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">
              R$ {estimatedGross.toFixed(2).replace('.', ',')}
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={copyResults}
              className="flex-1 sm:flex-initial bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Recommendation */}
      {onSelectTab && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs no-print transition-colors">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <strong className="text-emerald-950 dark:text-emerald-200 font-bold block">
                Quer saber seu salário líquido real na escala 12x36?
              </strong>
              <span className="text-emerald-800 dark:text-emerald-300">
                Simule todos os descontos de INSS, IRRF e vale-transporte com esse valor de R$ {estimatedGross.toFixed(2).replace('.', ',')}.
              </span>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('holerite')}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Simular Salário Líquido</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Legal & Educational Box */}
      <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 p-5 rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Como Funciona a Escala 12x36 na Legislação CLT?
        </h4>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Pelo <strong>Artigo 59-A da CLT</strong> (inserido pela Reforma Trabalhista), a jornada 12x36 permite trabalhar 12 horas contínuas seguidas por 36 horas ininterruptas de descanso. O intervalo intrajornada (almoço/jantar) de 1 hora deve ser respeitado ou indenizado caso não seja usufruído.
        </p>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <strong>Trabalho Noturno na 12x36:</strong> Quando o plantão é das 19h às 07h, as horas trabalhadas entre 22h e 05h recebem o adicional de 20% com a redução da hora ficta (52m30s). Além disso, pela <strong>Súmula 60, II do TST</strong>, as horas das 05h às 07h (prorrogação) também são remuneradas com adicional noturno.
        </p>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="escala12x36" onSelectTab={onSelectTab} />}
    </div>
  );
}

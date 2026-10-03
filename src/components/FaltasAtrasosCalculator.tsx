import { copyText as writeClipboard, nonNegative } from '../utils/browser';
import React, { useState } from 'react';
import { Clock, AlertTriangle, AlertCircle, Copy, Check, Printer, Sparkles, HelpCircle, ArrowRight, DollarSign, Calendar, Scale } from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';

interface FaltasAtrasosCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function FaltasAtrasosCalculator({ onSelectTab }: FaltasAtrasosCalculatorProps) {
  const [salary, setSalary] = useState<string>('3000');
  const [weeklyHours, setWeeklyHours] = useState<'44' | '40' | '36' | '30'>('44');
  
  // Delays
  const [delayMinutes, setDelayMinutes] = useState<string>('45'); // Atrasos em minutos no mês
  
  // Absences
  const [unjustifiedAbsences, setUnjustifiedAbsences] = useState<string>('1'); // Dias de falta injustificada
  const [dsrLostCount, setDsrLostCount] = useState<string>('1'); // Quantos DSRs perdidos

  const [copied, setCopied] = useState(false);

  const baseSalary = nonNegative(salary, 0);
  const divisor = weeklyHours === '44' ? 220 : weeklyHours === '40' ? 200 : weeklyHours === '36' ? 180 : 150;
  const hourlyRate = baseSalary > 0 ? baseSalary / divisor : 0;
  const minuteRate = hourlyRate / 60;
  const dailyWage = baseSalary / 30; // Art. 64 CLT: Salário diário = Salário ÷ 30

  const totalDelayMin = nonNegative(delayMinutes, 0);
  const absences = nonNegative(unjustifiedAbsences, 0);
  const dsrs = nonNegative(dsrLostCount, 0);

  // Calculations
  const delayDiscount = totalDelayMin * minuteRate;
  const absenceDiscount = absences * dailyWage;
  const dsrDiscount = dsrs * dailyWage; // Lei 605/49 Art. 6º
  const totalDiscount = delayDiscount + absenceDiscount + dsrDiscount;
  const remainingSalary = Math.max(0, baseSalary - totalDiscount);

  const copyResults = async () => {
    const text = `=== Desconto de Faltas e Atrasos (CLT 2026) ===\nSalário Base: R$ ${baseSalary.toFixed(2)}\nDesconto por Atrasos (${totalDelayMin} min): R$ ${delayDiscount.toFixed(2)}\nDesconto por Faltas (${absences} dia(s)): R$ ${absenceDiscount.toFixed(2)}\nPerda do DSR (${dsrs} domingo(s)): R$ ${dsrDiscount.toFixed(2)}\nTotal de Descontos: R$ ${totalDiscount.toFixed(2)}\nSalário Restante Estimado: R$ ${remainingSalary.toFixed(2)}\nCalculado em: https://calculadoradehorastrabalhadas.org/atrasos-e-faltas`;
    if (!await writeClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
            Art. 58 e Art. 473 CLT • Lei 605/1949
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
            Calculadora de Desconto de Atrasos, Faltas e Perda de DSR
          </h2>
        </div>
        <button
          onClick={() => window.print()}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Imprimir</span>
        </button>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Salário */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="fa-sal" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Salário Bruto Mensal (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">R$</span>
            <input
              id="fa-sal"
              type="number" min="0"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="3000"
            />
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Dia trabalhado: <strong>R$ {dailyWage.toFixed(2)}</strong> (divisor 30)
          </span>
        </div>

        {/* Carga Horária */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Jornada Semanal Contratual
          </label>
          <select aria-label="Jornada Semanal Contratual"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value as any)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="44">44h semanais (Divisor 220)</option>
            <option value="40">40h semanais (Divisor 200)</option>
            <option value="36">36h semanais (Divisor 180)</option>
            <option value="30">30h semanais (Divisor 150)</option>
          </select>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Minuto: <strong>R$ {minuteRate.toFixed(3)}</strong>/min
          </span>
        </div>

        {/* Atrasos acumulados */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="fa-delay" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Total de Atrasos no Mês (Minutos)
          </label>
          <input
            id="fa-delay"
            type="number" min="0"
            value={delayMinutes}
            onChange={(e) => setDelayMinutes(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 px-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
            placeholder="Ex: 45"
          />
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Apenas atrasos que superaram os 10 min de tolerância diária
          </span>
        </div>

        {/* Faltas Injustificadas */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="fa-absences" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Faltas Injustificadas (Dias)
          </label>
          <div className="flex gap-2">
            <input
              id="fa-absences"
              type="number" min="0"
              value={unjustifiedAbsences}
              onChange={(e) => {
                setUnjustifiedAbsences(e.target.value);
                setDsrLostCount(e.target.value); // Cada falta injustificada na semana costuma descontar 1 DSR
              }}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 px-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="0"
            />
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Dias sem atestado médico legal
          </span>
        </div>
      </div>

      {/* DSR Warning Box */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <strong className="text-amber-950 dark:text-amber-200 font-bold block">
              Desconto de Descanso Semanal Remunerado (Perda do DSR)
            </strong>
            <span className="text-amber-800 dark:text-amber-300">
              Pelo Art. 6º da Lei 605/49, a falta não justificada na semana autoriza a empresa a descontar 1 dia de DSR (domingo).
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="fa-dsr" className="font-bold text-amber-950 dark:text-amber-200">DSRs a descontar:</label>
          <input
            id="fa-dsr"
            type="number" min="0"
            value={dsrLostCount}
            onChange={(e) => setDsrLostCount(e.target.value)}
            className="w-16 bg-white dark:bg-neutral-900 border border-amber-300 dark:border-amber-700 rounded-lg p-1.5 text-center font-bold text-xs"
          />
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800">
          <div>
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Desconto de Atrasos</span>
            <div className="text-2xl font-bold font-mono text-rose-400">
              - R$ {delayDiscount.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">{totalDelayMin} minutos apurados</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Desconto de Faltas</span>
            <div className="text-2xl font-bold font-mono text-rose-400">
              - R$ {absenceDiscount.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">{absences} dia(s) × R$ {dailyWage.toFixed(2)}</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Perda do DSR (Lei 605/49)</span>
            <div className="text-2xl font-bold font-mono text-rose-400">
              - R$ {dsrDiscount.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">{dsrs} domingo(s) descontado(s)</span>
          </div>
        </div>

        {/* Total Descontos & Salário Restante */}
        <div className="bg-neutral-800/80 p-4 rounded-xl border border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-neutral-400 block font-semibold">Total de Descontos no Mês:</span>
            <div className="text-3xl font-extrabold font-mono text-rose-400">
              - R$ {totalDiscount.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">
              Salário Base Restante: <strong>R$ {remainingSalary.toFixed(2).replace('.', ',')}</strong>
            </span>
          </div>

          <button
            onClick={copyResults}
            className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
          </button>
        </div>
      </div>

      {/* Educational Legal Box */}
      <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 p-5 rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-sm">
          <Scale className="w-4 h-4 text-rose-600" />
          Faltas Justificadas pela CLT (Artigo 473 - Não Podem Ser Descontadas)
        </h4>
        <ul className="text-neutral-600 dark:text-neutral-300 list-disc pl-4 space-y-1 leading-relaxed">
          <li><strong>Falecimento de cônjuge, pais, filhos ou irmãos:</strong> até 2 dias consecutivos de luto.</li>
          <li><strong>Casamento do empregado:</strong> até 3 dias consecutivos (licença gala).</li>
          <li><strong>Nascimento de filho:</strong> 5 dias consecutivos de licença paternidade.</li>
          <li><strong>Doação voluntária de sangue:</strong> 1 dia a cada 12 meses devidamente comprovada.</li>
          <li><strong>Atestado médico:</strong> ausência abonada com apresentação de atestado médico válido.</li>
        </ul>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="faltas" onSelectTab={onSelectTab} />}
    </div>
  );
}

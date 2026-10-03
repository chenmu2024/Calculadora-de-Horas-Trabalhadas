import { useDialog } from '../hooks/useDialog';
import { copyText as writeClipboard, nonNegative } from '../utils/browser';
import React, { useState } from 'react';
import { ArrowRightLeft, Clock, DollarSign, X, Copy, Check, Calculator } from 'lucide-react';
import { timeToMinutes, minutesToTime } from '../utils/time';

interface QuickConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickConverterModal({ isOpen, onClose }: QuickConverterModalProps) {
  const [activeTab, setActiveTab] = useState<'mins_to_dec' | 'dec_to_mins' | 'rate'>('mins_to_dec');

  // Minutes -> Decimals
  const [timeInput, setTimeInput] = useState('08:48');

  // Decimals -> Hours & Mins
  const [decimalInput, setDecimalInput] = useState('8.80');

  // Hourly Rate
  const [salaryInput, setSalaryInput] = useState('3000');
  const [divisorInput, setDivisorInput] = useState('220');

  const [copied, setCopied] = useState(false);

  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  // Minutes -> Decimal Calculation
  const totalMins = timeToMinutes(timeInput);
  const decimalResult = (totalMins / 60).toFixed(2);

  // Decimal -> Time Calculation
  const decVal = nonNegative(decimalInput, 0);
  const decMins = Math.round(decVal * 60);
  const timeResult = minutesToTime(decMins);

  // Hourly Rate Calculation
  const salVal = nonNegative(salaryInput, 0);
  const divVal = nonNegative(divisorInput, 220);
  const hourlyRateResult = divVal > 0 ? (salVal / divVal).toFixed(2) : '0.00';

  const copyText = async (txt: string) => {
    if (!await writeClipboard(txt)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Conversor de Horas" tabIndex={-1} className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200 no-print">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Conversor Rápido de Horas & Valores</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Minutos ⇄ Decimais e Cálculo de Hora Avulsa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-3 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[11px] font-semibold my-4 gap-1">
          <button
            onClick={() => setActiveTab('mins_to_dec')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'mins_to_dec' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Horas ➔ Decimal
          </button>
          <button
            onClick={() => setActiveTab('dec_to_mins')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'dec_to_mins' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Decimal ➔ Horas
          </button>
          <button
            onClick={() => setActiveTab('rate')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'rate' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Valor da Hora
          </button>
        </div>

        {/* Content 1: Hours -> Decimals */}
        {activeTab === 'mins_to_dec' && (
          <div className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Digite o Horário (HH:MM):
              </label>
              <input aria-label="Digite o Horário (HH:MM):"
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 font-mono text-base font-bold text-neutral-800 dark:text-white bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-center">
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium block">Resultado em Horas Decimais (Excel/Folha):</span>
              <span className="text-2xl font-black text-blue-900 dark:text-blue-100 font-mono mt-1 block">
                {decimalResult} h
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                ({totalMins} minutos no total)
              </span>
            </div>

            <button
              onClick={() => copyText(`${decimalResult}`)}
              className="w-full bg-neutral-900 dark:bg-blue-600 hover:bg-neutral-800 dark:hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Valor Decimal'}
            </button>
          </div>
        )}

        {/* Content 2: Decimals -> Hours */}
        {activeTab === 'dec_to_mins' && (
          <div className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Digite em Decimal (ex: 7.75 ou 8.8):
              </label>
              <input aria-label="Digite em Decimal (ex: 7.75 ou 8.8):"
                type="number" min="0" inputMode="decimal"
                step="0.01"
                value={decimalInput}
                onChange={(e) => setDecimalInput(e.target.value)}
                className="w-full border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 font-mono text-base font-bold text-neutral-800 dark:text-white bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-center">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium block">Resultado em Horas e Minutos Relógio:</span>
              <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100 font-mono mt-1 block">
                {timeResult}
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                ({decMins} minutos no total)
              </span>
            </div>

            <button
              onClick={() => copyText(timeResult)}
              className="w-full bg-neutral-900 dark:bg-blue-600 hover:bg-neutral-800 dark:hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Horário HH:MM'}
            </button>
          </div>
        )}

        {/* Content 3: Hourly Rate */}
        {activeTab === 'rate' && (
          <div className="space-y-4 my-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Salário Bruto (R$):
                </label>
                <input aria-label="Salário Bruto (R$):"
                  type="number" min="0" inputMode="decimal"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full border border-neutral-300 dark:border-neutral-700 rounded-xl p-2.5 font-mono text-sm font-bold text-neutral-800 dark:text-white bg-white dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Divisor Mensal:
                </label>
                <select aria-label="Divisor Mensal:"
                  value={divisorInput}
                  onChange={(e) => setDivisorInput(e.target.value)}
                  className="w-full border border-neutral-300 dark:border-neutral-700 rounded-xl p-2.5 font-mono text-sm font-bold text-neutral-800 dark:text-white bg-white dark:bg-neutral-800 cursor-pointer"
                >
                  <option value="220">220 (44h)</option>
                  <option value="200">200 (40h)</option>
                  <option value="180">180 (36h)</option>
                  <option value="150">150 (30h)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-center">
              <span className="text-xs text-indigo-800 dark:text-indigo-300 font-medium block">Valor da Hora Normal de Trabalho:</span>
              <span className="text-2xl font-black text-indigo-950 dark:text-indigo-100 font-mono mt-1 block">
                R$ {hourlyRateResult.replace('.', ',')}
              </span>
            </div>

            <button
              onClick={() => copyText(`R$ ${hourlyRateResult}`)}
              className="w-full bg-neutral-900 dark:bg-blue-600 hover:bg-neutral-800 dark:hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Valor da Hora'}
            </button>
          </div>
        )}

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

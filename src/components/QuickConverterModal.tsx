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

  if (!isOpen) return null;

  // Minutes -> Decimal Calculation
  const totalMins = timeToMinutes(timeInput);
  const decimalResult = (totalMins / 60).toFixed(2);

  // Decimal -> Time Calculation
  const decVal = parseFloat(decimalInput) || 0;
  const decMins = Math.round(decVal * 60);
  const timeResult = minutesToTime(decMins);

  // Hourly Rate Calculation
  const salVal = parseFloat(salaryInput) || 0;
  const divVal = parseFloat(divisorInput) || 220;
  const hourlyRateResult = divVal > 0 ? (salVal / divVal).toFixed(2) : '0.00';

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Conversor Rápido de Horas & Valores</h3>
              <p className="text-xs text-neutral-500">Minutos ⇄ Decimais e Cálculo de Hora Avulsa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-3 p-1 bg-neutral-100 rounded-xl text-[11px] font-semibold my-4 gap-1">
          <button
            onClick={() => setActiveTab('mins_to_dec')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'mins_to_dec' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Horas ➔ Decimal
          </button>
          <button
            onClick={() => setActiveTab('dec_to_mins')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'dec_to_mins' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Decimal ➔ Horas
          </button>
          <button
            onClick={() => setActiveTab('rate')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'rate' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Valor da Hora
          </button>
        </div>

        {/* Content 1: Hours -> Decimals */}
        {activeTab === 'mins_to_dec' && (
          <div className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Digite o Horário (HH:MM):
              </label>
              <input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl p-3 font-mono text-base font-bold text-neutral-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs text-blue-700 font-medium block">Resultado em Horas Decimais (Excel/Folha):</span>
              <span className="text-2xl font-black text-blue-900 font-mono mt-1 block">
                {decimalResult} h
              </span>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                ({totalMins} minutos no total)
              </span>
            </div>

            <button
              onClick={() => copyText(`${decimalResult}`)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Digite em Decimal (ex: 7.75 ou 8.8):
              </label>
              <input
                type="number" inputMode="decimal"
                step="0.01"
                value={decimalInput}
                onChange={(e) => setDecimalInput(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl p-3 font-mono text-base font-bold text-neutral-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs text-emerald-800 font-medium block">Resultado em Horas e Minutos Relógio:</span>
              <span className="text-2xl font-black text-emerald-900 font-mono mt-1 block">
                {timeResult}
              </span>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                ({decMins} minutos no total)
              </span>
            </div>

            <button
              onClick={() => copyText(timeResult)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Salário Bruto (R$):
                </label>
                <input
                  type="number" inputMode="decimal"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-mono text-sm font-bold text-neutral-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Divisor Mensal:
                </label>
                <select
                  value={divisorInput}
                  onChange={(e) => setDivisorInput(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-mono text-sm font-bold text-neutral-800 bg-white cursor-pointer"
                >
                  <option value="220">220 (44h)</option>
                  <option value="200">200 (40h)</option>
                  <option value="180">180 (36h)</option>
                  <option value="150">150 (30h)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
              <span className="text-xs text-indigo-800 font-medium block">Valor da Hora Normal de Trabalho:</span>
              <span className="text-2xl font-black text-indigo-950 font-mono mt-1 block">
                R$ {hourlyRateResult.replace('.', ',')}
              </span>
            </div>

            <button
              onClick={() => copyText(`R$ ${hourlyRateResult}`)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Valor da Hora'}
            </button>
          </div>
        )}

        <div className="pt-3 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

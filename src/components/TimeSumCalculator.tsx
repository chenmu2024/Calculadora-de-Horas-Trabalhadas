import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ArrowRightLeft, Clock, Copy, Check, RotateCcw, Download, Printer } from 'lucide-react';
import { timeToMinutes, minutesToTime } from '../utils/time';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';

interface TimeParcel {
  id: string;
  operation: '+' | '-';
  time: string; // "08:00"
  label: string;
}

interface TimeSumCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function TimeSumCalculator({ onSelectTab }: TimeSumCalculatorProps) {
  const [parcels, setParcels] = useState<TimeParcel[]>(() => {
    const saved = localStorage.getItem('calc_sum_parcels');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', operation: '+', time: '08:00', label: 'Turno 1' },
      { id: '2', operation: '+', time: '04:00', label: 'Turno 2' },
      { id: '3', operation: '-', time: '01:00', label: 'Desconto Almoço' },
    ];
  });
  const [copied, setCopied] = useState(false);

  // Minutes & Decimals Conversion states
  const [inputMinutes, setInputMinutes] = useState(() => localStorage.getItem('calc_sum_inmins') || '225');
  const [inputDecimal, setInputDecimal] = useState(() => localStorage.getItem('calc_sum_indec') || '7.75');

  useEffect(() => {
    localStorage.setItem('calc_sum_parcels', JSON.stringify(parcels));
    localStorage.setItem('calc_sum_inmins', inputMinutes);
    localStorage.setItem('calc_sum_indec', inputDecimal);
  }, [parcels, inputMinutes, inputDecimal]);

  const addParcel = (op: '+' | '-' = '+', defaultTime = '01:00', label = 'Intervalo') => {
    setParcels([
      ...parcels,
      { id: Math.random().toString(), operation: op, time: defaultTime, label }
    ]);
  };

  const updateParcel = (id: string, field: keyof TimeParcel, value: string) => {
    setParcels(parcels.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleOperation = (id: string) => {
    setParcels(parcels.map(p => p.id === id ? { ...p, operation: p.operation === '+' ? '-' : '+' } : p));
  };

  const removeParcel = (id: string) => {
    setParcels(parcels.filter(p => p.id !== id));
  };

  const clearAll = () => {
    setParcels([]);
  };

  // Sum calculation
  const totalMinutesSum = parcels.reduce((acc, p) => {
    const mins = timeToMinutes(p.time);
    return acc + (p.operation === '+' ? mins : -mins);
  }, 0);

  const isNegativeSum = totalMinutesSum < 0;
  const absTotalMin = Math.abs(totalMinutesSum);
  const totalHoursFormatted = minutesToTime(absTotalMin);
  const totalDecimalHours = (absTotalMin / 60).toFixed(2);

  // Minute -> HH:MM & Decimal
  const singleMin = parseInt(inputMinutes) || 0;
  const minToTimeStr = minutesToTime(singleMin);
  const minToDecimalStr = (singleMin / 60).toFixed(2);

  // Decimal -> HH:MM
  const decVal = parseFloat(inputDecimal) || 0;
  const decTotalMinutes = Math.round(decVal * 60);
  const decToTimeStr = minutesToTime(decTotalMinutes);

  const copySum = () => {
    const lines = parcels.map(p => `${p.operation} ${p.time} (${p.label || 'Item'})`);
    const text = `SOMA/SUBTRAÇÃO DE HORAS:\n${lines.join('\n')}\n\nTOTAL FINAL: ${isNegativeSum ? '-' : ''}${totalHoursFormatted} h (${totalDecimalHours}h decimais)\nCalculado em calculadoradehorastrabalhadas.org`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    generateTimesheetCSV(
      parcels.map(p => ({
        date: p.label || 'Intervalo',
        start: p.operation === '+' ? 'Adição' : 'Subtração',
        end: '-',
        breakTime: '-',
        totalHours: `${p.operation}${p.time}`
      })),
      'Soma e Calculo de Horas'
    );
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* SECTION 1: Somador e Subtraidor de Horas */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Somador e Subtraidor de Horas</h2>
            <p className="text-neutral-600 text-sm mt-1">
              Adicione ou subtraia múltiplos intervalos de tempo (HH:MM) para calcular o total em horas relógio e decimais.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={clearAll} className="bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-500 text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" /> Limpar Tudo
            </button>
          </div>
        </div>

        {/* Parcels Grid */}
        <div className="space-y-2 mb-4">
          {parcels.map((p) => (
            <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white border border-neutral-200 p-2.5 rounded-xl hover:border-blue-300 transition-colors">
              <div className="col-span-1 sm:col-span-3">
                <button
                  type="button"
                  onClick={() => toggleOperation(p.id)}
                  className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    p.operation === '+'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                  title="Clique para alternar entre Somar (+) ou Subtrair (-)"
                >
                  {p.operation === '+' ? <Plus className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  <span>{p.operation === '+' ? 'Somar (+)' : 'Subtrair (-)'}</span>
                </button>
              </div>

              <div className="col-span-1 sm:col-span-4">
                <input
                  type="text"
                  value={p.label}
                  onChange={(e) => updateParcel(p.id, 'label', e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-blue-500"
                  placeholder="Descrição (ex: Turno 1, Almoço, Horas Extras)"
                  aria-label={`Descrição da parcela ${p.id}`}
                />
              </div>

              <div className="col-span-1 sm:col-span-3">
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-300 rounded-lg p-1.5">
                  <Clock className="w-4 h-4 text-neutral-400 ml-1 shrink-0" />
                  <input
                    type="time"
                    value={p.time}
                    onChange={(e) => updateParcel(p.id, 'time', e.target.value)}
                    className="w-full bg-transparent font-mono font-bold text-sm text-neutral-800 outline-none"
                    aria-label={`Tempo da parcela ${p.label || p.id}`}
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end">
                {parcels.length > 1 && (
                  <button
                    onClick={() => removeParcel(p.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remover Parcela"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => addParcel('+', '08:00', 'Novo Turno')}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Somar Horas (+)
            </button>
            <button
              onClick={() => addParcel('-', '01:00', 'Desconto / Intervalo')}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" /> Subtrair Horas (-)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
              <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar CSV
            </button>
            <button onClick={copySum} className="flex items-center gap-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />} Copiar Resultado
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
              <Printer className="w-3.5 h-3.5 text-neutral-600" /> Imprimir
            </button>
          </div>
        </div>

        {/* Total Display */}
        <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Total Final Acumulado</span>
            <div className={`text-4xl font-extrabold font-mono mt-0.5 ${isNegativeSum ? 'text-rose-400' : 'text-blue-400'}`}>
              {isNegativeSum ? '-' : ''}{totalHoursFormatted} h
            </div>
          </div>
          <div className="bg-neutral-800 px-5 py-3 rounded-xl border border-neutral-700 text-right">
            <span className="text-[11px] text-neutral-400 block">Formato Decimal (Sistemas de RH / Ponto)</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {isNegativeSum ? '-' : ''}{totalDecimalHours} h
            </span>
          </div>
        </div>
      </div>

      <hr className="border-neutral-200" />

      {/* SECTION 2: Conversores bidirecionais */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2 mb-1">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" /> Conversor de Minutos e Horas Decimais
          </h3>
          <p className="text-neutral-600 text-xs">
            Aprenda ou converta instantaneamente entre minutos totais, formato relógio (HH:MM) e horas decimais de folha de pagamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minutes to HH:MM */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">1. De Minutos para Horas e Decimais</h4>
            <div>
              <label htmlFor="timesum-input-minutes" className="block text-xs font-semibold text-neutral-700 mb-1">Digite os Minutos</label>
              <input
                id="timesum-input-minutes"
                aria-label="Minutos totais para converter"
                type="number" inputMode="decimal"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 225"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Relógio (HH:MM)</span>
                <span className="text-xl font-black font-mono text-blue-600">{minToTimeStr}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Decimal</span>
                <span className="text-xl font-black font-mono text-emerald-600">{minToDecimalStr} h</span>
              </div>
            </div>
          </div>

          {/* Decimal to HH:MM */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">2. De Horas Decimais para Relógio (HH:MM)</h4>
            <div>
              <label htmlFor="timesum-input-decimal" className="block text-xs font-semibold text-neutral-700 mb-1">Digite Horas Decimais (ex: 7,75)</label>
              <input
                id="timesum-input-decimal"
                aria-label="Horas decimais para converter"
                type="number" inputMode="decimal"
                step="0.01"
                value={inputDecimal}
                onChange={(e) => setInputDecimal(e.target.value)}
                className="w-full border border-neutral-300 bg-white rounded-xl p-2.5 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 7.75"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Minutos Totais</span>
                <span className="text-xl font-black font-mono text-purple-600">{decTotalMinutes} min</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Relógio (HH:MM)</span>
                <span className="text-xl font-black font-mono text-blue-600">{decToTimeStr} h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Conversion Reference Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Tabela Prática de Conversão de Minutos para Decimais (Tabela de Ponto RH)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
            {[
              { min: '05 min', dec: '0,08 h' },
              { min: '10 min', dec: '0,17 h' },
              { min: '15 min', dec: '0,25 h' },
              { min: '20 min', dec: '0,33 h' },
              { min: '25 min', dec: '0,42 h' },
              { min: '30 min', dec: '0,50 h' },
              { min: '35 min', dec: '0,58 h' },
              { min: '40 min', dec: '0,67 h' },
              { min: '45 min', dec: '0,75 h' },
              { min: '50 min', dec: '0,83 h' },
              { min: '55 min', dec: '0,92 h' },
              { min: '60 min', dec: '1,00 h' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-neutral-200 p-2 rounded-lg text-center shadow-2xs">
                <span className="text-neutral-500 block text-[10px]">{item.min}</span>
                <span className="font-bold text-neutral-800">{item.dec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="sum" onSelectTab={onSelectTab} />}
    </div>
  );
}


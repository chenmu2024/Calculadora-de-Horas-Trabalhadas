import { useDialog } from '../hooks/useDialog';
import React, { useState } from 'react';
import { Calendar, X, Check, Info, ShieldCheck } from 'lucide-react';
import { MONTH_NAMES_PT, getMonthWorkStats, HOLIDAYS_2026 } from '../utils/holidays2026';

interface HolidayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HolidayCalendarModal: React.FC<HolidayCalendarModalProps> = ({ isOpen, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [includeSaturday, setIncludeSaturday] = useState<boolean>(true);

  const [includeOptional, setIncludeOptional] = useState(false);
  const [localDates, setLocalDates] = useState('');
  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  const stats = getMonthWorkStats(2026, selectedMonth, includeSaturday, includeOptional, localDates.split(/[,\s]+/).filter(Boolean));

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Calendário de Dias Úteis" tabIndex={-1} className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-fade-in no-print">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 space-y-5 relative max-h-[90vh] overflow-y-auto transition-colors">
        <button
          onClick={onClose}
            aria-label="Fechar"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Calendário de Dias Úteis & DSR 2026</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Consulte feriados nacionais e proporção de DSR para cálculos da CLT</p>
          </div>
        </div>

        {/* Month Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">Selecione o Mês de Referência (2026):</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {MONTH_NAMES_PT.map((name, idx) => (
              <button
                key={name}
                onClick={() => setSelectedMonth(idx)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedMonth === idx
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-between">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Sábado conta como Dia Útil?</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              aria-label="Sábado conta como Dia Útil"
              checked={includeSaturday}
              onChange={(e) => setIncludeSaturday(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <label className="block text-xs"><input aria-label={"Incluir pontos facultativos conforme o acordo aplicável"} type="checkbox" checked={includeOptional} onChange={e => setIncludeOptional(e.target.checked)} /> Incluir pontos facultativos conforme o acordo aplicável</label>
        <label className="block text-xs">Feriados locais (AAAA-MM-DD, separados por vírgula)<input aria-label={"Feriados locais (AAAA-MM-DD, separados por vírgula)"} className="w-full border rounded-lg p-2" value={localDates} onChange={e => setLocalDates(e.target.value)} placeholder="2026-01-25" /></label>
        <p className="text-xs">Sábados sem expediente: {stats.saturdaysOff}. Eles não foram somados aos domingos e feriados. Confirme o divisor de DSR do contrato.</p>
        {/* Result Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3.5 rounded-xl">
            <span className="text-emerald-800 dark:text-emerald-300 text-xs font-semibold block mb-1">Dias Úteis no Mês</span>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">{stats.workingDays} Dias</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Usados para o divisor de Horas Extras</span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-xl">
            <span className="text-amber-800 dark:text-amber-300 text-xs font-semibold block mb-1">Domingos + Feriados</span>
            <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">{stats.sundaysAndHolidays} Dias</div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Usados para a proporção do DSR</span>
          </div>
        </div>

        {/* Feriados do mês */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">Feriados e Pontos Facultativos em {MONTH_NAMES_PT[selectedMonth]}:</span>
          {stats.monthHolidays.length > 0 ? (
            <div className="space-y-1.5">
              {stats.monthHolidays.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <span className="font-bold text-blue-700 dark:text-blue-400">Dia {h.day}</span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">{h.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
              Nenhum feriado nacional cadastrado para este mês.
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Calendário Oficial CLT 2026</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="px-4 py-2 bg-neutral-900 dark:bg-blue-600 hover:bg-neutral-800 dark:hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Entendi / Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, ChangeEvent } from 'react';
import { calculateDuration, minutesToTime, timeToMinutes } from '../utils/time';
import { Plus, Trash2, Calendar, Download, Printer, Copy, Check, RotateCcw, AlertCircle, Clock, CheckCircle2, Sparkles, Upload } from 'lucide-react';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';
import CLTAlertBanner from './CLTAlertBanner';
import ShiftTemplatesModal, { ShiftTemplate } from './ShiftTemplatesModal';

interface DayEntry {
  id: string;
  date: string;
  start: string;
  end: string;
  breakTime: string;
}

interface TimesheetCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function TimesheetCalculator({ onSelectTab }: TimesheetCalculatorProps) {
  const [weeklyTarget, setWeeklyTarget] = useState('44:00'); // '44:00', '40:00', '36:00'
  const [entries, setEntries] = useState<DayEntry[]>(() => {
    try {
      const saved = localStorage.getItem('timesheet_entries_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [
      { id: '1', date: 'Segunda-feira', start: '08:00', end: '18:00', breakTime: '01:00' },
      { id: '2', date: 'Terça-feira', start: '08:00', end: '18:00', breakTime: '01:00' },
      { id: '3', date: 'Quarta-feira', start: '08:00', end: '18:00', breakTime: '01:00' },
      { id: '4', date: 'Quinta-feira', start: '08:00', end: '18:00', breakTime: '01:00' },
      { id: '5', date: 'Sexta-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
    ];
  });

  const [copied, setCopied] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const saveEntries = (newEntries: DayEntry[]) => {
    setEntries(newEntries);
    try {
      localStorage.setItem('timesheet_entries_v1', JSON.stringify(newEntries));
    } catch (e) {
      // ignore
    }
  };

  const updateEntry = (id: string, field: keyof DayEntry, value: string) => {
    saveEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEntry = () => {
    saveEntries([...entries, { id: Math.random().toString(), date: 'Novo Dia', start: '08:00', end: '18:00', breakTime: '01:00' }]);
  };

  const removeEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  const handleApplyTemplate = (template: ShiftTemplate) => {
    const newEntries = template.days.map((d, i) => ({
      id: String(i + 1),
      date: d.date,
      start: d.start,
      end: d.end,
      breakTime: d.breakTime,
    }));
    saveEntries(newEntries);
  };

  const exportJSONBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_folha_ponto_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSONBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            saveEntries(parsed);
          }
        } catch (err) {
          alert('Arquivo JSON inválido.');
        }
      };
    }
  };

  const loadPreset44hWeekdays = () => {
    setWeeklyTarget('44:00');
    saveEntries([
      { id: '1', date: 'Segunda-feira', start: '08:00', end: '17:48', breakTime: '01:00' },
      { id: '2', date: 'Terça-feira', start: '08:00', end: '17:48', breakTime: '01:00' },
      { id: '3', date: 'Quarta-feira', start: '08:00', end: '17:48', breakTime: '01:00' },
      { id: '4', date: 'Quinta-feira', start: '08:00', end: '17:48', breakTime: '01:00' },
      { id: '5', date: 'Sexta-feira', start: '08:00', end: '17:48', breakTime: '01:00' },
    ]);
  };

  const loadPreset44hWithSaturday = () => {
    setWeeklyTarget('44:00');
    saveEntries([
      { id: '1', date: 'Segunda-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '2', date: 'Terça-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '3', date: 'Quarta-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '4', date: 'Quinta-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '5', date: 'Sexta-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '6', date: 'Sábado', start: '08:00', end: '12:00', breakTime: '00:00' },
    ]);
  };

  const loadPreset40hWeekdays = () => {
    setWeeklyTarget('40:00');
    saveEntries([
      { id: '1', date: 'Segunda-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '2', date: 'Terça-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '3', date: 'Quarta-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '4', date: 'Quinta-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
      { id: '5', date: 'Sexta-feira', start: '08:00', end: '17:00', breakTime: '01:00' },
    ]);
  };

  const clearAll = () => {
    saveEntries([]);
  };

  const totalMinutes = entries.reduce((acc, entry) => {
    return acc + calculateDuration(entry.start, entry.end, undefined, undefined, timeToMinutes(entry.breakTime));
  }, 0);

  const targetMinutes = timeToMinutes(weeklyTarget);
  const diffMinutes = totalMinutes - targetMinutes;
  const isOvertime = diffMinutes > 0;
  const isDeficit = diffMinutes < 0;

  const exportCSV = () => {
    const formattedData = entries.map(e => {
      const durationMin = calculateDuration(e.start, e.end, undefined, undefined, timeToMinutes(e.breakTime));
      return {
        date: e.date,
        start: e.start,
        end: e.end,
        breakTime: e.breakTime,
        totalHours: minutesToTime(durationMin)
      };
    });
    generateTimesheetCSV(formattedData, 'Folha de Ponto Semanal');
  };

  const copySummary = () => {
    const summaryLines = entries.map(e => {
      const dur = calculateDuration(e.start, e.end, undefined, undefined, timeToMinutes(e.breakTime));
      return `${e.date || 'Dia'}: ${e.start} - ${e.end} (Int: ${e.breakTime}) = ${minutesToTime(dur)}`;
    });

    const balanceStr = isOvertime
      ? `Horas Extras Semanal: +${minutesToTime(diffMinutes)}`
      : isDeficit
      ? `Horas Negativas: -${minutesToTime(Math.abs(diffMinutes))}`
      : 'Carga Semanal Cumprida Exatamente';

    const fullText = `REGISTRO DE HORAS TRABALHADAS (SEMANAL):\n\n${summaryLines.join('\n')}\n\nTOTAL ACUMULADO: ${minutesToTime(totalMinutes)}\nMeta Semanal CLT: ${weeklyTarget}\n${balanceStr}\n\nCalculado em calculadoradehorastrabalhadas.org`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Calculadora de Horas Trabalhadas Semanal (CLT 44h)</h2>
          <p className="text-neutral-600 text-sm mt-1">Preencha sua folha de ponto semanal, compare com a carga horária e baixe o relatório.</p>
        </div>

        {/* Quick presets and templates */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Modelos de Escala (1-Clique)
          </button>
          <button onClick={exportJSONBackup} className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-2 rounded-xl transition-colors font-medium flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Backup JSON
          </button>
          <label className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-2 rounded-xl transition-colors font-medium flex items-center gap-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Restaurar
            <input type="file" accept=".json" onChange={importJSONBackup} className="hidden" aria-label="Restaurar backup JSON" />
          </label>
          <button onClick={clearAll} className="bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-500 px-2.5 py-2 rounded-xl transition-colors font-medium flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Limpar
          </button>
        </div>
      </div>

      {/* Target Selector & Quick Presets Bar */}
      <div className="mb-4 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-medium text-neutral-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" /> Carga Horária Semanal Contratual:
          </span>
          <div className="flex items-center gap-2">
            {['44:00', '40:00', '36:00'].map((target) => (
              <button
                key={target}
                onClick={() => setWeeklyTarget(target)}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  weeklyTarget === target
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {target.replace(':00', ' Horas')}
              </button>
            ))}
            <div className="flex items-center gap-1 bg-white border border-neutral-300 px-2 py-1 rounded-lg">
              <span className="text-xs text-neutral-500">Outro:</span>
              <input
                type="text"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(e.target.value)}
                className="w-14 font-mono font-bold text-xs outline-none text-center"
                placeholder="44:00"
                aria-label="Carga horária semanal em horas"
              />
            </div>
          </div>
        </div>

        {/* Quick Fill Presets */}
        <div className="pt-2 border-t border-neutral-200/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Preenchimento Rápido:
          </span>
          <button
            onClick={loadPreset44hWeekdays}
            className="bg-white hover:bg-blue-50 hover:border-blue-300 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg transition-colors font-semibold flex items-center gap-1 cursor-pointer"
            title="8h48m por dia de segunda a sexta (44h)"
          >
            ⚡ 44h Seg-Sex (8h48m)
          </button>
          <button
            onClick={loadPreset44hWithSaturday}
            className="bg-white hover:bg-blue-50 hover:border-blue-300 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg transition-colors font-semibold flex items-center gap-1 cursor-pointer"
            title="8h de segunda a sexta + 4h no sábado (44h)"
          >
            ⚡ 44h Seg-Sáb (8h + 4h)
          </button>
          <button
            onClick={loadPreset40hWeekdays}
            className="bg-white hover:bg-blue-50 hover:border-blue-300 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg transition-colors font-semibold flex items-center gap-1 cursor-pointer"
            title="8h por dia de segunda a sexta (40h)"
          >
            ⚡ 40h Seg-Sex (8h)
          </button>
        </div>
      </div>

      {/* CLT Legal Compliance Check Banner */}
      <CLTAlertBanner
        totalMinutes={totalMinutes}
        overtimeMinutes={diffMinutes > 0 ? diffMinutes : 0}
      />

      <div className="space-y-3 mb-6">
        {/* Table Headers */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <div className="col-span-3">Dia / Data</div>
          <div className="col-span-2">Entrada</div>
          <div className="col-span-2">Saída</div>
          <div className="col-span-2">Intervalo</div>
          <div className="col-span-2 text-right">Total Horas</div>
          <div className="col-span-1"></div>
        </div>

        {entries.map(entry => {
          const breakMin = timeToMinutes(entry.breakTime);
          const min = calculateDuration(entry.start, entry.end, undefined, undefined, breakMin);
          const grossMin = calculateDuration(entry.start, entry.end);

          // CLT Article 71 warning check: shift > 6h requires >= 1h break (60 mins)
          const needsOneHourBreak = grossMin > 360 && breakMin < 60;

          return (
            <div key={entry.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white sm:bg-neutral-50/50 border border-neutral-200 sm:border-neutral-200 p-3.5 sm:p-2 rounded-xl group hover:border-blue-300 transition-colors">
              <div className="col-span-1 sm:col-span-3">
                <label className="sm:hidden text-xs font-semibold text-neutral-500 mb-1 block">Dia / Data</label>
                <input type="text" value={entry.date} onChange={e => updateEntry(entry.id, 'date', e.target.value)} placeholder="Ex: Segunda" aria-label={`Dia da semana para linha ${entry.id}`} className="w-full border border-neutral-300 bg-white rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-shadow" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                 <label className="sm:hidden text-xs font-semibold text-neutral-500 mb-1 block">Entrada</label>
                 <input type="time" value={entry.start} onChange={e => updateEntry(entry.id, 'start', e.target.value)} aria-label={`Horário de entrada para ${entry.date || 'linha ' + entry.id}`} className="w-full border border-neutral-300 bg-white rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-shadow" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="sm:hidden text-xs font-semibold text-neutral-500 mb-1 block">Saída</label>
                <input type="time" value={entry.end} onChange={e => updateEntry(entry.id, 'end', e.target.value)} aria-label={`Horário de saída para ${entry.date || 'linha ' + entry.id}`} className="w-full border border-neutral-300 bg-white rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-shadow" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="sm:hidden text-xs font-semibold text-neutral-500 mb-1 block">Intervalo</label>
                <input type="time" value={entry.breakTime} onChange={e => updateEntry(entry.id, 'breakTime', e.target.value)} aria-label={`Duração do intervalo para ${entry.date || 'linha ' + entry.id}`} className="w-full border border-neutral-300 bg-white rounded-lg p-2 text-sm outline-none focus:border-blue-500 transition-shadow" />
                {needsOneHourBreak && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-1 flex items-center gap-1 inline-block" title="Art. 71 CLT: Jornada acima de 6h exige mínimo de 1h de almoço">
                    <AlertCircle className="w-3 h-3 inline text-amber-600" /> Intervalo &lt; 1h
                  </span>
                )}
              </div>
              <div className="col-span-1 sm:col-span-2 sm:text-right font-mono font-bold text-neutral-800 text-sm">
                <span className="sm:hidden text-xs text-neutral-500 mr-2 font-normal">Total:</span>
                {minutesToTime(min)}
              </div>
              <div className="col-span-1 flex sm:justify-end mt-2 sm:mt-0">
                <button onClick={() => removeEntry(entry.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors w-full sm:w-auto flex items-center justify-center rounded-lg hover:bg-neutral-100" title="Remover dia">
                  <Trash2 className="w-4 h-4" />
                  <span className="sm:hidden text-xs ml-2">Excluir dia</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <button onClick={addEntry} className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Adicionar mais um dia
        </button>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button onClick={exportCSV} className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar Excel (.csv)
          </button>
          <button onClick={copySummary} className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />} Copiar Resumo
          </button>
          <button onClick={printReport} className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-2.5 rounded-xl transition-colors cursor-pointer">
            <Printer className="w-3.5 h-3.5 text-neutral-600" /> Imprimir
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-semibold">Total Trabalhado</p>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-blue-400">{minutesToTime(totalMinutes)} h</div>
          </div>
          <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-neutral-300" />
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-semibold">Carga Contratual</p>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-800">{weeklyTarget} h</div>
          </div>
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-neutral-600" />
          </div>
        </div>

        <div className={`rounded-2xl p-5 border flex items-center justify-between shadow-xs ${
          isOvertime
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : isDeficit
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">
              {isOvertime ? 'Horas Extras Semanal' : isDeficit ? 'Horas Negativas' : 'Status da Carga'}
            </p>
            <div className="text-3xl font-extrabold font-mono">
              {isOvertime ? `+${minutesToTime(diffMinutes)}` : isDeficit ? `-${minutesToTime(Math.abs(diffMinutes))}` : 'Exacto'}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isOvertime ? 'bg-emerald-100 text-emerald-700' : isDeficit ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isOvertime ? <CheckCircle2 className="w-5 h-5" /> : isDeficit ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="timesheet" onSelectTab={onSelectTab} />}

      <ShiftTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
}


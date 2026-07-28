import { useState, useEffect } from 'react';
import { calculateDuration, minutesToTime, timeToMinutes } from '../utils/time';
import { Clock, AlertCircle, Copy, Check, Info, Printer, RotateCcw, Sparkles } from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';
import CLTAlertBanner from './CLTAlertBanner';

interface DailyCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function DailyCalculator({ onSelectTab }: DailyCalculatorProps) {
  const [mode, setMode] = useState<'4points' | 'simple'>(() => {
    return (localStorage.getItem('calc_daily_mode') as '4points' | 'simple') || '4points';
  });
  
  // Mode 4 points
  const [in1, setIn1] = useState(() => localStorage.getItem('calc_daily_in1') || '08:00');
  const [out1, setOut1] = useState(() => localStorage.getItem('calc_daily_out1') || '12:00');
  const [in2, setIn2] = useState(() => localStorage.getItem('calc_daily_in2') || '13:00');
  const [out2, setOut2] = useState(() => localStorage.getItem('calc_daily_out2') || '18:00');

  // Mode simple
  const [startSimple, setStartSimple] = useState(() => localStorage.getItem('calc_daily_start') || '08:00');
  const [endSimple, setEndSimple] = useState(() => localStorage.getItem('calc_daily_end') || '18:00');
  const [breakTimeSimple, setBreakTimeSimple] = useState(() => localStorage.getItem('calc_daily_break') || '01:00');

  // Daily target
  const [dailyTarget, setDailyTarget] = useState(() => localStorage.getItem('calc_daily_target') || '08:00');
  const [copied, setCopied] = useState(false);

  // Hourly Rate & Financial Estimation
  const [hourlyWage, setHourlyWage] = useState(() => localStorage.getItem('calc_daily_rate') || '');
  const [overtimePercent, setOvertimePercent] = useState('50');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('calc_daily_mode', mode);
    localStorage.setItem('calc_daily_in1', in1);
    localStorage.setItem('calc_daily_out1', out1);
    localStorage.setItem('calc_daily_in2', in2);
    localStorage.setItem('calc_daily_out2', out2);
    localStorage.setItem('calc_daily_start', startSimple);
    localStorage.setItem('calc_daily_end', endSimple);
    localStorage.setItem('calc_daily_break', breakTimeSimple);
    localStorage.setItem('calc_daily_target', dailyTarget);
    localStorage.setItem('calc_daily_rate', hourlyWage);
  }, [mode, in1, out1, in2, out2, startSimple, endSimple, breakTimeSimple, dailyTarget, hourlyWage]);

  const fillExampleDaily = () => {
    setMode('4points');
    setIn1('08:00');
    setOut1('12:00');
    setIn2('13:00');
    setOut2('18:00');
    setDailyTarget('08:00');
  };

  const handleReset = () => {
    setMode('4points');
    setIn1('08:00');
    setOut1('12:00');
    setIn2('13:00');
    setOut2('18:00');
    setStartSimple('08:00');
    setEndSimple('18:00');
    setBreakTimeSimple('01:00');
    setDailyTarget('08:00');
  };

  let totalMin = 0;
  let intervalMin = 0;

  if (mode === '4points') {
    const shift1 = calculateDuration(in1, out1);
    const shift2 = calculateDuration(in2, out2);
    intervalMin = calculateDuration(out1, in2);
    totalMin = shift1 + shift2;
  } else {
    intervalMin = timeToMinutes(breakTimeSimple);
    totalMin = calculateDuration(startSimple, endSimple, undefined, undefined, intervalMin);
  }

  const targetMin = timeToMinutes(dailyTarget);
  const overtimeMin = Math.max(0, totalMin - targetMin);
  const totalFormatted = minutesToTime(totalMin);
  const overtimeFormatted = minutesToTime(overtimeMin);
  const intervalFormatted = minutesToTime(intervalMin);

  // CLT Warning: If worked > 6h, interval should be at least 1h (60m)
  const showIntervalWarning = totalMin > 360 && intervalMin < 60;

  // Financial calculations
  const wageVal = parseFloat(hourlyWage) || 0;
  const normalHoursCount = Math.min(totalMin, targetMin) / 60;
  const overtimeHoursCount = overtimeMin / 60;
  const otMultiplier = 1 + (parseFloat(overtimePercent) || 50) / 100;
  const normalEarned = normalHoursCount * wageVal;
  const overtimeEarned = overtimeHoursCount * wageVal * otMultiplier;
  const totalEarned = normalEarned + overtimeEarned;

  const copyResult = () => {
    let text = `Cálculo de Horas Trabalhadas (CLT):\nTotal de Horas: ${totalFormatted}\nIntervalo: ${intervalFormatted}\nHoras Extras: ${overtimeFormatted}`;
    if (wageVal > 0) {
      text += `\nValor Estimado do Dia: R$ ${totalEarned.toFixed(2)} (Normal: R$ ${normalEarned.toFixed(2)} | Extra: R$ ${overtimeEarned.toFixed(2)})`;
    }
    text += `\nCalculado via calculadoradehorastrabalhadas.org`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-800/60 p-3 rounded-xl mb-5 no-print">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>💾 Salvamento automático ativo em tempo real</span>
          <span className="text-blue-700 dark:text-blue-300 font-normal hidden md:inline">(Tudo o que você digita fica salvo no seu navegador)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={copyResult} className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 px-2.5 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer shadow-2xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />} {copied ? 'Copiado!' : 'Copiar Resultado'}
          </button>
          <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer shadow-2xs">
            <Printer className="w-3.5 h-3.5 text-white" /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Calculadora de Horas Trabalhadas Diária</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            Calcule o total de horas trabalhadas no dia com batida de ponto e intervalo de almoço.
          </p>
        </div>

        {/* Toggle Mode & Print */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto no-print">
          <button
            onClick={fillExampleDaily}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Preencher Exemplo
          </button>
          <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setMode('4points')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                mode === '4points' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              4 Batidas (Ponto)
            </button>
            <button
              onClick={() => setMode('simple')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                mode === 'simple' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Entrada / Saída
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Imprimir / Salvar PDF"
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            title="Restaurar padrões"
            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick presets for common shifts */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs no-print">
        <span className="font-semibold text-neutral-500 dark:text-neutral-400">Atalhos de Turnos:</span>
        <button
          onClick={() => {
            setMode('4points');
            setIn1('08:00');
            setOut1('12:00');
            setIn2('13:00');
            setOut2('18:00');
          }}
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium"
        >
          Comercial 8h às 18h (1h almoço)
        </button>
        <button
          onClick={() => {
            setMode('4points');
            setIn1('08:00');
            setOut1('12:00');
            setIn2('13:00');
            setOut2('17:48');
            setDailyTarget('08:48');
          }}
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium"
        >
          CLT 44h 2ª a 6ª (8h48m)
        </button>
        <button
          onClick={() => {
            setMode('4points');
            setIn1('07:00');
            setOut1('12:00');
            setIn2('13:00');
            setOut2('16:00');
          }}
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium"
        >
          Manhã 7h às 16h
        </button>
      </div>

      {/* Target & Hourly Wage selector */}
      <div className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            Meta de Jornada Diária (CLT):
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDailyTarget('08:00')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                dailyTarget === '08:00'
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold'
                  : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              8h (2ª a Sábado)
            </button>
            <button
              type="button"
              onClick={() => setDailyTarget('08:48')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                dailyTarget === '08:48'
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold'
                  : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              8h48m (2ª a 6ª sem Sábado)
            </button>
          </div>
        </div>

        <div>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Estimativa Financeira em Reais (Opcional):
          </span>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-xs">R$</span>
              <input
                id="daily-hourly-wage"
                aria-label="Valor da hora trabalhada em reais"
                type="number"
                inputMode="decimal"
                step="0.5"
                value={hourlyWage}
                onChange={e => setHourlyWage(e.target.value)}
                placeholder="Valor/Hora (Ex: 20.00)"
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-1.5 pl-8 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
            <select
              id="daily-overtime-percent"
              aria-label="Percentual de hora extra"
              value={overtimePercent}
              onChange={e => setOvertimePercent(e.target.value)}
              className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="50">+50% HE</option>
              <option value="100">+100% HE</option>
            </select>
          </div>
        </div>
      </div>

      {mode === '4points' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="daily-in1" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Entrada 1 (Manhã)</label>
            <input
              id="daily-in1"
              aria-label="Entrada 1 (Manhã)"
              type="time"
              value={in1}
              onChange={(e) => setIn1(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="daily-out1" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Saída 1 (Almoço)</label>
            <input
              id="daily-out1"
              aria-label="Saída 1 (Almoço)"
              type="time"
              value={out1}
              onChange={(e) => setOut1(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="daily-in2" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Entrada 2 (Retorno)</label>
            <input
              id="daily-in2"
              aria-label="Entrada 2 (Retorno)"
              type="time"
              value={in2}
              onChange={(e) => setIn2(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="daily-out2" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Saída 2 (Fim)</label>
            <input
              id="daily-out2"
              aria-label="Saída 2 (Fim)"
              type="time"
              value={out2}
              onChange={(e) => setOut2(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="daily-start-simple" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Hora de Entrada</label>
            <input
              id="daily-start-simple"
              aria-label="Hora de Entrada"
              type="time"
              value={startSimple}
              onChange={(e) => setStartSimple(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="daily-end-simple" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Hora de Saída</label>
            <input
              id="daily-end-simple"
              aria-label="Hora de Saída"
              type="time"
              value={endSimple}
              onChange={(e) => setEndSimple(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="daily-break-simple" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Duração do Intervalo</label>
            <input
              id="daily-break-simple"
              aria-label="Duração do Intervalo"
              type="time"
              value={breakTimeSimple}
              onChange={(e) => setBreakTimeSimple(e.target.value)}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* CLT Legal Compliance Check Banner */}
      <CLTAlertBanner
        totalMinutes={totalMin}
        overtimeMinutes={overtimeMin}
      />

      {/* Warnings */}
      {showIntervalWarning && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Atenção CLT (Art. 71):</strong> Para jornadas superiores a 6 horas diárias, é obrigatória a concessão de um intervalo de no mínimo 1 hora.
          </span>
        </div>
      )}

      {/* Results Card */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-700">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wider">Total Trabalhado</p>
            <div className="text-3xl font-extrabold font-mono text-blue-400">{totalFormatted}</div>
            <p className="text-xs text-neutral-400 mt-1">Horas efetivas no dia</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <p className="text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wider">Intervalo Almoço</p>
            <div className="text-2xl font-bold font-mono text-neutral-200">{intervalFormatted}</div>
            <p className="text-xs text-neutral-400 mt-1">Pausa / Descanso</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <p className="text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wider">Horas Extras (+)</p>
            <div className="text-2xl font-bold font-mono text-emerald-400">{overtimeFormatted}</div>
            <p className="text-xs text-neutral-400 mt-1">Excedente da meta ({dailyTarget})</p>
          </div>
        </div>

        {wageVal > 0 && (
          <div className="bg-neutral-800/80 p-4 rounded-xl border border-neutral-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-neutral-400 block font-semibold">Valor Estimado do Dia Trabalhado:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">
                R$ {totalEarned.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="text-neutral-300 font-mono text-right space-y-0.5 text-[11px]">
              <div>Jornada Normal: R$ {normalEarned.toFixed(2).replace('.', ',')} ({normalHoursCount.toFixed(2)}h)</div>
              {overtimeEarned > 0 && (
                <div className="text-emerald-300 font-bold">
                  Horas Extras (+{overtimePercent}%): R$ {overtimeEarned.toFixed(2).replace('.', ',')} ({overtimeHoursCount.toFixed(2)}h)
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 no-print">
          <button
            onClick={copyResult}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-neutral-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Resultado Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-400" />
                Copiar Resumo do Dia
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="daily" onSelectTab={onSelectTab} />}
    </div>
  );
}


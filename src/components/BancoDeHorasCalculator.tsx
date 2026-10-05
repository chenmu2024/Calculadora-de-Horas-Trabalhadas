import { bankBalance } from '../utils/conversions';
import { storage, copyText as writeClipboard, nonNegative } from '../utils/browser';
import React, { useState, useEffect } from 'react';
import { Scale, ArrowUpRight, ArrowDownRight, Clock, Info, Plus, Trash2, Download, Copy, Check, Printer, AlertTriangle, Calendar, Sparkles } from 'lucide-react';
import { timeToMinutes, minutesToTime, isValidTime } from '../utils/time';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';
import CLTAlertBanner from './CLTAlertBanner';

interface BankLogEntry {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit'; // credit = extra hours worked, debit = hours compensated/taken off/late
  hours: string; // "02:00"
}

interface BancoDeHorasCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function BancoDeHorasCalculator({ onSelectTab }: BancoDeHorasCalculatorProps) {
  const [activeMode, setActiveMode] = useState<'quick' | 'ledger'>('quick');

  // Quick Daily Calculator state
  const [expectedHours, setExpectedHours] = useState(() => storage.getItem('calc_bank_exph') || '08');
  const [expectedMinutes, setExpectedMinutes] = useState(() => storage.getItem('calc_bank_expm') || '48');
  const [actualHours, setActualHours] = useState(() => storage.getItem('calc_bank_acth') || '09');
  const [actualMinutes, setActualMinutes] = useState(() => storage.getItem('calc_bank_actm') || '30');
  const [applyCLTTolerance, setApplyCLTTolerance] = useState(() => storage.getItem('calc_bank_tol') === 'true');

  // Financial & Rate state
  const [hourlyWage, setHourlyWage] = useState(() => storage.getItem('calc_bank_wage') || '15.00');
  const [overtimePercentage, setOvertimePercentage] = useState(() => storage.getItem('calc_bank_pct') || '50');
  const [agreementTerm, setAgreementTerm] = useState<'6m' | '12m'>(() => (storage.getItem('calc_bank_term') as any) || '6m');

  // Ledger state (Acumulado)
  const [initialBalanceSign, setInitialBalanceSign] = useState<'+' | '-'>(() => (storage.getItem('calc_bank_initsign') as any) || '+');
  const [initialBalanceHours, setInitialBalanceHours] = useState(() => storage.getItem('calc_bank_inith') || '10');
  const [initialBalanceMinutes, setInitialBalanceMinutes] = useState(() => storage.getItem('calc_bank_initm') || '00');

  const [logs, setLogs] = useState<BankLogEntry[]>(() => {
    const saved = storage.getItem('calc_bank_logs');
    if (saved) {
      try { const rows = JSON.parse(saved); if (Array.isArray(rows) && rows.length <= 1000 && rows.every(row => row && typeof row.id === 'string' && typeof row.date === 'string' && typeof row.description === 'string' && ['credit', 'debit'].includes(row.type) && isValidTime(row.hours, true))) return rows; } catch (e) {}
    }
    return [
      { id: '1', date: '2026-07-20', description: 'Hora extra no projeto', type: 'credit', hours: '02:00' },
      { id: '2', date: '2026-07-21', description: 'Saída antecipada (Médico)', type: 'debit', hours: '01:30' },
      { id: '3', date: '2026-07-22', description: 'Trabalho no sábado', type: 'credit', hours: '04:00' },
      { id: '4', date: '2026-07-24', description: 'Folga compensatória da tarde', type: 'debit', hours: '04:00' },
    ];
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    storage.setItem('calc_bank_exph', expectedHours);
    storage.setItem('calc_bank_expm', expectedMinutes);
    storage.setItem('calc_bank_acth', actualHours);
    storage.setItem('calc_bank_actm', actualMinutes);
    storage.setItem('calc_bank_tol', String(applyCLTTolerance));
    storage.setItem('calc_bank_wage', hourlyWage);
    storage.setItem('calc_bank_pct', overtimePercentage);
    storage.setItem('calc_bank_term', agreementTerm);
    storage.setItem('calc_bank_initsign', initialBalanceSign);
    storage.setItem('calc_bank_inith', initialBalanceHours);
    storage.setItem('calc_bank_initm', initialBalanceMinutes);
    storage.setItem('calc_bank_logs', JSON.stringify(logs));
  }, [expectedHours, expectedMinutes, actualHours, actualMinutes, applyCLTTolerance, hourlyWage, overtimePercentage, agreementTerm, initialBalanceSign, initialBalanceHours, initialBalanceMinutes, logs]);

  const validPart = (value: string, minutes = false) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && (!minutes || Number(value) < 60);
  const quickValid = validPart(expectedHours) && validPart(expectedMinutes,true) && validPart(actualHours) && validPart(actualMinutes,true);
  const ledgerValid = validPart(initialBalanceHours) && validPart(initialBalanceMinutes,true) && logs.every(log => isValidTime(log.hours,true));
  const validBalance = activeMode === 'ledger' ? ledgerValid : quickValid;
  // Quick mode calculation
  const expectedMin = (nonNegative(expectedHours, 0)) * 60 + (nonNegative(expectedMinutes, 0));
  const actualMin = (nonNegative(actualHours, 0)) * 60 + (nonNegative(actualMinutes, 0));
  let rawDiffMin = bankBalance(actualMin, expectedMin) ?? 0;

  // Art 58 § 1º CLT Tolerance: variation <= 10 mins per day is disregarded
  let quickDiffMin = rawDiffMin;
  let isTolerated = false;
  if (applyCLTTolerance && Math.abs(rawDiffMin) <= 10) {
    quickDiffMin = 0;
    isTolerated = rawDiffMin !== 0;
  }

  const isQuickPositive = quickDiffMin >= 0;
  const absQuickDiffMin = Math.abs(quickDiffMin);
  const quickDiffFormatted = minutesToTime(absQuickDiffMin);

  const wage = nonNegative(hourlyWage, 0);
  const otPct = nonNegative(overtimePercentage, 50);
  const quickHoursDecimal = absQuickDiffMin / 60;
  const hourlyRateMultiplier = 1 + (otPct / 100);
  const quickFinancialImpact = isQuickPositive
    ? quickHoursDecimal * wage * hourlyRateMultiplier
    : quickHoursDecimal * wage;

  // Ledger calculation
  const initialMin = ((nonNegative(initialBalanceHours, 0)) * 60 + (nonNegative(initialBalanceMinutes, 0))) * (initialBalanceSign === '+' ? 1 : -1);

  const totalCreditLogsMin = logs.filter(l => l.type === 'credit').reduce((acc, log) => acc + timeToMinutes(log.hours), 0);
  const totalDebitLogsMin = logs.filter(l => l.type === 'debit').reduce((acc, log) => acc + timeToMinutes(log.hours), 0);

  const totalCreditsMin = (initialMin > 0 ? initialMin : 0) + totalCreditLogsMin;
  const totalDebitsMin = (initialMin < 0 ? Math.abs(initialMin) : 0) + totalDebitLogsMin;

  const totalLedgerMin = initialMin + (totalCreditLogsMin - totalDebitLogsMin);
  const isLedgerPositive = totalLedgerMin >= 0;
  const absLedgerMin = Math.abs(totalLedgerMin);
  const ledgerFormatted = minutesToTime(absLedgerMin);

  const ledgerHoursDecimal = absLedgerMin / 60;
  const ledgerFinancialImpact = isLedgerPositive
    ? ledgerHoursDecimal * wage * hourlyRateMultiplier
    : ledgerHoursDecimal * wage;

  // Ledger management
  const clearLogs = () => {
    if (confirm('Deseja realmente limpar todos os lançamentos do banco de horas?')) {
      setLogs([]);
    }
  };

  const addLog = (type: 'credit' | 'debit', defaultDesc = '', defaultHours = '01:00') => {
    const today = new Date().toISOString().split('T')[0];
    setLogs([
      ...logs,
      {
        id: Math.random().toString(),
        date: today,
        description: defaultDesc || (type === 'credit' ? 'Hora Extra' : 'Folga / Compensação'),
        type,
        hours: defaultHours,
      }
    ]);
  };

  const updateLog = (id: string, field: keyof BankLogEntry, value: string) => {
    setLogs(logs.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const fillExampleBanco = () => {
    setActiveMode('ledger');
    setHourlyWage('25.00');
    setOvertimePercentage('50');
    setInitialBalanceSign('+');
    setInitialBalanceHours('05');
    setInitialBalanceMinutes('30');
    setLogs([
      { id: '1', date: '2026-07-20', description: 'Hora extra lançamento fiscal', type: 'credit', hours: '02:30' },
      { id: '2', date: '2026-07-21', description: 'Folga compensatória (Tarde)', type: 'debit', hours: '04:00' },
      { id: '3', date: '2026-07-22', description: 'Atendimento emergencial de suporte', type: 'credit', hours: '03:15' },
      { id: '4', date: '2026-07-24', description: 'Saída antecipada para consulta', type: 'debit', hours: '01:15' },
    ]);
  };

  const copyLedgerSummary = async () => {
    if (!validBalance) return;
    const currentModeText = activeMode === 'ledger'
      ? `EXTRATO DE BANCO DE HORAS ACUMULADO:\nSaldo Inicial: ${initialBalanceSign}${initialBalanceHours}:${initialBalanceMinutes}\nTotal de Lançamentos: ${logs.length}\nSALDO FINAL: ${isLedgerPositive ? '+' : '-'}${ledgerFormatted} h\nValor Estimado de Quitação: R$ ${ledgerValid ? ledgerFinancialImpact.toFixed(2).replace(".",",") : "—"}`
      : `APURAÇÃO DIÁRIA DE BANCO DE HORAS:\nJornada Esperada: ${expectedHours}:${expectedMinutes}\nRealizado: ${actualHours}:${actualMinutes}\nSaldo do Dia: ${isQuickPositive ? '+' : '-'}${quickDiffFormatted} h\nValor Estimado: R$ ${quickValid ? quickFinancialImpact.toFixed(2).replace(".",",") : "—"}`;

    if (!await writeClipboard(`${currentModeText}\n\nCalculado em calculadoradehorastrabalhadas.org`)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    if (!validBalance) return;
    if (activeMode === 'ledger') {
      generateTimesheetCSV(
        logs.map(l => ({
          date: l.date,
          start: l.description,
          end: l.type === 'credit' ? 'Crédito (+)' : 'Débito (-)',
          breakTime: '-',
          totalHours: `${l.type === 'credit' ? '+' : '-'}${l.hours}`
        })),
        'Extrato Banco de Horas'
      );
    } else {
      generateTimesheetCSV([
        {
          date: 'Apuração Diária',
          start: `${expectedHours}:${expectedMinutes}`,
          end: `${actualHours}:${actualMinutes}`,
          breakTime: applyCLTTolerance ? 'Tol. CLT' : 'Sem Tol.',
          totalHours: `${isQuickPositive ? '+' : '-'}${quickDiffFormatted}`
        }
      ], 'Calculo Diario Banco de Horas');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Calculadora de Banco de Horas (Saldo Positivo / Negativo)</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            Controle o saldo de horas acumulado, folgas compensatórias e tolerância do ponto conforme o Art. 58 e 59 da CLT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fillExampleBanco}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Preencher Exemplo
          </button>
          {/* Mode Selector */}
          <div className="bg-neutral-100 p-1 rounded-xl flex text-xs font-semibold">
            <button
              onClick={() => setActiveMode('ledger')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMode === 'ledger' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Extrato Acumulado (Multi-Dias)
            </button>
            <button
              onClick={() => setActiveMode('quick')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMode === 'quick' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Simulador Diário Rápido
            </button>
          </div>
        </div>
      </div>

      {activeMode === 'quick' ? (
        /* Quick Mode UI */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <label htmlFor="banco-expected-hours" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Jornada Esperada (Meta Contratual)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="banco-expected-hours"
                  aria-label="Horas esperadas na jornada"
                  type="number" min="0" inputMode="decimal"
                  value={expectedHours}
                  onChange={(e) => setExpectedHours(e.target.value)}
                  className="w-1/2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Horas"
                />
                <span className="font-bold text-neutral-400">:</span>
                <input
                  id="banco-expected-minutes"
                  aria-label="Minutos esperados na jornada"
                  type="number" min="0" inputMode="decimal"
                  value={expectedMinutes}
                  onChange={(e) => setExpectedMinutes(e.target.value)}
                  className="w-1/2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minutos"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Ex: 08:48 para 44h semanais de 2ª a 6ª.
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <label htmlFor="banco-actual-hours" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Horas Realmente Trabalhadas
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="banco-actual-hours"
                  aria-label="Horas realmente trabalhadas"
                  type="number" min="0" inputMode="decimal"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  className="w-1/2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Horas"
                />
                <span className="font-bold text-neutral-400">:</span>
                <input
                  id="banco-actual-minutes"
                  aria-label="Minutos realmente trabalhados"
                  type="number" min="0" inputMode="decimal"
                  value={actualMinutes}
                  onChange={(e) => setActualMinutes(e.target.value)}
                  className="w-1/2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minutos"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Total de horas registradas no ponto no dia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900">
            <input
              type="checkbox"
              id="tolCLT"
              checked={applyCLTTolerance}
              onChange={(e) => setApplyCLTTolerance(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="tolCLT" className="cursor-pointer font-medium">
              Aplicar Tolerância Legal da CLT (Art. 58 § 1º) — Confirmo variações de até 5 minutos por batida e até 10 minutos no dia, sem compensações entre batidas.
            </label>
          </div>

          {isTolerated && (
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Diferença apurada foi de {rawDiffMin > 0 ? `+${rawDiffMin}` : rawDiffMin} min. Saldo desconsiderado conforme as condições por batida que você confirmou.</span>
            </div>
          )}

          <CLTAlertBanner
            totalMinutes={actualMin}
            overtimeMinutes={isQuickPositive ? quickDiffMin : 0}
          />

          {!quickValid && <p role="alert">Informe horas inteiras e minutos de 00 a 59.</p>}
          {/* Results Box Quick */}
          <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {isQuickPositive ? 'Saldo Positivo no Dia (Crédito)' : 'Saldo Negativo no Dia (Atraso/Débito)'}
                </span>
                <div className={`text-4xl font-extrabold font-mono mt-1 flex items-center gap-2 ${isQuickPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isQuickPositive ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                  {quickValid ? `${isQuickPositive ? '+' : '-'}${quickDiffFormatted} h` : '—'}
                </div>
              </div>
              <Scale className="w-10 h-10 text-neutral-700 dark:text-neutral-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-800/80 p-3.5 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block mb-1">Equivalência em Horas Decimais</span>
                <span className="text-lg font-bold font-mono text-white">
                  {quickValid ? quickHoursDecimal.toFixed(2) : "—"} hrs
                </span>
              </div>
              <div className="bg-neutral-800/80 p-3.5 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block mb-1">
                  {isQuickPositive ? 'Valor Estimado para Quitação' : 'Valor Estimado de Desconto'}
                </span>
                <span className={`text-lg font-bold font-mono ${isQuickPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {quickFinancialImpact.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
          {quickValid && <details open className="tool-card"><summary>Memória de cálculo</summary><p>{minutesToTime(actualMin)} − {minutesToTime(expectedMin)} = {rawDiffMin >= 0 ? '+' : '-'}{minutesToTime(Math.abs(rawDiffMin))}</p><p>Horas a compensar: {minutesToTime(Math.max(0, -rawDiffMin))}.</p></details>}
        </div>
      ) : (
        /* Ledger Mode UI */
        <div className="space-y-6">
          {/* Initial Balance bar */}
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block mb-1">
                Saldo Inicial Anterior (Banco de Horas)
              </span>
              <p className="text-xs text-neutral-500">Informe o saldo acumulado que você já possui de meses anteriores.</p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <select
                value={initialBalanceSign}
                onChange={(e) => setInitialBalanceSign(e.target.value as '+' | '-')}
                className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 font-bold text-sm rounded-lg p-2.5 outline-none"
              >
                <option value="+">Crédito (+)</option>
                <option value="-">Débito (-)</option>
              </select>

              <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg p-1.5">
                <input
                  type="number" min="0" inputMode="decimal"
                  value={initialBalanceHours}
                  onChange={(e) => setInitialBalanceHours(e.target.value)}
                  className="w-12 font-mono font-bold text-sm text-center outline-none"
                  placeholder="00"
                />
                <span className="font-bold text-neutral-400">:</span>
                <input
                  type="number" min="0" inputMode="decimal"
                  value={initialBalanceMinutes}
                  onChange={(e) => setInitialBalanceMinutes(e.target.value)}
                  className="w-12 font-mono font-bold text-sm text-center outline-none"
                  placeholder="00"
                />
              </div>
            </div>
          </div>

          {/* Quick presets for adding logs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Lançamentos do Banco de Horas:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addLog('credit', 'Hora Extra Trabalhada', '02:00')}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Crédito (Horas Extras)
              </button>
              <button
                onClick={() => addLog('debit', 'Folga Compensatória', '08:00')}
                className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> - Débito (Folga Fruída)
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 rounded-xl hover:border-blue-300 transition-colors">
                <div className="col-span-1 sm:col-span-3">
                  <input
                    type="date"
                    value={log.date}
                    onChange={(e) => updateLog(log.id, 'date', e.target.value)}
                    className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2 text-xs outline-none"
                  />
                </div>
                <div className="col-span-1 sm:col-span-4">
                  <input
                    type="text"
                    value={log.description}
                    onChange={(e) => updateLog(log.id, 'description', e.target.value)}
                    className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2 text-xs outline-none"
                    placeholder="Descrição / Motivo"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <select
                    value={log.type}
                    onChange={(e) => updateLog(log.id, 'type', e.target.value as 'credit' | 'debit')}
                    className={`w-full border rounded-lg p-2 text-xs font-bold outline-none cursor-pointer ${
                      log.type === 'credit' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-rose-300 bg-rose-50 text-rose-800'
                    }`}
                  >
                    <option value="credit">Crédito (+)</option>
                    <option value="debit">Débito (-)</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                  <input
                    type="time"
                    value={log.hours}
                    onChange={(e) => updateLog(log.id, 'hours', e.target.value)}
                    className="w-full border border-neutral-300 dark:border-neutral-600 font-mono font-bold text-center rounded-lg p-2 text-xs outline-none"
                  />
                  <button
                    onClick={() => removeLog(log.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir Lançamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => addLog('credit')}
                className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Adicionar Lançamento
              </button>
              {logs.length > 0 && (
                <button
                  onClick={clearLogs}
                  className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  title="Limpar todos os lançamentos"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Limpar Tudo
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={exportCSV} className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar CSV
              </button>
              <button onClick={copyLedgerSummary} className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />} Copiar Resumo
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
                <Printer className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" /> Imprimir
              </button>
            </div>
          </div>

          {/* Ledger Result Card with Breakdown */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {isLedgerPositive ? 'Saldo Final Acumulado (Crédito a Favor do Empregado)' : 'Saldo Final Acumulado (Débito - Horas a Compensar)'}
                </span>
                <div className={`text-4xl font-extrabold font-mono mt-1 flex items-center gap-2 ${isLedgerPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isLedgerPositive ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                  {ledgerValid ? `${isLedgerPositive ? '+' : '-'}${ledgerFormatted} h` : '—'}
                </div>
              </div>
              <Scale className="w-10 h-10 text-neutral-700 dark:text-neutral-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block mb-1">Total de Créditos (+)</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  +{minutesToTime(totalCreditsMin)} h
                </span>
              </div>
              <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block mb-1">Total de Débitos (-)</span>
                <span className="text-base font-bold font-mono text-rose-400">
                  -{minutesToTime(totalDebitsMin)} h
                </span>
              </div>
              <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block mb-1">Horas Decimais</span>
                <span className="text-base font-bold font-mono text-white">
                  {ledgerValid ? ledgerHoursDecimal.toFixed(2) : "—"} hrs
                </span>
              </div>
              <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block mb-1">
                  {isLedgerPositive ? 'Valor Quitação (+Adicional)' : 'Valor Desconto'}
                </span>
                <span className={`text-base font-bold font-mono ${isLedgerPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {ledgerFinancialImpact.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
          {ledgerValid && <details open className="tool-card"><summary>Memória de cálculo</summary><p>Saldo inicial {initialBalanceSign}{minutesToTime(Math.abs(initialMin))} + créditos {minutesToTime(totalCreditLogsMin)} − débitos {minutesToTime(totalDebitLogsMin)} = {isLedgerPositive ? "+" : "-"}{ledgerFormatted}.</p><p>Horas a compensar: {minutesToTime(Math.max(0,-totalLedgerMin))}.</p></details>}
        </div>
      )}

      {!validBalance && <p role="alert">Corrija as horas e minutos antes de usar o saldo.</p>}
      <div className="flex flex-wrap gap-3">
        <button className="tool-button" onClick={() => { setExpectedHours(''); setExpectedMinutes(''); setActualHours(''); setActualMinutes(''); setLogs([]); setInitialBalanceHours('0'); setInitialBalanceMinutes('00'); }}>Limpar</button>
        {activeMode === 'quick' && <button className="tool-button" disabled={!quickValid} onClick={copyLedgerSummary}>{copied ? 'Copiado!' : 'Copiar resultado'}</button>}
      </div>
      {/* Hourly rate input, percentage and validity term for financial valuation */}
      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Valor da Hora Normal (R$)</label>
          <input aria-label="Valor da Hora Normal (R$)"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            placeholder="Ex: 15.00"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Adicional para Quitação Rescisória (%)</label>
          <select aria-label="Adicional para Quitação Rescisória (%)"
            value={overtimePercentage}
            onChange={(e) => setOvertimePercentage(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900"
          >
            <option value="50">50% (Dias Úteis Padrão CLT)</option>
            <option value="60">60% (Acordo Coletivo Específico)</option>
            <option value="100">100% (Domingos / Feriados)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Prazo de Validade do Acordo (Art. 59)</label>
          <select aria-label="Prazo de Validade do Acordo (Art. 59)"
            value={agreementTerm}
            onChange={(e) => setAgreementTerm(e.target.value as '6m' | '12m')}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900"
          >
            <option value="6m">6 Meses (Acordo Individual Escrito)</option>
            <option value="12m">12 Meses / 1 Ano (Convenção / Acordo Coletivo)</option>
          </select>
        </div>
      </div>

      {/* Legal Info Box */}
      <div className="mt-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-2.5">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-neutral-800 dark:text-neutral-200">Regras do Banco de Horas (Art. 59 da CLT):</p>
          <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><strong>Acordo Individual Escrito:</strong> Compensação no prazo máximo de <strong>6 meses</strong>.</li>
            <li><strong>Acordo ou Convenção Coletiva:</strong> Compensação no prazo máximo de <strong>1 ano</strong>.</li>
            <li><strong>Rescisão do Contrato:</strong> Se houver saldo positivo de horas no desligamento, a empresa deve pagar as horas não compensadas como horas extras com adicional mínimo de 50%.</li>
          </ul>
        </div>
      </div>


    </div>
  );
}

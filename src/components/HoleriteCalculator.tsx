import { storage, copyText as writeClipboard, nonNegative } from '../utils/browser';
import { MINIMUM_WAGE_2026, INSS_BRACKETS_2026, calculateINSS, calculateIRRFDetails } from '../utils/taxCalculations';
import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, FileText, Info, ShieldCheck, Download, Copy, Check, Printer, ChevronDown, ChevronUp, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { generateTimesheetCSV } from '../utils/excelGenerator';
import InternalLinkCTA from './InternalLinkCTA';
import CLTAlertBanner from './CLTAlertBanner';

interface HoleriteCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function HoleriteCalculator({ onSelectTab }: HoleriteCalculatorProps) {
  const [grossSalary, setGrossSalary] = useState(() => storage.getItem('calc_holerite_gross') || '3000.00');
  const [dependents, setDependents] = useState(() => storage.getItem('calc_holerite_deps') || '0');
  const [alimonyAmount, setAlimonyAmount] = useState(() => storage.getItem('calc_holerite_alimony') || '0');
  const [healthPlanAmount, setHealthPlanAmount] = useState(() => storage.getItem('calc_holerite_health') || '0');
  const [otherDeductions, setOtherDeductions] = useState(() => storage.getItem('calc_holerite_other') || '0');
  const [overtimeAmount, setOvertimeAmount] = useState(() => storage.getItem('calc_holerite_ot') || '0');
  const [nightShiftAmount, setNightShiftAmount] = useState(() => storage.getItem('calc_holerite_night') || '0');

  // Custom simulation percentage
  const [customRaisePct, setCustomRaisePct] = useState('8');

  // DSR on Overtime
  const [includeDSROvertime, setIncludeDSROvertime] = useState(() => storage.getItem('calc_holerite_dsr_ot') === 'true');
  const [workingDays, setWorkingDays] = useState(() => storage.getItem('calc_holerite_wdays') || '25');
  const [sundaysHolidays, setSundaysHolidays] = useState(() => storage.getItem('calc_holerite_sdays') || '5');

  // Unexcused Absences
  const [unexcusedAbsences, setUnexcusedAbsences] = useState(() => storage.getItem('calc_holerite_absences') || '0');

  // VR/VA with 20% max salary cap
  const [foodVoucherAmount, setFoodVoucherAmount] = useState(() => storage.getItem('calc_holerite_vr') || '0');

  // Additional options
  const [hasPericulosidade, setHasPericulosidade] = useState(() => storage.getItem('calc_holerite_peri') === 'true');
  const [insalubridadeGrade, setInsalubridadeGrade] = useState<'none' | '10' | '20' | '40'>(() => (storage.getItem('calc_holerite_insal') as any) || 'none');
  const [deductVT6, setDeductVT6] = useState(() => storage.getItem('calc_holerite_vt') === 'true');
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [copied, setCopied] = useState(false);

  // Persistence
  useEffect(() => {
    storage.setItem('calc_holerite_gross', grossSalary);
    storage.setItem('calc_holerite_deps', dependents);
    storage.setItem('calc_holerite_alimony', alimonyAmount);
    storage.setItem('calc_holerite_health', healthPlanAmount);
    storage.setItem('calc_holerite_other', otherDeductions);
    storage.setItem('calc_holerite_ot', overtimeAmount);
    storage.setItem('calc_holerite_night', nightShiftAmount);
    storage.setItem('calc_holerite_dsr_ot', String(includeDSROvertime));
    storage.setItem('calc_holerite_wdays', workingDays);
    storage.setItem('calc_holerite_sdays', sundaysHolidays);
    storage.setItem('calc_holerite_absences', unexcusedAbsences);
    storage.setItem('calc_holerite_vr', foodVoucherAmount);
    storage.setItem('calc_holerite_peri', String(hasPericulosidade));
    storage.setItem('calc_holerite_insal', insalubridadeGrade);
    storage.setItem('calc_holerite_vt', String(deductVT6));
  }, [grossSalary, dependents, alimonyAmount, healthPlanAmount, otherDeductions, overtimeAmount, nightShiftAmount, includeDSROvertime, workingDays, sundaysHolidays, unexcusedAbsences, foodVoucherAmount, hasPericulosidade, insalubridadeGrade, deductVT6]);

  const minimumWage = MINIMUM_WAGE_2026; // Salário Mínimo 2026

  const baseSalary = nonNegative(grossSalary, 0);
  const deps = nonNegative(dependents, 0);
  const alimony = nonNegative(alimonyAmount, 0);
  const healthPlan = nonNegative(healthPlanAmount, 0);
  const otherDeds = nonNegative(otherDeductions, 0);
  const otVal = nonNegative(overtimeAmount, 0);
  const nightVal = nonNegative(nightShiftAmount, 0);
  const absences = nonNegative(unexcusedAbsences, 0);
  const vrVal = nonNegative(foodVoucherAmount, 0);

  // Absences deduction (1 day = baseSalary / 30) + loss of 1 DSR per missing week
  const dailyRate = baseSalary / 30;
  const absenceDeduction = absences * dailyRate;
  const dsrLossDeduction = absences > 0 ? dailyRate : 0; // Loss of 1 DSR day

  // DSR on Overtime & Night shift: ((Horas Extras + Noturno) / Dias Úteis) * Domingos
  const wDays = nonNegative(workingDays, 25);
  const sDays = nonNegative(sundaysHolidays, 5);
  const dsrOvertimeAmount = includeDSROvertime && wDays > 0 ? ((otVal + nightVal) / wDays) * sDays : 0;

  // Calculate periculosidade (+30% on base salary)
  const periculosidadeAmount = hasPericulosidade ? baseSalary * 0.30 : 0;

  // Calculate insalubridade (% on minimum wage)
  let insalubridadeAmount = 0;
  if (insalubridadeGrade === '10') insalubridadeAmount = minimumWage * 0.10;
  if (insalubridadeGrade === '20') insalubridadeAmount = minimumWage * 0.20;
  if (insalubridadeGrade === '40') insalubridadeAmount = minimumWage * 0.40;

  // VR Deduction (capped at 20% of base salary by Art. 458 CLT)
  const maxVRCap = baseSalary * 0.20;
  const vrDeduction = Math.min(vrVal, maxVRCap);

  // Total Gross Salary
  const totalGross = Math.max(0, baseSalary + otVal + nightVal + dsrOvertimeAmount + periculosidadeAmount + insalubridadeAmount - absenceDeduction - dsrLossDeduction);

  // VT 6% deduction (limited to baseSalary * 0.06)
  const vtDeduction = deductVT6 ? baseSalary * 0.06 : 0;

  // INSS 2026 Progressive Calculation (Tabela Oficial)
  const b1 = INSS_BRACKETS_2026[0].limit; // 7.5%
  const b2 = INSS_BRACKETS_2026[1].limit; // 9%
  const b3 = INSS_BRACKETS_2026[2].limit; // 12%
  const b4 = INSS_BRACKETS_2026[3].limit; // 14% (Teto MAX)

  let inssB1 = 0, inssB2 = 0, inssB3 = 0, inssB4 = 0;
  let inssDeduction = 0;

  if (totalGross > 0) {
    inssB1 = Math.min(totalGross, b1) * 0.075;
    if (totalGross > b1) inssB2 = (Math.min(totalGross, b2) - b1) * 0.09;
    if (totalGross > b2) inssB3 = (Math.min(totalGross, b3) - b2) * 0.12;
    if (totalGross > b3) inssB4 = (Math.min(totalGross, b4) - b3) * 0.14;
    inssDeduction = calculateINSS(totalGross);
  }

  const irrfDetails = calculateIRRFDetails(totalGross, deps, inssDeduction, alimony);
  const dependentDeduction = deps * 189.59;
  const irrfBaseStandard = Math.max(0, totalGross - inssDeduction - dependentDeduction - alimony);
  const irrfBaseSimplified = Math.max(0, totalGross - 607.20);
  const isSimplifiedBetter = irrfDetails.isSimplified;
  const irrfBase = irrfDetails.base;
  const irrfResult = { tax: irrfDetails.tax, rate: irrfDetails.tax === 0 ? 'Isento' : `${irrfDetails.rate * 100}%`, deductible: irrfDetails.deduction };
  const irrfDeduction = irrfDetails.tax;

  const totalDeductions = inssDeduction + irrfDeduction + vtDeduction + vrDeduction + healthPlan + alimony + otherDeds;
  const netSalary = Math.max(0, totalGross - totalDeductions);

  // FGTS (8% paid by employer, not deducted)
  const fgtsEmployer = totalGross * 0.08;

  const copyHolerite = async () => {
    const text = `SIMULAÇÃO DE HOLERITE MENSAL (CLT):
• Salário Base: R$ ${baseSalary.toFixed(2).replace('.', ',')}
${periculosidadeAmount > 0 ? `• Periculosidade (+30%): R$ ${periculosidadeAmount.toFixed(2).replace('.', ',')}\n` : ''}${insalubridadeAmount > 0 ? `• Insalubridade (${insalubridadeGrade}% SM): R$ ${insalubridadeAmount.toFixed(2).replace('.', ',')}\n` : ''}${otVal > 0 ? `• Horas Extras / Adicionais: R$ ${otVal.toFixed(2).replace('.', ',')}\n` : ''}• TOTAL BRUTO: R$ ${totalGross.toFixed(2).replace('.', ',')}

DESCONTOS:
• (-) INSS: R$ ${inssDeduction.toFixed(2).replace('.', ',')}
• (-) IRRF: R$ ${irrfDeduction.toFixed(2).replace('.', ',')} (${irrfResult.rate})
${vtDeduction > 0 ? `• (-) Vale Transporte (6%): R$ ${vtDeduction.toFixed(2).replace('.', ',')}\n` : ''}${otherDeds > 0 ? `• (-) Outros Descontos: R$ ${otherDeds.toFixed(2).replace('.', ',')}\n` : ''}• TOTAL DE DESCONTOS: R$ ${totalDeductions.toFixed(2).replace('.', ',')}

SALÁRIO LÍQUIDO A RECEBER: R$ ${netSalary.toFixed(2).replace('.', ',')}
(FGTS Empregador 8%: R$ ${fgtsEmployer.toFixed(2).replace('.', ',')})

Calculado em calculadoradehorastrabalhadas.org`;

    if (!await writeClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fillExampleHolerite = () => {
    setGrossSalary('4200.00');
    setDependents('1');
    setOtherDeductions('120.00');
    setOvertimeAmount('350.00');
    setIncludeDSROvertime(true);
    setWorkingDays('25');
    setSundaysHolidays('5');
    setUnexcusedAbsences('0');
    setFoodVoucherAmount('80.00');
    setHasPericulosidade(false);
    setInsalubridadeGrade('none');
    setDeductVT6(true);
    setShowSimulation(true);
  };

  const exportCSV = () => {
    const rows = [
      { date: 'Salário Base Contratual', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${baseSalary.toFixed(2)}` },
    ];
    if (periculosidadeAmount > 0) rows.push({ date: 'Adicional de Periculosidade (30%)', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${periculosidadeAmount.toFixed(2)}` });
    if (insalubridadeAmount > 0) rows.push({ date: `Adicional de Insalubridade (${insalubridadeGrade}%)`, start: '-', end: '-', breakTime: '-', totalHours: `R$ ${insalubridadeAmount.toFixed(2)}` });
    if (otVal > 0) rows.push({ date: 'Horas Extras / Adicionais', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${otVal.toFixed(2)}` });

    rows.push({ date: 'TOTAL SALÁRIO BRUTO', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${totalGross.toFixed(2)}` });
    rows.push({ date: '(-) INSS Previdência Social', start: '-', end: '-', breakTime: '-', totalHours: `-R$ ${inssDeduction.toFixed(2)}` });
    rows.push({ date: `(-) IRRF Imposto de Renda (${irrfResult.rate})`, start: '-', end: '-', breakTime: '-', totalHours: `-R$ ${irrfDeduction.toFixed(2)}` });
    if (vtDeduction > 0) rows.push({ date: '(-) Vale Transporte (6%)', start: '-', end: '-', breakTime: '-', totalHours: `-R$ ${vtDeduction.toFixed(2)}` });
    if (otherDeds > 0) rows.push({ date: '(-) Outros Descontos', start: '-', end: '-', breakTime: '-', totalHours: `-R$ ${otherDeds.toFixed(2)}` });

    rows.push({ date: 'SALÁRIO LÍQUIDO A RECEBER', start: '-', end: '-', breakTime: '-', totalHours: `R$ ${netSalary.toFixed(2)}` });

    generateTimesheetCSV(rows, 'Simulacao_Holerite_CLT');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Simulador de Holerite e Salário Líquido (CLT)</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            Calcule seu salário líquido oficial com os descontos atualizados de INSS, IRRF, dependentes, periculosidade e VT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button onClick={fillExampleHolerite} className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Preencher Exemplo
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar CSV
          </button>
          <button onClick={copyHolerite} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />} Copiar Holerite
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Printer className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" /> Imprimir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="holerite-gross-salary" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Salário Bruto Mensal (R$)</label>
          <input
            id="holerite-gross-salary"
            aria-label="Salário Bruto Mensal em Reais"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            placeholder="Ex: 3000.00"
          />
          {/* Quick Salary Presets */}
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-[10px] text-neutral-400 self-center">Atalhos:</span>
            {[
              { label: 'R$ 1.621 (SM)', val: String(MINIMUM_WAGE_2026) },
              { label: 'R$ 2.500', val: '2500.00' },
              { label: 'R$ 3.500', val: '3500.00' },
              { label: 'R$ 5.000', val: '5000.00' },
              { label: 'R$ 8.000', val: '8000.00' },
              { label: 'R$ 12.000', val: '12000.00' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setGrossSalary(preset.val)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  grossSalary === preset.val
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="holerite-overtime" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Horas Extras (R$)</label>
          <input
            id="holerite-overtime"
            aria-label="Horas Extras em Reais"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={overtimeAmount}
            onChange={(e) => setOvertimeAmount(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 250.00"
          />
        </div>
        <div>
          <label htmlFor="holerite-night-shift" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
            <span>Adicional Noturno (R$)</span>
          </label>
          <input
            id="holerite-night-shift"
            aria-label="Adicional Noturno em Reais"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={nightShiftAmount}
            onChange={(e) => setNightShiftAmount(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 120.00"
          />
        </div>
        <div>
          <label htmlFor="holerite-dependents" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Número de Dependentes (IRRF)</label>
          <input
            id="holerite-dependents"
            aria-label="Número de Dependentes para IRRF"
            type="number" min="0" inputMode="decimal"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 1"
          />
        </div>
        <div>
          <label htmlFor="holerite-alimony" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Pensão Alimentícia (R$)</label>
          <input
            id="holerite-alimony"
            aria-label="Pensão Alimentícia em Reais"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={alimonyAmount}
            onChange={(e) => setAlimonyAmount(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Abate base do IRRF"
          />
        </div>
        <div>
          <label htmlFor="holerite-health-plan" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Plano de Saúde / Odonto (R$)</label>
          <input
            id="holerite-health-plan"
            aria-label="Plano de Saúde ou Odontológico em Reais"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={healthPlanAmount}
            onChange={(e) => setHealthPlanAmount(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 150.00"
          />
        </div>
        <div>
          <label htmlFor="holerite-absences" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Faltas Injustificadas no Mês (Dias)</label>
          <input
            id="holerite-absences"
            aria-label="Faltas Injustificadas em Dias"
            type="number" inputMode="decimal"
            min="0"
            value={unexcusedAbsences}
            onChange={(e) => setUnexcusedAbsences(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 0"
          />
        </div>
        <div>
          <label htmlFor="holerite-food-voucher" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Desconto VR/VA Alimentação (R$)</label>
          <input
            id="holerite-food-voucher"
            aria-label="Desconto Vale Refeição em Reais"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={foodVoucherAmount}
            onChange={(e) => setFoodVoucherAmount(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Teto máx 20% salário"
          />
        </div>
        <div>
          <label htmlFor="holerite-other-deductions" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Outros Descontos Diversos (R$)</label>
          <input
            id="holerite-other-deductions"
            aria-label="Outros Descontos em Reais"
            type="number" min="0" inputMode="decimal"
            step="0.01"
            value={otherDeductions}
            onChange={(e) => setOtherDeductions(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 50.00"
          />
        </div>
      </div>

      {/* Benefits / Special Rates */}
      <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="periculosidade"
              aria-label="Adicional de Periculosidade"
              checked={hasPericulosidade}
              onChange={(e) => setHasPericulosidade(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="periculosidade" className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-200">
              Adicional de Periculosidade (+30% no Base)
            </label>
          </div>

          <div>
            <label htmlFor="holerite-insalubridade" className="block font-medium text-neutral-800 dark:text-neutral-200 mb-1">Insalubridade (% do Salário Mínimo)</label>
            <select
              id="holerite-insalubridade"
              aria-label="Grau de Insalubridade"
              value={insalubridadeGrade}
              onChange={(e) => setInsalubridadeGrade(e.target.value as any)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg p-2 text-xs outline-none cursor-pointer"
            >
              <option value="none">Não tem Insalubridade</option>
              <option value="10">Mínimo (10% = R$ 162,10)</option>
              <option value="20">Médio (20% = R$ 324,20)</option>
              <option value="40">Máximo (40% = R$ 648,40)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="vt6"
              checked={deductVT6}
              onChange={(e) => setDeductVT6(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="vt6" className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-200">
              Descontar Vale Transporte (6% do Base)
            </label>
          </div>
        </div>

        {/* DSR on Overtime checkbox */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dsr_ot"
              checked={includeDSROvertime}
              onChange={(e) => setIncludeDSROvertime(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="dsr_ot" className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-200">
              Calcular DSR sobre Horas Extras (Reflexo Obrigatório TST)
            </label>
          </div>

          {includeDSROvertime && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Dias Úteis:</span>
              <input aria-label="Calcular DSR sobre Horas Extras (Reflexo Obrigatório TST)"
                type="number" min="0" inputMode="decimal"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                className="w-14 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded p-1 text-center font-bold"
              />
              <span className="text-neutral-500">Dom/Feriados:</span>
              <input aria-label="Calcular DSR sobre Horas Extras (Reflexo Obrigatório TST)"
                type="number" min="0" inputMode="decimal"
                value={sundaysHolidays}
                onChange={(e) => setSundaysHolidays(e.target.value)}
                className="w-14 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded p-1 text-center font-bold"
              />
            </div>
          )}
        </div>
      </div>

      {/* Visual Percentage Breakdown Bar */}
      {totalGross > 0 && (
        <div className="mb-6 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-600" />
              Composição Proporcional do Salário Bruto
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Líquido: {((totalGross > 0 ? netSalary / totalGross : 0) * 100).toFixed(1)}% | Descontos: {((totalGross > 0 ? totalDeductions / totalGross : 0) * 100).toFixed(1)}%
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full h-3.5 bg-neutral-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.max(0, (totalGross > 0 ? netSalary / totalGross : 0) * 100)}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
              title={`Salário Líquido: R$ ${netSalary.toFixed(2)}`}
            />
            <div
              style={{ width: `${Math.max(0, (inssDeduction / totalGross) * 100)}%` }}
              className="bg-rose-500 h-full transition-all duration-300"
              title={`INSS: R$ ${inssDeduction.toFixed(2)}`}
            />
            <div
              style={{ width: `${Math.max(0, (irrfDeduction / totalGross) * 100)}%` }}
              className="bg-amber-500 h-full transition-all duration-300"
              title={`IRRF: R$ ${irrfDeduction.toFixed(2)}`}
            />
            <div
              style={{ width: `${Math.max(0, ((vtDeduction + vrDeduction + otherDeds) / totalGross) * 100)}%` }}
              className="bg-purple-500 h-full transition-all duration-300"
              title={`VT/VR/Outros: R$ ${(vtDeduction + vrDeduction + otherDeds).toFixed(2)}`}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-neutral-700 dark:text-neutral-300">Líquido: R$ {netSalary.toFixed(2)} ({((totalGross > 0 ? netSalary / totalGross : 0) * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="text-neutral-700 dark:text-neutral-300">INSS: R$ {inssDeduction.toFixed(2)} ({((inssDeduction / totalGross) * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-neutral-700 dark:text-neutral-300">IRRF: R$ {irrfDeduction.toFixed(2)} ({((irrfDeduction / totalGross) * 100).toFixed(1)}%)</span>
            </div>
            {(vtDeduction + vrDeduction + otherDeds) > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                <span className="text-neutral-700 dark:text-neutral-300">VT/VR/Outros: R$ {(vtDeduction + vrDeduction + otherDeds).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Salary Increase / Raise Simulation Card */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-blue-900 text-sm">Simulador de Reajuste Salarial / Promoção</span>
          </div>
          <button
            onClick={() => setShowSimulation(!showSimulation)}
            className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer underline"
          >
            {showSimulation ? 'Ocultar Simulação' : 'Simular Aumento (+5%, +10%, +15%)'}
          </button>
        </div>

        {showSimulation && (
          <div className="mt-4 pt-3 border-t border-blue-200/80 space-y-3">
            <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-blue-200 w-fit text-xs">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Porcentagem Personalizada:</span>
              <input
                type="number" min="0" inputMode="decimal"
                step="0.5"
                value={customRaisePct}
                onChange={(e) => setCustomRaisePct(e.target.value)}
                className="w-16 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 text-center font-bold text-blue-900"
              />
              <span className="font-bold text-neutral-600 dark:text-neutral-400">%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[5, 10, 15, nonNegative(customRaisePct, 0)].map((pct, idx) => {
                const simulatedGross = baseSalary * (1 + pct / 100);
                let simInss = 0;
                if (simulatedGross > 0) {
                  simInss += Math.min(simulatedGross, b1) * 0.075;
                  if (simulatedGross > b1) simInss += (Math.min(simulatedGross, b2) - b1) * 0.09;
                  if (simulatedGross > b2) simInss += (Math.min(simulatedGross, b3) - b2) * 0.12;
                  if (simulatedGross > b3) simInss += (Math.min(simulatedGross, b4) - b3) * 0.14;
                }
                const simBaseStandard = Math.max(0, simulatedGross - simInss - dependentDeduction - alimony);
                const simBaseSimplified = Math.max(0, simulatedGross - 607.20);
                const simIrrfBase = Math.min(simBaseStandard, simBaseSimplified);
                const simIrrf = Math.max(0, calculateIRRFDetails(simulatedGross, deps, calculateINSS(simulatedGross), alimony).tax);
                const simNet = Math.max(0, simulatedGross - simInss - simIrrf - vtDeduction - vrDeduction - healthPlan - alimony - otherDeds);
                const netDifference = simNet - netSalary;

                return (
                  <div key={idx} className={`bg-white p-3 rounded-xl border shadow-2xs ${idx === 3 ? 'border-blue-400 bg-blue-50/40' : 'border-blue-200'}`}>
                    <div className="font-bold text-neutral-800 dark:text-neutral-200">
                      Aumento de {pct}% {idx === 3 ? '(Personalizado)' : ''}
                    </div>
                    <div className="text-neutral-500 font-mono mt-0.5 text-[11px]">Novo Bruto: R$ {simulatedGross.toFixed(2)}</div>
                    <div className="text-emerald-700 font-bold font-mono mt-1 text-sm">Líquido: R$ {simNet.toFixed(2)}</div>
                    <div className="text-emerald-600 text-[11px] font-medium mt-0.5">
                      (+R$ {netDifference.toFixed(2)} na conta)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Simulated Payslip Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-2xl overflow-hidden shadow-xs mb-6">
        <div className="bg-neutral-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Demonstrativo de Pagamento (Holerite Estimado)</span>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Padrão CLT 2026</span>
        </div>

        <div className="p-4 space-y-3 text-xs font-mono">
          <div className="flex justify-between py-1.5 border-b border-neutral-100">
            <span className="text-neutral-600 dark:text-neutral-400">Salário Bruto Contratual</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">R$ {baseSalary.toFixed(2).replace('.', ',')}</span>
          </div>

          {periculosidadeAmount > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-600 dark:text-neutral-400">(+) Adicional de Periculosidade (30%)</span>
              <span className="font-bold text-emerald-600">R$ {periculosidadeAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {insalubridadeAmount > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-600 dark:text-neutral-400">(+) Adicional de Insalubridade ({insalubridadeGrade}%)</span>
              <span className="font-bold text-emerald-600">R$ {insalubridadeAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {otVal > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-600 dark:text-neutral-400">(+) Horas Extras</span>
              <span className="font-bold text-emerald-600">R$ {otVal.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {nightVal > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-600 dark:text-neutral-400">(+) Adicional Noturno (20%+)</span>
              <span className="font-bold text-emerald-600">R$ {nightVal.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {dsrOvertimeAmount > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-600 dark:text-neutral-400">(+) DSR sobre Horas Extras / Noturno (Reflexo)</span>
              <span className="font-bold text-emerald-600">R$ {dsrOvertimeAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {absenceDeduction > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
              <span>(-) Desconto Faltas Injustificadas ({absences} dias)</span>
              <span className="font-bold">- R$ {absenceDeduction.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {dsrLossDeduction > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
              <span>(-) Perda do DSR da Semana da Falta</span>
              <span className="font-bold">- R$ {dsrLossDeduction.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5 border-b border-neutral-100 bg-neutral-50 dark:bg-neutral-800 px-2 rounded">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">(=) TOTAL BRUTO COM REFLEXOS E FALTAS</span>
            <span className="font-extrabold text-neutral-900 dark:text-neutral-100">R$ {totalGross.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
            <span>(-) INSS (Previdência Social)</span>
            <span className="font-bold">- R$ {inssDeduction.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
            <span>
              (-) IRRF (Imposto de Renda Retido - {irrfResult.rate})
              {isSimplifiedBetter && <span className="text-[10px] text-blue-600 ml-1 font-normal">(Desconto Simplificado Aplicado)</span>}
            </span>
            <span className="font-bold">- R$ {irrfDeduction.toFixed(2).replace('.', ',')}</span>
          </div>

          {alimony > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
              <span>(-) Pensão Alimentícia Judicial</span>
              <span className="font-bold">- R$ {alimony.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {healthPlan > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
              <span>(-) Plano de Saúde / Odontológico</span>
              <span className="font-bold">- R$ {healthPlan.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {vtDeduction > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
              <span>(-) Vale Transporte (6%)</span>
              <span className="font-bold">- R$ {vtDeduction.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {vrDeduction > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
              <span>(-) Vale Refeição/Alimentação (Desconto VR)</span>
              <span className="font-bold">- R$ {vrDeduction.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          {otherDeds > 0 && (
            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-rose-600">
              <span>(-) Outros Descontos Diversos</span>
              <span className="font-bold">- R$ {otherDeds.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 flex justify-between items-center text-sm font-sans font-bold">
            <span className="text-blue-900">SALÁRIO LÍQUIDO A RECEBER:</span>
            <span className="text-2xl font-mono text-emerald-600">R$ {netSalary.toFixed(2).replace('.', ',')}</span>
          </div>

          {/* Official Printable Receipt Stub */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-600 text-xs text-neutral-600 dark:text-neutral-400 font-sans space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              <span>DECLARAÇÃO DE RECEBIMENTO</span>
              <span>VIA DO EMPREGADO / EMPREGADOR</span>
            </div>
            <p className="italic text-neutral-500 leading-relaxed text-[11px]">
              "Recebi de [Razão Social do Empregador] a quantia líquida de <strong>R$ {netSalary.toFixed(2).replace('.', ',')}</strong>, referente ao pagamento de salário do mês corrente, discriminado neste recibo."
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="border-t border-neutral-400 text-center pt-1 text-[11px] text-neutral-500">
                Data: _____ / _____ / _________
              </div>
              <div className="border-t border-neutral-400 text-center pt-1 text-[11px] text-neutral-500">
                Assinatura do Trabalhador(a)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Details Accordion */}
      <div className="mb-6 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden text-xs">
        <button
          onClick={() => setShowTaxDetails(!showTaxDetails)}
          className="w-full p-3 text-left font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Entenda o Cálculo do INSS e Imposto de Renda (IRRF)
          </span>
          {showTaxDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTaxDetails && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-4 bg-white dark:bg-neutral-900">
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">1. Memória de Cálculo do INSS Progressivo:</h4>
              <ul className="space-y-1 font-mono text-neutral-600 dark:text-neutral-400">
                <li>• 1ª Faixa (até R$ 1.621,00 - 7,5%): R$ {inssB1.toFixed(2)}</li>
                <li>• 2ª Faixa (R$ 1.621,01 a R$ 2.902,84 - 9%): R$ {inssB2.toFixed(2)}</li>
                <li>• 3ª Faixa (R$ 2.902,85 a R$ 4.354,27 - 12%): R$ {inssB3.toFixed(2)}</li>
                <li>• 4ª Faixa (R$ 4.354,28 a R$ 8.475,55 - 14%): R$ {inssB4.toFixed(2)}</li>
                <li className="font-bold text-rose-700 pt-1">• Total INSS Descontado: R$ {inssDeduction.toFixed(2)}</li>
              </ul>
            </div>

            <hr />

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">2. Memória de Cálculo do IRRF:</h4>
              <p className="text-neutral-600 dark:text-neutral-400 mb-1">
                Base de Cálculo = R$ {totalGross.toFixed(2)} - INSS (R$ {inssDeduction.toFixed(2)}) - Dependentes (R$ {dependentDeduction.toFixed(2)}) = <strong>R$ {irrfBaseStandard.toFixed(2)}</strong>
              </p>
              {isSimplifiedBetter && (
                <p className="text-blue-700 font-semibold mb-1">
                  ✓ O desconto simplificado da Receita Federal (R$ 607,20) foi aplicado automaticamente por resultar em menor imposto a pagar!
                </p>
              )}
              <p className="font-bold text-rose-700 font-mono">
                • Alíquota do IRRF: {irrfResult.rate} | Desconto Final: R$ {irrfDeduction.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-neutral-50 dark:bg-neutral-800 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <span className="text-neutral-500 block mb-1">FGTS Pago pela Empresa (8% - Não descontado do trabalhador)</span>
          <span className="text-base font-bold font-mono text-neutral-800 dark:text-neutral-200">
            R$ {fgtsEmployer.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <span className="text-neutral-500 block mb-1">Total Geral de Descontos no Mês</span>
          <span className="text-base font-bold font-mono text-rose-600">
            R$ {totalDeductions.toFixed(2).replace('.', ',')} ({((totalDeductions / (totalGross || 1)) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="holerite" onSelectTab={onSelectTab} />}
    </div>
  );
}



import React, { useState } from 'react';
import { Palmtree, DollarSign, Calendar, AlertCircle, Copy, Check, Printer, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Percent } from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';

interface FeriasCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

export default function FeriasCalculator({ onSelectTab }: FeriasCalculatorProps) {
  const [salary, setSalary] = useState<string>('3200');
  const [vacationDays, setVacationDays] = useState<'30' | '20' | '15' | '10'>('30');
  const [sellDays, setSellDays] = useState<'0' | '10'>('0'); // Abono Pecuniário (vender 10 dias)
  const [advance13th, setAdvance13th] = useState<boolean>(false); // Adiantar 1ª parcela do 13º
  const [dependents, setDependents] = useState<string>('0');
  const [copied, setCopied] = useState(false);

  const baseSalary = parseFloat(salary) || 0;
  const numDependents = parseInt(dependents) || 0;
  const days = parseInt(vacationDays) || 30;
  const daysSold = parseInt(sellDays) || 0;
  const actualDaysOff = days - daysSold; // Dias que efetivamente ficará de folga

  // Valor diário
  const dailyWage = baseSalary / 30;

  // Valor das férias gozadas
  const vacationGross = dailyWage * actualDaysOff;
  const oneThirdVacation = vacationGross / 3;
  const totalTaxableVacation = vacationGross + oneThirdVacation;

  // Abono pecuniário (Venda de 10 dias) + 1/3 do abono (Isento de impostos)
  const abonoPecuniario = daysSold > 0 ? dailyWage * daysSold : 0;
  const oneThirdAbono = abonoPecuniario / 3;
  const totalAbonoExempt = abonoPecuniario + oneThirdAbono;

  // 1ª Parcela do 13º Salário (50% do salário bruto - Isento de INSS/IRRF no adiantamento)
  const advance13thAmount = advance13th ? baseSalary * 0.5 : 0;

  // Cálculo INSS Progressivo 2026 sobre a parcela tributável
  const calculateINSS = (value: number) => {
    if (value <= 0) return 0;
    let inss = 0;
    const f1 = 1518.00;
    const f2 = 2793.88;
    const f3 = 4190.83;
    const f4 = 8157.41;

    if (value <= f1) {
      inss = value * 0.075;
    } else if (value <= f2) {
      inss = (f1 * 0.075) + ((value - f1) * 0.09);
    } else if (value <= f3) {
      inss = (f1 * 0.075) + ((f2 - f1) * 0.09) + ((value - f2) * 0.12);
    } else if (value <= f4) {
      inss = (f1 * 0.075) + ((f2 - f1) * 0.09) + ((f3 - f2) * 0.12) + ((value - f3) * 0.14);
    } else {
      inss = (f1 * 0.075) + ((f2 - f1) * 0.09) + ((f3 - f2) * 0.12) + ((f4 - f3) * 0.14); // Teto
    }
    return inss;
  };

  const inssDiscount = calculateINSS(totalTaxableVacation);

  // Cálculo IRRF 2026 sobre a parcela tributável
  const irrfBase = Math.max(0, totalTaxableVacation - inssDiscount - (numDependents * 189.59));
  let irrfDiscount = 0;
  if (irrfBase > 4664.68) {
    irrfDiscount = (irrfBase * 0.275) - 896.00;
  } else if (irrfBase > 3751.05) {
    irrfDiscount = (irrfBase * 0.225) - 662.77;
  } else if (irrfBase > 2826.65) {
    irrfDiscount = (irrfBase * 0.15) - 381.44;
  } else if (irrfBase > 2259.20) {
    irrfDiscount = (irrfBase * 0.075) - 169.44;
  }
  irrfDiscount = Math.max(0, irrfDiscount);

  // Total Líquido a Receber 2 dias antes de sair de férias
  const totalGross = totalTaxableVacation + totalAbonoExempt + advance13thAmount;
  const totalNet = totalGross - inssDiscount - irrfDiscount;

  const copyResults = () => {
    const text = `=== Cálculo de Férias CLT (2026) ===\nSalário Base: R$ ${baseSalary.toFixed(2)}\nDias de Férias: ${actualDaysOff} dias de descanso${daysSold > 0 ? ` + ${daysSold} dias vendidos (abono)` : ''}\nFérias Brutas (${actualDaysOff}d): R$ ${vacationGross.toFixed(2)}\n1/3 Constitucional: R$ ${oneThirdVacation.toFixed(2)}\n${daysSold > 0 ? `Abono Pecuniário + 1/3 (Isento): R$ ${totalAbonoExempt.toFixed(2)}\n` : ''}${advance13th ? `Adiantamento 1ª parc. 13º: R$ ${advance13thAmount.toFixed(2)}\n` : ''}Desconto INSS: - R$ ${inssDiscount.toFixed(2)}\nDesconto IRRF: - R$ ${irrfDiscount.toFixed(2)}\nTotal Líquido no Bolso: R$ ${totalNet.toFixed(2)}\nCalculado em: https://calculadoradehorastrabalhadas.org/calculadora-de-ferias`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Art. 129 a 145 da CLT • 1/3 Constitucional
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
            Calculadora de Férias CLT (1/3 Constitucional, Venda e Descontos)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Salário Base */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="fer-sal" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Salário Bruto Atual (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">R$</span>
            <input
              id="fer-sal"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="3200"
            />
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Diária: <strong>R$ {dailyWage.toFixed(2)}</strong>
          </span>
        </div>

        {/* Quantidade de Dias de Férias */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Dias de Direito a Gozar
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setVacationDays('30'); setSellDays('0'); }}
              className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                vacationDays === '30' && sellDays === '0'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              30 Dias
            </button>
            <button
              type="button"
              onClick={() => { setVacationDays('20'); setSellDays('0'); }}
              className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                vacationDays === '20' && sellDays === '0'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              20 Dias
            </button>
            <button
              type="button"
              onClick={() => { setVacationDays('15'); setSellDays('0'); }}
              className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                vacationDays === '15' && sellDays === '0'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              15 Dias
            </button>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Pode fracionar em até 3 vezes (Reforma Trabalhista)
          </span>
        </div>

        {/* Abono Pecuniário (Venda de 10 dias) */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Vender 1/3 das Férias? (Abono)
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setVacationDays('30'); setSellDays('0'); }}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                sellDays === '0'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              Não Vender
            </button>
            <button
              type="button"
              onClick={() => { setVacationDays('30'); setSellDays('10'); }}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                sellDays === '10'
                  ? 'bg-amber-500 text-neutral-900 border-amber-500 shadow-sm font-extrabold'
                  : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              Vender 10 Dias
            </button>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            {sellDays === '10' ? '20 dias de folga + 10 dias pagos (Isento de INSS)' : 'Folga integral'}
          </span>
        </div>

        {/* Dependentes IRRF */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <label htmlFor="fer-dep" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Dependentes para IRRF
          </label>
          <input
            id="fer-dep"
            type="number"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl py-2 px-3 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="0"
          />
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            Dedução de R$ 189,59 por dependente
          </span>
        </div>

        {/* Adiantamento do 13º Salário */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2 sm:col-span-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Adiantar 1ª Parcela do 13º Salário?
          </label>
          <button
            type="button"
            onClick={() => setAdvance13th(!advance13th)}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              advance13th
                ? 'bg-emerald-500 text-neutral-900 border-emerald-500 shadow-sm font-extrabold'
                : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {advance13th ? '✓ Sim, incluir adiantamento de 50% do 13º (R$ ' + (baseSalary * 0.5).toFixed(2) + ')' : 'Não adiantar 13º agora'}
          </button>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
            O adiantamento do 13º não sofre desconto de INSS ou IRRF no momento das férias.
          </span>
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800">
          <div>
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Férias Brutas ({actualDaysOff}d)</span>
            <div className="text-2xl font-bold font-mono text-teal-400">
              R$ {vacationGross.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">{actualDaysOff} dias de descanso</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">1/3 Constitucional</span>
            <div className="text-2xl font-bold font-mono text-teal-300">
              + R$ {oneThirdVacation.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">Direito legal CF/88</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Desconto INSS</span>
            <div className="text-2xl font-bold font-mono text-rose-400">
              - R$ {inssDiscount.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">Tabela progressiva 2026</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Desconto IRRF</span>
            <div className="text-2xl font-bold font-mono text-rose-400">
              - R$ {irrfDiscount.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-neutral-400">{numDependents} dependente(s)</span>
          </div>
        </div>

        {/* Linhas Extras (Abono e 13º) */}
        {(daysSold > 0 || advance13th) && (
          <div className="bg-neutral-800/60 p-4 rounded-xl border border-neutral-700/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {daysSold > 0 && (
              <div>
                <span className="text-neutral-400 block font-semibold">Abono Pecuniário (10 dias vendidos + 1/3):</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  + R$ {totalAbonoExempt.toFixed(2).replace('.', ',')} (Isento de INSS e IRRF)
                </span>
              </div>
            )}
            {advance13th && (
              <div>
                <span className="text-neutral-400 block font-semibold">Adiantamento 50% do 13º Salário:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  + R$ {advance13thAmount.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Total Líquido a Receber */}
        <div className="bg-teal-950/80 p-5 rounded-xl border border-teal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-teal-300 block font-semibold uppercase tracking-wider">
              Total Líquido a Receber na Conta (Até 2 dias antes das férias):
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
              R$ {totalNet.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-xs text-teal-200">
              Total Bruto: R$ {totalGross.toFixed(2).replace('.', ',')} | Descontos: R$ {(inssDiscount + irrfDiscount).toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            onClick={copyResults}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-3 px-5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Cálculo de Férias'}</span>
          </button>
        </div>
      </div>

      {/* Legal Box */}
      <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 p-5 rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-teal-600" />
          Regras de Pagamento de Férias (Artigo 145 da CLT)
        </h4>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          O pagamento da remuneração das férias e, se for o caso, do abono pecuniário, deverá ser efetuado <strong>até 2 (dois) dias antes do início do respectivo período</strong>.
        </p>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <strong>Súmula 450 do STF:</strong> É devido o pagamento em dobro da remuneração de férias, incluído o terço constitucional, com base no Art. 137 da CLT, quando, ainda que gozadas na época própria, o empregador tenha descumprido o prazo de pagamento do Art. 145.
        </p>
      </div>

      {onSelectTab && <InternalLinkCTA currentTab="ferias" onSelectTab={onSelectTab} />}
    </div>
  );
}

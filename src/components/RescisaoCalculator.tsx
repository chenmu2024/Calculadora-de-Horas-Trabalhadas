import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, Info, ShieldCheck, Download, Copy, Check, Printer, AlertTriangle, Calculator, Briefcase, Sparkles, ShieldAlert } from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';
import CLTAlertBanner from './CLTAlertBanner';

interface RescisaoCalculatorProps {
  onSelectTab?: (tab: string) => void;
}

type TipoDesligamento = 'sem_justa_causa' | 'pedido_demissao' | 'com_justa_causa' | 'acordo_mutuo';
type TipoAvisoPrevio = 'indenizado' | 'trabalhado' | 'nao_cumprido';

export default function RescisaoCalculator({ onSelectTab }: RescisaoCalculatorProps) {
  const [grossSalary, setGrossSalary] = useState(() => localStorage.getItem('calc_rescisao_gross') || '3500.00');
  const [tipoDesligamento, setTipoDesligamento] = useState<TipoDesligamento>(
    () => (localStorage.getItem('calc_rescisao_tipo') as TipoDesligamento) || 'sem_justa_causa'
  );
  const [tipoAviso, setTipoAviso] = useState<TipoAvisoPrevio>(
    () => (localStorage.getItem('calc_rescisao_aviso') as TipoAvisoPrevio) || 'indenizado'
  );
  const [yearsWorked, setYearsWorked] = useState(() => localStorage.getItem('calc_rescisao_years') || '2');
  const [workedDaysMonth, setWorkedDaysMonth] = useState(() => localStorage.getItem('calc_rescisao_days') || '15');
  const [months13th, setMonths13th] = useState(() => localStorage.getItem('calc_rescisao_m13') || '7');
  const [monthsVacation, setMonthsVacation] = useState(() => localStorage.getItem('calc_rescisao_mvac') || '7');
  const [hasExpiredVacation, setHasExpiredVacation] = useState(
    () => localStorage.getItem('calc_rescisao_has_exp_vac') === 'true'
  );
  const [fgtsBalance, setFgtsBalance] = useState(() => localStorage.getItem('calc_rescisao_fgts') || '12000.00');
  const [dependents, setDependents] = useState(() => localStorage.getItem('calc_rescisao_deps') || '0');
  const [variableAverage, setVariableAverage] = useState(() => localStorage.getItem('calc_rescisao_vars') || '0');
  const [copied, setCopied] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('calc_rescisao_gross', grossSalary);
    localStorage.setItem('calc_rescisao_tipo', tipoDesligamento);
    localStorage.setItem('calc_rescisao_aviso', tipoAviso);
    localStorage.setItem('calc_rescisao_years', yearsWorked);
    localStorage.setItem('calc_rescisao_days', workedDaysMonth);
    localStorage.setItem('calc_rescisao_m13', months13th);
    localStorage.setItem('calc_rescisao_mvac', monthsVacation);
    localStorage.setItem('calc_rescisao_has_exp_vac', String(hasExpiredVacation));
    localStorage.setItem('calc_rescisao_fgts', fgtsBalance);
    localStorage.setItem('calc_rescisao_deps', dependents);
    localStorage.setItem('calc_rescisao_vars', variableAverage);
  }, [grossSalary, tipoDesligamento, tipoAviso, yearsWorked, workedDaysMonth, months13th, monthsVacation, hasExpiredVacation, fgtsBalance, dependents, variableAverage]);

  const baseSalary = parseFloat(grossSalary) || 0;
  const varsAvg = parseFloat(variableAverage) || 0;
  const salary = baseSalary + varsAvg; // Total remuneratório para cálculo das verbas
  const years = parseInt(yearsWorked) || 0;
  const daysInMonth = Math.min(30, Math.max(0, parseInt(workedDaysMonth) || 0));
  const m13 = Math.min(12, Math.max(0, parseInt(months13th) || 0));
  const mVac = Math.min(12, Math.max(0, parseInt(monthsVacation) || 0));
  const fgts = parseFloat(fgtsBalance) || 0;
  const deps = parseInt(dependents) || 0;

  // 1. Saldo de Salário
  const saldoSalario = (salary / 30) * daysInMonth;

  // 2. Aviso Prévio Proporcional (Lei 12.506/2011)
  // 30 dias + 3 dias por ano completo de serviço (máximo 90 dias)
  const avisoDays = Math.min(90, 30 + (years * 3));
  let avisoPrevioValor = 0;
  
  if (tipoDesligamento === 'sem_justa_causa') {
    if (tipoAviso === 'indenizado') {
      avisoPrevioValor = (salary / 30) * avisoDays;
    }
  } else if (tipoDesligamento === 'acordo_mutuo') {
    // No acordo mútuo, o aviso prévio se indenizado é pago pela metade (50%)
    if (tipoAviso === 'indenizado') {
      avisoPrevioValor = ((salary / 30) * avisoDays) * 0.5;
    }
  } else if (tipoDesligamento === 'pedido_demissao') {
    // Se o empregado pede demissão e NÃO cumpre o aviso, a empresa pode descontar 30 dias de salário
    if (tipoAviso === 'nao_cumprido') {
      avisoPrevioValor = -salary;
    }
  }

  // 3. 13º Salário Proporcional
  // Projeção do aviso prévio indenizado soma 1 mês se avisoDays >= 30 e indenizado
  let m13Final = m13;
  if ((tipoDesligamento === 'sem_justa_causa' || tipoDesligamento === 'acordo_mutuo') && tipoAviso === 'indenizado') {
    m13Final = Math.min(12, m13 + 1);
  }
  
  let décimoTerceiro = 0;
  if (tipoDesligamento !== 'com_justa_causa') {
    décimoTerceiro = (salary / 12) * m13Final;
  }

  // 4. Férias Proporcionais + 1/3
  let mVacFinal = mVac;
  if ((tipoDesligamento === 'sem_justa_causa' || tipoDesligamento === 'acordo_mutuo') && tipoAviso === 'indenizado') {
    mVacFinal = Math.min(12, mVac + 1);
  }

  let feriasProporcionais = 0;
  if (tipoDesligamento !== 'com_justa_causa') {
    feriasProporcionais = (salary / 12) * mVacFinal;
  }

  // 5. Férias Vencidas + 1/3
  const feriasVencidas = hasExpiredVacation ? salary : 0;

  // Terço Constitucional sobre Férias Proporcionais + Vencidas
  const tercoFerias = (feriasProporcionais + feriasVencidas) / 3;
  const totalFerias = feriasProporcionais + feriasVencidas + tercoFerias;

  // 6. Multa do FGTS
  let multaFGTS = 0;
  if (tipoDesligamento === 'sem_justa_causa') {
    multaFGTS = fgts * 0.40; // 40%
  } else if (tipoDesligamento === 'acordo_mutuo') {
    multaFGTS = fgts * 0.20; // 20%
  }

  // Descontos Oficiais INSS 2026 sobre Saldo de Salário
  const calculateINSS = (base: number) => {
    if (base <= 0) return 0;
    let tax = 0;
    if (base <= 1518.00) {
      tax = base * 0.075;
    } else if (base <= 2793.88) {
      tax = (1518.00 * 0.075) + ((base - 1518.00) * 0.09);
    } else if (base <= 4190.83) {
      tax = (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((base - 2793.88) * 0.12);
    } else if (base <= 8157.41) {
      tax = (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((4190.83 - 2793.88) * 0.12) + ((base - 4190.83) * 0.14);
    } else {
      tax = 951.63; // Teto do INSS
    }
    return tax;
  };

  const inssSaldoSalario = calculateINSS(saldoSalario);
  const inss13o = calculateINSS(décimoTerceiro);

  // Descontos Oficiais IRRF 2026 (Tabela Progressiva RFB)
  const calculateIRRF = (base: number) => {
    if (base <= 2259.20) return 0;
    let tax = 0;
    if (base <= 2826.65) tax = base * 0.075 - 169.44;
    else if (base <= 3751.05) tax = base * 0.15 - 381.44;
    else if (base <= 4664.68) tax = base * 0.225 - 662.77;
    else tax = base * 0.275 - 896.00;
    return Math.max(0, tax);
  };

  const dependentDeduction = deps * 189.59;

  // IRRF sobre Saldo de Salário (Férias e Aviso Indenizado são Isentos)
  const baseIrrfSaldoStd = Math.max(0, saldoSalario - inssSaldoSalario - dependentDeduction);
  const baseIrrfSaldoSimp = Math.max(0, saldoSalario - 564.80);
  const irrfSaldoSalario = calculateIRRF(Math.min(baseIrrfSaldoStd, baseIrrfSaldoSimp));

  // IRRF sobre 13º Salário Rescisório (Tributação Exclusiva)
  const baseIrrf13oStd = Math.max(0, décimoTerceiro - inss13o - dependentDeduction);
  const baseIrrf13oSimp = Math.max(0, décimoTerceiro - 564.80);
  const irrf13o = calculateIRRF(Math.min(baseIrrf13oStd, baseIrrf13oSimp));

  // Totais Brutos e Líquidos
  const proventosRendimentos = saldoSalario + (avisoPrevioValor > 0 ? avisoPrevioValor : 0) + décimoTerceiro + totalFerias + multaFGTS;
  const descontosTotais = inssSaldoSalario + inss13o + irrfSaldoSalario + irrf13o + (avisoPrevioValor < 0 ? Math.abs(avisoPrevioValor) : 0);
  const totalLiquido = Math.max(0, proventosRendimentos - descontosTotais);

  // Estimativa do Seguro-Desemprego (Tabela MTE 2026)
  const calcSeguroDesemprego = () => {
    if (tipoDesligamento !== 'sem_justa_causa') {
      return { eligible: false, parcelAmount: 0, parcelCount: 0, totalPotential: 0 };
    }
    let parcelAmount = 0;
    if (salary <= 2132.60) {
      parcelAmount = salary * 0.8;
    } else if (salary <= 3554.67) {
      parcelAmount = 1706.08 + (salary - 2132.60) * 0.5;
    } else {
      parcelAmount = 2417.11;
    }
    parcelAmount = Math.max(1518.00, parcelAmount); // Salário mínimo como piso nacional

    let parcelCount = 3;
    if (years >= 2) {
      parcelCount = 5;
    } else if (years >= 1) {
      parcelCount = 4;
    }
    return { eligible: true, parcelAmount, parcelCount, totalPotential: parcelAmount * parcelCount };
  };

  const seguroInfo = calcSeguroDesemprego();

  const fillExampleData = () => {
    setGrossSalary('3800.00');
    setTipoDesligamento('sem_justa_causa');
    setTipoAviso('indenizado');
    setYearsWorked('2');
    setWorkedDaysMonth('18');
    setMonths13th('7');
    setMonthsVacation('7');
    setHasExpiredVacation(false);
    setFgtsBalance('14200.00');
    setDependents('1');
  };

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const copySummary = () => {
    const summaryText = `--- SIMULAÇÃO DE RESCISÃO CONTRATUAL CLT ---
Tipo de Desligamento: ${
      tipoDesligamento === 'sem_justa_causa' ? 'Demissão sem justa causa' :
      tipoDesligamento === 'pedido_demissao' ? 'Pedido de demissão' :
      tipoDesligamento === 'com_justa_causa' ? 'Demissão com justa causa' : 'Acordo Consensual (Art. 484-A)'
    }
Salário Base: ${formatBRL(salary)}
Tempo de Casa: ${years} anos

PROVENTOS RESCISÓRIOS:
• Saldo de Salário (${daysInMonth} dias): ${formatBRL(saldoSalario)}
• Aviso Prévio (${avisoDays} dias): ${formatBRL(Math.max(0, avisoPrevioValor))}
• 13º Salário Proporcional (${m13Final}/12): ${formatBRL(décimoTerceiro)}
• Férias Proporcionais + Vencidas (+ 1/3): ${formatBRL(totalFerias)}
• Multa do FGTS (${tipoDesligamento === 'sem_justa_causa' ? '40%' : tipoDesligamento === 'acordo_mutuo' ? '20%' : '0%'}): ${formatBRL(multaFGTS)}

DESCONTOS PREVIDENCIÁRIOS E FISCAIS:
• INSS Saldo de Salário: ${formatBRL(inssSaldoSalario)}
• INSS 13º Salário: ${formatBRL(inss13o)}
${irrfSaldoSalario > 0 ? `• IRRF Saldo de Salário: ${formatBRL(irrfSaldoSalario)}\n` : ''}${irrf13o > 0 ? `• IRRF 13º Salário: ${formatBRL(irrf13o)}\n` : ''}${avisoPrevioValor < 0 ? `• Desconto de Aviso Prévio Não Cumprido: ${formatBRL(Math.abs(avisoPrevioValor))}\n` : ''}
VALOR LÍQUIDO RESCISÓRIO A RECEBER: ${formatBRL(totalLiquido)}
(Calculado via CalculadoraDeHorasTrabalhadas.org - Padrão CLT 2026)`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Legislação CLT Art. 477
            </span>
            <span className="text-xs text-neutral-500 font-medium">Tabela Previdenciária 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Calculadora de Rescisão Contratual CLT
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Simule o valor exato a receber na demissão com cálculo de aviso prévio, saldo de salário, 13º, férias com 1/3 e multa do FGTS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fillExampleData}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Preencher com Dados de Exemplo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Preencher Exemplo</span>
          </button>
          <button
            onClick={copySummary}
            className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copiar Resumo"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-600" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Imprimir ou Salvar PDF"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Banner de Prazo CLT */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          <strong>Prazo Legal de Pagamento (Art. 477, § 6º CLT):</strong> A empresa tem até 10 (dez) dias corridos a contar do término do contrato para realizar o pagamento integral das verbas rescisórias devidas ao trabalhador.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
        {/* Salário Bruto */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Último Salário Bruto Mensal (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
            <input
              type="number"
              step="50"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Quick Salary Presets */}
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-[10px] text-neutral-400 self-center">Atalhos:</span>
            {[
              { label: 'R$ 1.518 (SM)', val: '1518.00' },
              { label: 'R$ 2.500', val: '2500.00' },
              { label: 'R$ 3.500', val: '3500.00' },
              { label: 'R$ 5.000', val: '5000.00' },
              { label: 'R$ 8.000', val: '8000.00' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setGrossSalary(preset.val)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  grossSalary === preset.val
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Desligamento */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Tipo de Desligamento / Motivo
          </label>
          <select
            value={tipoDesligamento}
            onChange={(e) => setTipoDesligamento(e.target.value as TipoDesligamento)}
            className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="sem_justa_causa">Demissão sem justa causa (Pelo empregador)</option>
            <option value="pedido_demissao">Pedido de demissão (Pelo empregado)</option>
            <option value="acordo_mutuo">Acordo Consensual entre as Partes (Art. 484-A)</option>
            <option value="com_justa_causa">Demissão com justa causa</option>
          </select>
        </div>

        {/* Anos de Serviço (Tempo de Empresa) */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Anos Completos de Serviço (Tempo de Empresa)
          </label>
          <input
            type="number"
            min="0"
            max="40"
            value={yearsWorked}
            onChange={(e) => setYearsWorked(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Gera {avisoDays} dias de aviso prévio proporcional (30 dias + 3d/ano completo).
          </span>
        </div>

        {/* Tipo de Aviso Prévio */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Aviso Prévio
          </label>
          <select
            value={tipoAviso}
            onChange={(e) => setTipoAviso(e.target.value as TipoAvisoPrevio)}
            className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="indenizado">Indenizado (Pago em dinheiro sem trabalhar)</option>
            <option value="trabalhado">Trabalhado (Cumprido normalmente)</option>
            <option value="nao_cumprido">Dispensado / Não cumprido pelo empregado</option>
          </select>
        </div>

        {/* Dias trabalhados no mês do desligamento */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Dias Trabalhados no Último Mês (1 a 30)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            value={workedDaysMonth}
            onChange={(e) => setWorkedDaysMonth(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Meses trabalhados para 13º */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Meses para 13º Salário no Ano (1 a 12)
          </label>
          <input
            type="number"
            min="0"
            max="12"
            value={months13th}
            onChange={(e) => setMonths13th(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Frações iguais ou superiores a 15 dias contam como 1 mês inteiro.
          </span>
        </div>

        {/* Meses para Férias Proporcionais */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Meses do Período Aquisitivo de Férias (1 a 12)
          </label>
          <input
            type="number"
            min="0"
            max="12"
            value={monthsVacation}
            onChange={(e) => setMonthsVacation(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Saldo de FGTS para Multa */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Saldo Acumulado no Extrato do FGTS (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
            <input
              type="number"
              step="100"
              value={fgtsBalance}
              onChange={(e) => setFgtsBalance(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Utilizado para apurar a multa rescisória de 40% (ou 20% no acordo).
          </span>
        </div>

        {/* Média Mensal de Horas Extras / Comissões */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Média Mensal de Horas Extras / Comissões (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
            <input
              type="number"
              step="50"
              value={variableAverage}
              onChange={(e) => setVariableAverage(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: 350.00"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Média de adicionais para integração de reflexos nas verbas rescisórias.
          </span>
        </div>

        {/* Número de Dependentes */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
            Número de Dependentes (para Dedução IRRF)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Abate R$ 189,59 por dependente na base de cálculo do IRRF.
          </span>
        </div>

        {/* Checkbox Férias Vencidas */}
        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="expired_vacation"
            checked={hasExpiredVacation}
            onChange={(e) => setHasExpiredVacation(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded-md border-neutral-300 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="expired_vacation" className="text-xs sm:text-sm font-bold text-neutral-800 cursor-pointer">
            Possui 1 Período de Férias Vencidas Não Gozadas (Adiciona 1 salário integral + 1/3)
          </label>
        </div>
      </div>

      {/* Guia Rápido de Direitos no Tipo de Desligamento Selecionado */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs">
        <div className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span>Resumo dos Direitos no modo: {
            tipoDesligamento === 'sem_justa_causa' ? 'Demissão Sem Justa Causa' :
            tipoDesligamento === 'pedido_demissao' ? 'Pedido de Demissão' :
            tipoDesligamento === 'acordo_mutuo' ? 'Acordo Mútuo (Art. 484-A CLT)' : 'Demissão Com Justa Causa'
          }</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium text-neutral-700">
          <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] text-neutral-400 block">Multa FGTS</span>
            <span className={`font-bold text-xs ${multaFGTS > 0 ? 'text-emerald-700' : 'text-neutral-500'}`}>
              {tipoDesligamento === 'sem_justa_causa' ? '40% do Saldo' :
               tipoDesligamento === 'acordo_mutuo' ? '20% do Saldo' : 'Não se Aplica'}
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] text-neutral-400 block">Saque do FGTS</span>
            <span className={`font-bold text-xs ${tipoDesligamento === 'sem_justa_causa' || tipoDesligamento === 'acordo_mutuo' ? 'text-emerald-700' : 'text-rose-600'}`}>
              {tipoDesligamento === 'sem_justa_causa' ? '100% Liberado' :
               tipoDesligamento === 'acordo_mutuo' ? 'Até 80% Liberado' : 'Bloqueado'}
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] text-neutral-400 block">Seguro-Desemprego</span>
            <span className={`font-bold text-xs ${tipoDesligamento === 'sem_justa_causa' ? 'text-emerald-700' : 'text-rose-600'}`}>
              {tipoDesligamento === 'sem_justa_causa' ? 'Direito às Parcelas' : 'Sem Direito'}
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] text-neutral-400 block">Aviso Prévio ({avisoDays}d)</span>
            <span className="font-bold text-xs text-neutral-800">
              {tipoAviso === 'indenizado' ? '100% Indenizado' : tipoAviso === 'trabalhado' ? 'Trabalhado' : 'Sem Indenização'}
            </span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
              Resultado Final do Cálculo
            </span>
            <h3 className="text-2xl font-black text-white">
              Líquido Rescisório a Receber: <span className="text-emerald-400">{formatBRL(totalLiquido)}</span>
            </h3>
          </div>
          <div className="text-right text-xs text-neutral-300">
            <span>Rendimentos Brutos: <strong className="text-white">{formatBRL(proventosRendimentos)}</strong></span>
            <span className="block">Descontos: <strong className="text-red-300">{formatBRL(descontosTotais)}</strong></span>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Verba Rescisória / Rubrica</th>
                <th className="pb-3 text-right">Provento (R$)</th>
                <th className="pb-3 text-right">Desconto (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              <tr>
                <td className="py-2.5 font-medium">Saldo de Salário ({daysInMonth} dias)</td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{formatBRL(saldoSalario)}</td>
                <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
              </tr>

              {avisoPrevioValor !== 0 && (
                <tr>
                  <td className="py-2.5 font-medium">
                    Aviso Prévio ({avisoDays} dias {tipoAviso === 'indenizado' ? 'Indenizado' : 'Desconto'})
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-700">
                    {avisoPrevioValor > 0 ? formatBRL(avisoPrevioValor) : '-'}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-red-600">
                    {avisoPrevioValor < 0 ? formatBRL(Math.abs(avisoPrevioValor)) : '-'}
                  </td>
                </tr>
              )}

              {décimoTerceiro > 0 && (
                <tr>
                  <td className="py-2.5 font-medium">13º Salário Proporcional ({m13Final}/12 avos)</td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{formatBRL(décimoTerceiro)}</td>
                  <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
                </tr>
              )}

              {totalFerias > 0 && (
                <tr>
                  <td className="py-2.5 font-medium">
                    Férias Proporcionais/Vencidas ({mVacFinal}/12 avos + Terço Constitucional 1/3)
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{formatBRL(totalFerias)}</td>
                  <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
                </tr>
              )}

              {multaFGTS > 0 && (
                <tr>
                  <td className="py-2.5 font-medium">
                    Multa do FGTS ({tipoDesligamento === 'sem_justa_causa' ? '40%' : '20%'})
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{formatBRL(multaFGTS)}</td>
                  <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
                </tr>
              )}

              <tr>
                <td className="py-2.5 font-medium">INSS sobre Saldo de Salário</td>
                <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
                <td className="py-2.5 text-right font-mono font-bold text-red-600">{formatBRL(inssSaldoSalario)}</td>
              </tr>

              {inss13o > 0 && (
                <tr>
                  <td className="py-2.5 font-medium">INSS sobre 13º Salário Rescisório</td>
                  <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
                  <td className="py-2.5 text-right font-mono font-bold text-red-600">{formatBRL(inss13o)}</td>
                </tr>
              )}

              {irrfSaldoSalario > 0 && (
                <tr>
                  <td className="py-2.5 font-medium">IRRF sobre Saldo de Salário</td>
                  <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
                  <td className="py-2.5 text-right font-mono font-bold text-red-600">{formatBRL(irrfSaldoSalario)}</td>
                </tr>
              )}

              {irrf13o > 0 && (
                <tr>
                  <td className="py-2.5 font-medium">IRRF sobre 13º Salário Rescisório</td>
                  <td className="py-2.5 text-right font-mono text-neutral-400">-</td>
                  <td className="py-2.5 text-right font-mono font-bold text-red-600">{formatBRL(irrf13o)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-300 font-extrabold text-neutral-900 bg-neutral-50">
                <td className="py-3 pl-2">TOTAL LÍQUIDO A RECEBER</td>
                <td colSpan={2} className="py-3 pr-2 text-right text-base font-mono text-emerald-600">
                  {formatBRL(totalLiquido)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Seguro-Desemprego & FGTS Direct Release Box */}
      {seguroInfo.eligible ? (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-700/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm sm:text-base">Estimativa do Seguro-Desemprego (MTE 2026)</h3>
            </div>
            <span className="text-xs font-mono bg-blue-800 text-blue-200 px-2.5 py-1 rounded-full">
              Direito Garantido
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-700/50">
              <span className="text-blue-300 block text-[11px] mb-1">Valor Estimado por Parcela</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {formatBRL(seguroInfo.parcelAmount)}
              </div>
              <span className="text-[10px] text-blue-300/80 mt-0.5 block">Calculado sobre a média salarial</span>
            </div>

            <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-700/50">
              <span className="text-blue-300 block text-[11px] mb-1">Quantidade de Parcelas</span>
              <div className="text-lg font-bold font-mono text-white">
                {seguroInfo.parcelCount} Parcelas Mensais
              </div>
              <span className="text-[10px] text-blue-300/80 mt-0.5 block">Com base em {years} ano(s) de registro</span>
            </div>

            <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-700/50">
              <span className="text-blue-300 block text-[11px] mb-1">Total Potencial de Amparo</span>
              <div className="text-lg font-bold font-mono text-emerald-300">
                {formatBRL(seguroInfo.totalPotential)}
              </div>
              <span className="text-[10px] text-blue-300/80 mt-0.5 block">Soma de todas as parcelas</span>
            </div>
          </div>
          <p className="text-[11px] text-blue-200/90 mt-3 font-medium leading-normal">
            💡 <strong>Liberado também:</strong> Saque integral do seu saldo FGTS ({formatBRL(fgts)}) + Multa Rescisória de 40% ({formatBRL(multaFGTS)}).
          </p>
        </div>
      ) : (
        <div className="bg-neutral-100 border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-600 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-neutral-400 shrink-0" />
          <span>
            <strong>Seguro-Desemprego:</strong> {
              tipoDesligamento === 'pedido_demissao'
                ? 'Em casos de pedido de demissão, o trabalhador não tem direito ao Seguro-Desemprego nem ao saque do FGTS com multa.'
                : tipoDesligamento === 'acordo_mutuo'
                ? 'No acordo mútuo (Art. 484-A CLT), é liberado o saque de até 80% do FGTS e a multa de 20%, mas não há direito ao Seguro-Desemprego.'
                : 'Demissão com justa causa perde o direito ao Seguro-Desemprego e verbas indenizatórias.'
            }
          </span>
        </div>
      )}

      {onSelectTab && (
        <InternalLinkCTA
          currentTab="rescisao"
          onSelectTab={onSelectTab}
        />
      )}
    </div>
  );
}

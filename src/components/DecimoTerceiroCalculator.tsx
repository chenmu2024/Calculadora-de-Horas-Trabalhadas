import { copyText as writeClipboard } from '../utils/browser';
import { saveToHistory } from '../utils/history';
import { useState, useMemo } from 'react';
import { 
  Gift, 
  Calendar, 
  DollarSign, 
  Info, 
  Printer, 
  Copy, 
  Check, 
  Sparkles,
  HelpCircle,
  TrendingUp,
  BookmarkPlus
} from 'lucide-react';
import { calculateINSS, calculateIRRF, MINIMUM_WAGE_2026 } from '../utils/taxCalculations';
import InternalLinkCTA from './InternalLinkCTA';

interface DecimoTerceiroCalculatorProps {
  onSelectTab: (tab: string) => void;
}

export default function DecimoTerceiroCalculator({ onSelectTab }: DecimoTerceiroCalculatorProps) {
  const [salarioBruto, setSalarioBruto] = useState<number>(3000);
  const [mesesTrabalhados, setMesesTrabalhados] = useState<number>(12);
  const [dependentes, setDependentes] = useState<number>(0);
  const [incluirMedias, setIncluirMedias] = useState<boolean>(false);
  const [mediaHorasExtras, setMediaHorasExtras] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Quick Scenarios
  const applyScenario = (salario: number, meses: number) => {
    setSalarioBruto(salario);
    setMesesTrabalhados(meses);
    setIncluirMedias(false);
  };

  const results = useMemo(() => {
    const baseTotal = salarioBruto + (incluirMedias ? mediaHorasExtras : 0);
    const valorIntegralProporcional = (baseTotal / 12) * mesesTrabalhados;
    
    // 1ª Parcela (50% do proporcional, paga até 30 de Novembro - sem desconto de INSS/IRRF)
    const primeiraParcela = valorIntegralProporcional * 0.5;

    // 2ª Parcela (50% restante menos a totalidade do INSS e do IRRF incidentes sobre o total)
    const inss = calculateINSS(valorIntegralProporcional);
    const irrf = calculateIRRF(valorIntegralProporcional, dependentes, inss);
    const totalDescontos = inss + irrf;
    
    const segundaParcelaBruta = valorIntegralProporcional - primeiraParcela;
    const segundaParcelaLiquida = Math.max(0, segundaParcelaBruta - totalDescontos);
    const totalLiquido = primeiraParcela + segundaParcelaLiquida;

    return {
      baseTotal,
      valorIntegralProporcional,
      primeiraParcela,
      segundaParcelaBruta,
      inss,
      irrf,
      totalDescontos,
      segundaParcelaLiquida,
      totalLiquido
    };
  }, [salarioBruto, mesesTrabalhados, dependentes, incluirMedias, mediaHorasExtras]);

  const handleSaveToHistory = () => {
    try {
      const historyItem = {
        id: `13-${Date.now()}`,
        tab: 'decimo',
        title: `13º Salário (${mesesTrabalhados}/12 avos)`,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        summary: `Total Líquido: R$ ${results.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (1ª Parc: R$ ${results.primeiraParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
        data: {
          salarioBruto,
          mesesTrabalhados,
          primeiraParcela: results.primeiraParcela,
          segundaParcelaLiquida: results.segundaParcelaLiquida,
          totalLiquido: results.totalLiquido
        }
      };

      if (!saveToHistory({ toolTab: historyItem.tab, toolName: historyItem.title, summary: historyItem.summary, mainValue: `R$ ${results.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` })) return;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopySummary = async () => {
    const text = `💰 Resumo do 13º Salário CLT (2026)\n• Salário Base: R$ ${salarioBruto.toFixed(2)}\n• Meses: ${mesesTrabalhados}/12 avos\n• 1ª Parcela (sem descontos): R$ ${results.primeiraParcela.toFixed(2)}\n• 2ª Parcela Líquida: R$ ${results.segundaParcelaLiquida.toFixed(2)} (INSS: R$ ${results.inss.toFixed(2)}, IRRF: R$ ${results.irrf.toFixed(2)})\n• Total Líquido a Receber: R$ ${results.totalLiquido.toFixed(2)}\nCalculado em: calculadoradehorastrabalhadas.org/decimo-terceiro`;
    if (!await writeClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenarios */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Cenários Rápidos de 13º Salário (Clique para testar):</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyScenario(MINIMUM_WAGE_2026, 12)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-emerald-200 dark:border-neutral-700 hover:border-emerald-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Salário Mínimo (Ano Completo)
          </button>
          <button
            onClick={() => applyScenario(3000, 12)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-emerald-200 dark:border-neutral-700 hover:border-emerald-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            R$ 3.000 (12 Meses)
          </button>
          <button
            onClick={() => applyScenario(5000, 6)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-emerald-200 dark:border-neutral-700 hover:border-emerald-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            R$ 5.000 (Admissão no Meio do Ano - 6 Meses)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Gift className="w-5 h-5 text-emerald-600" />
            <span>Dados para o Cálculo do 13º Salário</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Salário Bruto Mensal Contratual (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
                <input aria-label="Salário Bruto Mensal Contratual (R$)"
                  type="number"
                  min="0"
                  step="50"
                  value={salarioBruto || ''}
                  onChange={(e) => setSalarioBruto(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="3000,00"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Meses Trabalhados no Ano (Fração ≥ 15 dias = 1 mês)
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  {mesesTrabalhados} / 12 avos
                </span>
              </div>
              <input aria-label="Meses Trabalhados no Ano (Fração ≥ 15 dias = 1 mês)"
                type="range"
                min="1"
                max="12"
                value={mesesTrabalhados}
                onChange={(e) => setMesesTrabalhados(parseInt(e.target.value) || 1)}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>1 mês</span>
                <span>6 meses</span>
                <span>12 meses (Ano Completo)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Número de Dependentes (para dedução do IRRF)
              </label>
              <input aria-label="Número de Dependentes (para dedução do IRRF)"
                type="number"
                min="0"
                max="15"
                value={dependentes}
                onChange={(e) => setDependentes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Dedução legal de R$ 189,59 por dependente no cálculo do Imposto de Renda.
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input aria-label={"Incluir média de Horas Extras / Adicionais recebidos no ano"}
                  type="checkbox"
                  checked={incluirMedias}
                  onChange={(e) => setIncluirMedias(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Incluir média de Horas Extras / Adicionais recebidos no ano
                </span>
              </label>

              {incluirMedias && (
                <div className="mt-3 pl-6">
                  <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Média Mensal de Horas Extras e Adicionais (R$)
                  </label>
                  <input aria-label="Média Mensal de Horas Extras e Adicionais (R$)"
                    type="number"
                    min="0"
                    step="10"
                    value={mediaHorasExtras || ''}
                    onChange={(e) => setMediaHorasExtras(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: 250,00"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Resultado Oficial CLT
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToHistory}
                  className="p-1.5 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
                  title="Salvar no Histórico"
                >
                  {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  <span>{saved ? 'Salvo!' : 'Salvar'}</span>
                </button>
                <button
                  onClick={handleCopySummary}
                  className="p-1.5 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
                  title="Copiar Resumo"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Main Total Callout */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Total Líquido do 13º Salário (Soma das 2 Parcelas)
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                R$ {results.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Base Proporcional ({mesesTrabalhados}/12): R$ {results.valorIntegralProporcional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* 2 Installments Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">1ª Parcela</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold">Até 30/Nov</span>
                </div>
                <div className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  R$ {results.primeiraParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-neutral-500">Adiantamento de 50% sem nenhum desconto de INSS ou IRRF.</p>
              </div>

              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">2ª Parcela Líquida</span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-1.5 py-0.5 rounded font-bold">Até 20/Dez</span>
                </div>
                <div className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  R$ {results.segundaParcelaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-neutral-500">Valor com dedução integral de INSS e Imposto de Renda.</p>
              </div>
            </div>

            {/* Deductions Table */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Desconto Previdenciário (INSS 2026):</span>
                <span className="font-semibold text-rose-600">- R$ {results.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Desconto Imposto de Renda (IRRF):</span>
                <span className="font-semibold text-rose-600">- R$ {results.irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 dark:text-white pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <span>Total de Descontos Oficiais:</span>
                <span className="text-rose-600">R$ {results.totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Step by step formula demonstration (Google Featured Snippet Magnet) */}
          <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/60 text-xs space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Passo a Passo da Fórmula Oficial CLT:</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li><strong>Proporcionalidade:</strong> (R$ {results.baseTotal.toFixed(2)} ÷ 12) × {mesesTrabalhados} = <strong>R$ {results.valorIntegralProporcional.toFixed(2)}</strong></li>
              <li><strong>1ª Parcela (50% Bruto):</strong> R$ {results.valorIntegralProporcional.toFixed(2)} × 50% = <strong>R$ {results.primeiraParcela.toFixed(2)}</strong></li>
              <li><strong>Descontos Previdenciários e Fiscais:</strong> Aplicados na 2ª parcela sobre o total proporcional (INSS: R$ {results.inss.toFixed(2)} + IRRF: R$ {results.irrf.toFixed(2)}).</li>
              <li><strong>2ª Parcela Líquida:</strong> R$ {results.segundaParcelaBruta.toFixed(2)} - R$ {results.totalDescontos.toFixed(2)} = <strong>R$ {results.segundaParcelaLiquida.toFixed(2)}</strong></li>
            </ol>
          </div>
        </div>
      </div>

      <InternalLinkCTA currentTab="decimo" onSelectTab={onSelectTab} />
    </div>
  );
}

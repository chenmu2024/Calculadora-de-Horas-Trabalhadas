import { copyText as writeClipboard } from '../utils/browser';
import { saveToHistory } from '../utils/history';
import { MINIMUM_WAGE_2026 } from '../utils/taxCalculations';
import { useState, useMemo } from 'react';
import { 
  Flame, 
  Biohazard, 
  DollarSign, 
  Info, 
  Sparkles, 
  Copy, 
  Check, 
  BookmarkPlus, 
  Scale,
  Percent
} from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';

interface InsalubridadePericulosidadeCalculatorProps {
  onSelectTab: (tab: string) => void;
}

export default function InsalubridadePericulosidadeCalculator({ onSelectTab }: InsalubridadePericulosidadeCalculatorProps) {
  const [salarioBase, setSalarioBase] = useState<number>(2500);
  const [salarioMinimo, setSalarioMinimo] = useState<number>(MINIMUM_WAGE_2026);
  const [tipoAdicional, setTipoAdicional] = useState<'insalubridade' | 'periculosidade'>('insalubridade');
  const [grauInsalubridade, setGrauInsalubridade] = useState<10 | 20 | 40>(20);
  const [baseCalculoInsalubridade, setBaseCalculoInsalubridade] = useState<'minimo' | 'base'>('minimo');
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const applyScenario = (tipo: 'insalubridade' | 'periculosidade', grau: 10 | 20 | 40, base: number) => {
    setTipoAdicional(tipo);
    setGrauInsalubridade(grau);
    setSalarioBase(base);
  };

  const results = useMemo(() => {
    let valorAdicional = 0;
    let percentual = 0;
    let baseUtilizada = 0;

    if (tipoAdicional === 'insalubridade') {
      percentual = grauInsalubridade;
      baseUtilizada = baseCalculoInsalubridade === 'minimo' ? salarioMinimo : salarioBase;
      valorAdicional = baseUtilizada * (grauInsalubridade / 100);
    } else {
      // Periculosidade: 30% sobre o salário base
      percentual = 30;
      baseUtilizada = salarioBase;
      valorAdicional = salarioBase * 0.30;
    }

    const salarioTotalComAdicional = salarioBase + valorAdicional;
    
    // Reflexos Mensais
    const reflexo13 = valorAdicional / 12;
    const reflexoFerias = (valorAdicional + (valorAdicional / 3)) / 12;
    const reflexoFGTS = valorAdicional * 0.08;

    return {
      valorAdicional,
      percentual,
      baseUtilizada,
      salarioTotalComAdicional,
      reflexo13,
      reflexoFerias,
      reflexoFGTS
    };
  }, [salarioBase, salarioMinimo, tipoAdicional, grauInsalubridade, baseCalculoInsalubridade]);

  const handleSaveToHistory = () => {
    try {
      const historyItem = {
        id: `insal-${Date.now()}`,
        tab: 'insalubridade',
        title: `Adicional de ${tipoAdicional === 'insalubridade' ? `Insalubridade (${results.percentual}%)` : 'Periculosidade (30%)'}`,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        summary: `Adicional: R$ ${results.valorAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Total: R$ ${results.salarioTotalComAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        data: {
          tipoAdicional,
          salarioBase,
          valorAdicional: results.valorAdicional,
          salarioTotalComAdicional: results.salarioTotalComAdicional
        }
      };

      if (!saveToHistory({ toolTab: historyItem.tab, toolName: historyItem.title, summary: historyItem.summary, mainValue: `R$ ${results.valorAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` })) return;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopySummary = async () => {
    const text = `⚠️ Resumo de Adicional CLT (2026)\n• Salário Base: R$ ${salarioBase.toFixed(2)}\n• Tipo: ${tipoAdicional === 'insalubridade' ? `Insalubridade Grau ${grauInsalubridade}%` : 'Periculosidade 30%'}\n• Valor do Adicional Mensal: R$ ${results.valorAdicional.toFixed(2)}\n• Salário Bruto Final: R$ ${results.salarioTotalComAdicional.toFixed(2)}\nCalculado em: calculadoradehorastrabalhadas.org/insalubridade-e-periculosidade`;
    if (!await writeClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenarios */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/40">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-900 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Cenários Mais Comuns (Clique para carregar):</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyScenario('insalubridade', 20, 2000)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-amber-200 dark:border-neutral-700 hover:border-amber-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Insalubridade Média 20% (Hospital/Limpeza)
          </button>
          <button
            onClick={() => applyScenario('insalubridade', 40, 2500)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-amber-200 dark:border-neutral-700 hover:border-amber-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Insalubridade Máxima 40% (Esgoto/Raio-X)
          </button>
          <button
            onClick={() => applyScenario('periculosidade', 20, 3200)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-amber-200 dark:border-neutral-700 hover:border-amber-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Periculosidade 30% (Eletricista/Vigilante/Motoboy)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Biohazard className="w-5 h-5 text-amber-600" />
            <span>Configuração do Adicional</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Escolha o Tipo de Adicional
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoAdicional('insalubridade')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tipoAdicional === 'insalubridade'
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-800 dark:text-amber-300 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Biohazard className="w-4 h-4 text-amber-600" />
                  <span>Insalubridade (10%, 20%, 40%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoAdicional('periculosidade')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tipoAdicional === 'periculosidade'
                      ? 'bg-orange-50 dark:bg-orange-950/50 border-orange-500 text-orange-800 dark:text-orange-300 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>Periculosidade (30%)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Salário Base Contratual (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">R$</span>
                <input aria-label="Salário Base Contratual (R$)"
                  type="number"
                  min="0"
                  step="50"
                  value={salarioBase || ''}
                  onChange={(e) => setSalarioBase(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {tipoAdicional === 'insalubridade' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Grau de Insalubridade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGrauInsalubridade(10)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold ${
                        grauInsalubridade === 10
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Mínimo (10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrauInsalubridade(20)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold ${
                        grauInsalubridade === 20
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Médio (20%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrauInsalubridade(40)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold ${
                        grauInsalubridade === 40
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Máximo (40%)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Base de Cálculo da Insalubridade
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBaseCalculoInsalubridade('minimo')}
                      className={`py-2 px-2 rounded-xl border text-xs font-medium ${
                        baseCalculoInsalubridade === 'minimo'
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200 font-bold'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Salário Mínimo (CLT Padrão)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBaseCalculoInsalubridade('base')}
                      className={`py-2 px-2 rounded-xl border text-xs font-medium ${
                        baseCalculoInsalubridade === 'base'
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200 font-bold'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Salário Base (Convenção CCT)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Resultado do Adicional
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToHistory}
                  className="p-1.5 text-neutral-500 hover:text-amber-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
                >
                  {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  <span>{saved ? 'Salvo!' : 'Salvar'}</span>
                </button>
                <button
                  onClick={handleCopySummary}
                  className="p-1.5 text-neutral-500 hover:text-amber-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Valor do Adicional a Receber por Mês
              </span>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                + R$ {results.valorAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Alíquota de <strong>{results.percentual}%</strong> sobre a base de R$ {results.baseUtilizada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
              </p>
            </div>

            <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 space-y-1">
              <span className="text-xs text-neutral-500">Salário Bruto Total (Base + Adicional)</span>
              <div className="text-xl font-extrabold text-neutral-900 dark:text-white">
                R$ {results.salarioTotalComAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block">Reflexos Obrigatórios:</span>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Reflexo no 13º Salário (por mês):</span>
                <span className="font-semibold text-emerald-600">+ R$ {results.reflexo13.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Reflexo em Férias + 1/3 (por mês):</span>
                <span className="font-semibold text-emerald-600">+ R$ {results.reflexoFerias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Depósito Extra de FGTS (8%):</span>
                <span className="font-semibold text-blue-600">+ R$ {results.reflexoFGTS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/60 text-xs space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Diferença Legal entre Insalubridade e Periculosidade:</span>
            </h3>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>• <strong>Insalubridade:</strong> Risco gradual à saúde (ruído, produtos químicos, biológicos). Calculado sobre o salário mínimo (Súmula Vinculante 4 STF).</li>
              <li>• <strong>Periculosidade:</strong> Risco iminente de morte (eletricidade, inflamáveis, explosivos, segurança armada, motoboys). Calculado sempre sobre o salário base contratual (30%).</li>
            </ul>
          </div>
        </div>
      </div>

      <InternalLinkCTA currentTab="insalubridade" onSelectTab={onSelectTab} />
    </div>
  );
}

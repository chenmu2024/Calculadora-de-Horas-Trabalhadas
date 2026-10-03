import { copyText as writeClipboard } from '../utils/browser';
import { saveToHistory } from '../utils/history';
import { useState, useMemo } from 'react';
import { 
  Scale, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Info, 
  Sparkles, 
  Copy, 
  Check, 
  BookmarkPlus,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { calculateINSS, calculateIRRF, MINIMUM_WAGE_2026 } from '../utils/taxCalculations';
import InternalLinkCTA from './InternalLinkCTA';

interface CltVsPjCalculatorProps {
  onSelectTab: (tab: string) => void;
}

export default function CltVsPjCalculator({ onSelectTab }: CltVsPjCalculatorProps) {
  const [salarioCltBruto, setSalarioCltBruto] = useState<number>(5000);
  const [beneficiosClt, setBeneficiosClt] = useState<number>(1000); // VR + VA + Plano
  const [propostaPj, setPropostaPj] = useState<number>(8500);
  const [impostoPjPercent, setImpostoPjPercent] = useState<number>(6); // Simples Nacional Anexo III
  const [custoContador, setCustoContador] = useState<number>(200);
  const [gastosPropriosPj, setGastosPropriosPj] = useState<number>(1000); // Plano de saúde e refeição pagos pelo PJ
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const applyScenario = (clt: number, pj: number, ben: number) => {
    setSalarioCltBruto(clt);
    setPropostaPj(pj);
    setBeneficiosClt(ben);
  };

  const results = useMemo(() => {
    // 1. CLT Calculations
    const inssClt = calculateINSS(salarioCltBruto);
    const irrfClt = calculateIRRF(salarioCltBruto, 0, inssClt);
    const cltLiquidoMensal = salarioCltBruto - inssClt - irrfClt;

    // Benefícios CLT convertidos em base mensal
    const parcela13Mensal = salarioCltBruto / 12;
    const parcelaFeriasMensal = (salarioCltBruto + (salarioCltBruto / 3)) / 12;
    const fgtsMensal = salarioCltBruto * 0.08;
    const multaFgtsMensal = fgtsMensal * 0.40; // Multa rescisória provisionada
    
    const cltTotalPacoteMensal = cltLiquidoMensal + beneficiosClt + parcela13Mensal + (salarioCltBruto / 36) + fgtsMensal;

    // 2. PJ Calculations
    const impostoDasPj = propostaPj * (impostoPjPercent / 100);
    const inssProLabore = MINIMUM_WAGE_2026 * 0.11; // 11% sobre salário mínimo
    const totalDespesasPj = impostoDasPj + inssProLabore + custoContador + gastosPropriosPj;
    const pjLiquidoEfetivo = Math.max(0, propostaPj - totalDespesasPj);

    // 3. Salário PJ Mínimo Equivalente recomendado (Regra de ouro: CLT x 1.6 a 1.8)
    const pjEquivalenteSugerido = (salarioCltBruto * 1.55) + beneficiosClt;

    const diferencaLiquida = pjLiquidoEfetivo - cltLiquidoMensal;
    const melhorOpcao = pjLiquidoEfetivo > (cltLiquidoMensal + beneficiosClt) ? 'PJ' : 'CLT';

    return {
      inssClt,
      irrfClt,
      cltLiquidoMensal,
      cltTotalPacoteMensal,
      impostoDasPj,
      inssProLabore,
      totalDespesasPj,
      pjLiquidoEfetivo,
      pjEquivalenteSugerido,
      diferencaLiquida,
      melhorOpcao
    };
  }, [salarioCltBruto, beneficiosClt, propostaPj, impostoPjPercent, custoContador, gastosPropriosPj]);

  const handleSaveToHistory = () => {
    try {
      const historyItem = {
        id: `cltpj-${Date.now()}`,
        tab: 'cltpj',
        title: `Comparativo CLT (R$ ${salarioCltBruto}) x PJ (R$ ${propostaPj})`,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        summary: `Vencedor: ${results.melhorOpcao} | Líquido CLT: R$ ${results.cltLiquidoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Líquido PJ: R$ ${results.pjLiquidoEfetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        data: {
          salarioCltBruto,
          propostaPj,
          cltLiquidoMensal: results.cltLiquidoMensal,
          pjLiquidoEfetivo: results.pjLiquidoEfetivo,
          pjEquivalenteSugerido: results.pjEquivalenteSugerido
        }
      };

      if (!saveToHistory({ toolTab: historyItem.tab, toolName: historyItem.title, summary: historyItem.summary, mainValue: `R$ ${results.pjLiquidoEfetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` })) return;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopySummary = async () => {
    const text = `⚖️ Comparativo CLT x PJ 2026\n• Salário CLT Bruto: R$ ${salarioCltBruto.toFixed(2)} → Líquido no Bolso: R$ ${results.cltLiquidoMensal.toFixed(2)} (Pacote Total com Benefícios: R$ ${results.cltTotalPacoteMensal.toFixed(2)})\n• Faturamento PJ: R$ ${propostaPj.toFixed(2)} → Líquido Livre: R$ ${results.pjLiquidoEfetivo.toFixed(2)}\n• PJ Recomendado para empatar: R$ ${results.pjEquivalenteSugerido.toFixed(2)}\n• Veredito: Mais vantajoso financeiramente em ${results.melhorOpcao}\nCalculado em: calculadoradehorastrabalhadas.org/calculadora-clt-pj`;
    if (!await writeClipboard(text)) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenarios */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-900 dark:text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Cenários de Proposta CLT x PJ (Clique para carregar):</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyScenario(3500, 6000, 800)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-neutral-700 hover:border-blue-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Júnior (CLT R$ 3.500 x PJ R$ 6.000)
          </button>
          <button
            onClick={() => applyScenario(7000, 12000, 1200)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-neutral-700 hover:border-blue-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Pleno (CLT R$ 7.000 x PJ R$ 12.000)
          </button>
          <button
            onClick={() => applyScenario(12000, 20000, 1800)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-neutral-700 hover:border-blue-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Sênior / Dev (CLT R$ 12.000 x PJ R$ 20.000)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs CLT & PJ */}
        <div className="lg:col-span-6 space-y-4">
          {/* CLT Box */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>1. Condições CLT (Carteira Assinada)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Salário CLT Bruto (R$)
                </label>
                <input aria-label="Salário CLT Bruto (R$)"
                  type="number"
                  min="0"
                  step="100"
                  value={salarioCltBruto || ''}
                  onChange={(e) => setSalarioCltBruto(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Benefícios Mensais (VR+VA+Plano)
                </label>
                <input aria-label="Benefícios Mensais (VR+VA+Plano)"
                  type="number"
                  min="0"
                  step="50"
                  value={beneficiosClt || ''}
                  onChange={(e) => setBeneficiosClt(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* PJ Box */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>2. Condições PJ (Pessoa Jurídica)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Valor da Nota Fiscal PJ (R$)
                </label>
                <input aria-label="Valor da Nota Fiscal PJ (R$)"
                  type="number"
                  min="0"
                  step="100"
                  value={propostaPj || ''}
                  onChange={(e) => setPropostaPj(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Alíquota de Imposto Simples (%)
                </label>
                <select aria-label="Alíquota de Imposto Simples (%)"
                  value={impostoPjPercent}
                  onChange={(e) => setImpostoPjPercent(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={6}>6% (Anexo III - Fator R)</option>
                  <option value={15.5}>15.5% (Anexo V - Sem Fator R)</option>
                  <option value={10}>10% (Alíquota Média)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Contabilidade Mensal (R$)
                </label>
                <input aria-label="Contabilidade Mensal (R$)"
                  type="number"
                  min="0"
                  step="50"
                  value={custoContador || ''}
                  onChange={(e) => setCustoContador(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Seus Gastos com Saúde/VR (R$)
                </label>
                <input aria-label="Seus Gastos com Saúde/VR (R$)"
                  type="number"
                  min="0"
                  step="50"
                  value={gastosPropriosPj || ''}
                  onChange={(e) => setGastosPropriosPj(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Comparison Outputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Resultado do Comparativo
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToHistory}
                  className="p-1.5 text-neutral-500 hover:text-blue-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
                >
                  {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  <span>{saved ? 'Salvo!' : 'Salvar'}</span>
                </button>
                <button
                  onClick={handleCopySummary}
                  className="p-1.5 text-neutral-500 hover:text-blue-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">CLT Líquido no Bolso</span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  R$ {results.cltLiquidoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-neutral-500">
                  + Pacote de benefícios (13º, Férias, FGTS): <strong>R$ {results.cltTotalPacoteMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</strong>
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">PJ Líquido Livre</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  R$ {results.pjLiquidoEfetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-neutral-500">
                  Após DAS ({impostoPjPercent}%), INSS pró-labore, contador e despesas de saúde/refeição.
                </p>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Valor Mínimo PJ Recomendado para empatar com a CLT:
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  Regra 1.55x
                </span>
              </div>
              <div className="text-xl font-extrabold text-neutral-900 dark:text-white">
                R$ {results.pjEquivalenteSugerido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Para compensar a perda do 13º salário, férias remuneradas com 1/3, 8% de FGTS e benefícios da empresa, cobre pelo menos este valor como PJ.
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/60 text-xs space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>O que considerar ao migrar de CLT para PJ:</span>
            </h3>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li>• <strong>Fator R do Simples Nacional:</strong> Se sua folha de pró-labore representar 28% do faturamento, seu imposto cai de 15,5% para 6%.</li>
              <li>• <strong>Reserva Financeira:</strong> PJ não tem multa de 40% do FGTS nem aviso prévio indenizado. Mantenha 6 meses de despesas guardadas.</li>
            </ul>
          </div>
        </div>
      </div>

      <InternalLinkCTA currentTab="cltpj" onSelectTab={onSelectTab} />
    </div>
  );
}

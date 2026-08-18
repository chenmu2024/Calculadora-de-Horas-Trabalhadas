import { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  DollarSign, 
  Calendar, 
  Info, 
  HelpCircle, 
  Sparkles, 
  Copy, 
  Check, 
  BookmarkPlus,
  CheckCircle2
} from 'lucide-react';
import InternalLinkCTA from './InternalLinkCTA';

interface SeguroDesempregoCalculatorProps {
  onSelectTab: (tab: string) => void;
}

export default function SeguroDesempregoCalculator({ onSelectTab }: SeguroDesempregoCalculatorProps) {
  const [solicitacao, setSolicitacao] = useState<'1' | '2' | '3'>('1');
  const [mesesTrabalhados, setMesesTrabalhados] = useState<number>(18);
  const [salario1, setSalario1] = useState<number>(2800);
  const [salario2, setSalario2] = useState<number>(2800);
  const [salario3, setSalario3] = useState<number>(2800);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const applyScenario = (sol: '1' | '2' | '3', meses: number, salario: number) => {
    setSolicitacao(sol);
    setMesesTrabalhados(meses);
    setSalario1(salario);
    setSalario2(salario);
    setSalario3(salario);
  };

  const results = useMemo(() => {
    const mediaSalarial = (salario1 + salario2 + salario3) / 3;
    const SALARIO_MINIMO = 1518;
    const TETO_SEGURO = 2313.74;

    // Valor da parcela (Tabela oficial MTE)
    let valorParcela = 0;
    if (mediaSalarial <= 2041.39) {
      valorParcela = mediaSalarial * 0.8;
    } else if (mediaSalarial <= 3402.65) {
      valorParcela = 1633.11 + ((mediaSalarial - 2041.39) * 0.5);
    } else {
      valorParcela = TETO_SEGURO;
    }

    // O valor não pode ser inferior ao salário mínimo
    valorParcela = Math.max(SALARIO_MINIMO, Math.min(TETO_SEGURO, valorParcela));

    // Determinação do número de parcelas
    let numParcelas = 0;
    let elegivel = true;
    let motivoInelegivel = '';

    if (solicitacao === '1') {
      if (mesesTrabalhados < 12) {
        elegivel = false;
        motivoInelegivel = 'Para a 1ª solicitação, é exigido no mínimo 12 meses de vínculo nos últimos 18 meses.';
      } else if (mesesTrabalhados <= 23) {
        numParcelas = 4;
      } else {
        numParcelas = 5;
      }
    } else if (solicitacao === '2') {
      if (mesesTrabalhados < 9) {
        elegivel = false;
        motivoInelegivel = 'Para a 2ª solicitação, é exigido no mínimo 9 meses de vínculo nos últimos 12 meses.';
      } else if (mesesTrabalhados <= 11) {
        numParcelas = 3;
      } else if (mesesTrabalhados <= 23) {
        numParcelas = 4;
      } else {
        numParcelas = 5;
      }
    } else {
      // 3ª solicitação ou mais
      if (mesesTrabalhados < 6) {
        elegivel = false;
        motivoInelegivel = 'A partir da 3ª solicitação, é exigido no mínimo 6 meses de trabalho ininterrupto.';
      } else if (mesesTrabalhados <= 11) {
        numParcelas = 3;
      } else if (mesesTrabalhados <= 23) {
        numParcelas = 4;
      } else {
        numParcelas = 5;
      }
    }

    const totalBeneficio = elegivel ? valorParcela * numParcelas : 0;

    return {
      mediaSalarial,
      valorParcela,
      numParcelas,
      totalBeneficio,
      elegivel,
      motivoInelegivel
    };
  }, [solicitacao, mesesTrabalhados, salario1, salario2, salario3]);

  const handleSaveToHistory = () => {
    try {
      const historyItem = {
        id: `seguro-${Date.now()}`,
        tab: 'seguro',
        title: `Seguro-Desemprego (${results.numParcelas} parcelas)`,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        summary: `Parcela: R$ ${results.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} x ${results.numParcelas} = Total: R$ ${results.totalBeneficio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        data: {
          solicitacao,
          mesesTrabalhados,
          mediaSalarial: results.mediaSalarial,
          valorParcela: results.valorParcela,
          numParcelas: results.numParcelas,
          totalBeneficio: results.totalBeneficio
        }
      };

      const existingHistory = JSON.parse(localStorage.getItem('calc_history') || '[]');
      const updatedHistory = [historyItem, ...existingHistory.slice(0, 49)];
      localStorage.setItem('calc_history', JSON.stringify(updatedHistory));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopySummary = () => {
    const text = `📋 Resumo do Seguro-Desemprego 2026\n• Média dos 3 Últimos Salários: R$ ${results.mediaSalarial.toFixed(2)}\n• Solicitação: ${solicitacao}ª vez (${mesesTrabalhados} meses trabalhados)\n• Quantidade de Parcelas: ${results.numParcelas} parcelas\n• Valor de Cada Parcela: R$ ${results.valorParcela.toFixed(2)}\n• Total Previsto do Benefício: R$ ${results.totalBeneficio.toFixed(2)}\nCalculado em: calculadoradehorastrabalhadas.org/seguro-desemprego`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenarios */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-900 dark:text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Cenários Comuns de Solicitação (Clique para aplicar):</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyScenario('1', 18, 2500)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-neutral-700 hover:border-blue-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            1ª Vez (18 Meses Trabalhados - R$ 2.500)
          </button>
          <button
            onClick={() => applyScenario('1', 24, 4000)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-neutral-700 hover:border-blue-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Teto Máximo (24 Meses - R$ 4.000)
          </button>
          <button
            onClick={() => applyScenario('2', 10, 2000)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-blue-200 dark:border-neutral-700 hover:border-blue-500 font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            2ª Vez (10 Meses Trabalhados - R$ 2.000)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <span>Dados para o Cálculo do Seguro-Desemprego</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Quantas vezes você já solicitou o seguro-desemprego?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSolicitacao('1')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    solicitacao === '1'
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  1ª Solicitação
                </button>
                <button
                  type="button"
                  onClick={() => setSolicitacao('2')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    solicitacao === '2'
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  2ª Solicitação
                </button>
                <button
                  type="button"
                  onClick={() => setSolicitacao('3')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    solicitacao === '3'
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  3ª ou mais
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Meses Trabalhados nos últimos 36 meses
                </label>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                  {mesesTrabalhados} meses
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="36"
                value={mesesTrabalhados}
                onChange={(e) => setMesesTrabalhados(parseInt(e.target.value) || 1)}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg"
              />
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                Últimos 3 Salários Brutos Recebidos (R$)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Último mês (Mês 1)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={salario1 || ''}
                    onChange={(e) => setSalario1(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Penúltimo (Mês 2)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={salario2 || ''}
                    onChange={(e) => setSalario2(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Antepenúltimo (Mês 3)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={salario3 || ''}
                    onChange={(e) => setSalario3(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Resultado do Seguro-Desemprego
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

            {results.elegivel ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                    Valor de Cada Parcela Mensal
                  </span>
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    R$ {results.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Você tem direito a <strong>{results.numParcelas} parcelas</strong> consecutivas.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
                    <span className="text-[11px] text-neutral-500 block">Total do Benefício</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">
                      R$ {results.totalBeneficio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
                    <span className="text-[11px] text-neutral-500 block">Média Salarial Apurada</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">
                      R$ {results.mediaSalarial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-2">
                <span className="text-sm font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  Requisito Mínimo Não Atingido
                </span>
                <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed">
                  {results.motivoInelegivel}
                </p>
              </div>
            )}
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/60 text-xs space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Regras Oficiais do Seguro-Desemprego 2026:</span>
            </h3>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>• <strong>Piso Nacional:</strong> Nenhuma parcela pode ser inferior a R$ 1.518,00 (Salário Mínimo).</li>
              <li>• <strong>Teto Máximo:</strong> O valor máximo por parcela é de R$ 2.313,74.</li>
              <li>• <strong>Prazo para requerer:</strong> De 7 a 120 dias corridos após a demissão sem justa causa.</li>
            </ul>
          </div>
        </div>
      </div>

      <InternalLinkCTA currentTab="seguro" onSelectTab={onSelectTab} />
    </div>
  );
}

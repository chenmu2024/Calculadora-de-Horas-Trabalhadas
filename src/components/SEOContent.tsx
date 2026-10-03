import { copyText as writeClipboard } from '../utils/browser';
import { MouseEvent, useState } from 'react';
import EATBadge from './EATBadge';
import RatingWidget from './RatingWidget';
import { getHrefForTab } from '../utils/routes';
import { 
  BookOpen, 
  Clock, 
  Calculator, 
  Scale, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  FileSpreadsheet, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Moon,
  Calendar,
  FileText,
  Percent
} from 'lucide-react';

interface SEOContentProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function SEOContent({ activeTab = 'daily', onSelectTab }: SEOContentProps) {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleTabClick = (e: MouseEvent, tab: string) => {
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(tab);
      const calcElem = document.getElementById('main-calculator') || document.querySelector('main');
      if (calcElem) {
        calcElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    if (!await writeClipboard(text)) return;
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const renderDailyContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs border border-blue-200 dark:border-blue-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia Oficial CLT 2026</span>
        </div>
        <h2 id="como-calcular-hora-de-trabalho" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Calcular Horas Trabalhadas no Dia? (Guia Completo de Ponto CLT)
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Aprenda o passo a passo exato para calcular horas trabalhadas com 4 batidas de ponto, desconto do intervalo intrajornada (almoço), conversão de minutos para decimal e a regra da tolerância legal de 10 minutos conforme o <strong>Art. 58, § 1º da CLT</strong> e <strong>Súmula 366 do TST</strong>.
        </p>
      </div>

      {/* Step by step */}
      <section className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>1. Fórmula Oficial de Cálculo da Jornada Diária</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Para apurar o total de horas líquidas trabalhadas no dia com intervalo de almoço, divide-se o dia em dois turnos e soma-se o tempo de cada um:
        </p>
        
        <div className="p-4 bg-neutral-900 text-white rounded-2xl font-mono text-xs sm:text-sm relative overflow-x-auto shadow-sm">
          <code>Total de Horas = (Saída 1 - Entrada 1) + (Saída 2 - Entrada 2)</code>
          <button
            onClick={() => copyToClipboard('Total de Horas = (Saida 1 - Entrada 1) + (Saida 2 - Entrada 2)', 'f-daily')}
            className="absolute top-3 right-3 p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copiedFormula === 'f-daily' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFormula === 'f-daily' ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 sm:p-5 space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Exemplo Prático de Batida de Ponto:</span>
          </h4>
          <ul className="text-xs text-blue-900 dark:text-blue-300 space-y-1.5 pl-4 list-disc">
            <li><strong>Entrada 1:</strong> 08:00 | <strong>Saída Almoço (Saída 1):</strong> 12:00 → <em>1º Turno: 4 horas</em></li>
            <li><strong>Volta Almoço (Entrada 2):</strong> 13:00 | <strong>Saída Final (Saída 2):</strong> 17:00 → <em>2º Turno: 4 horas</em></li>
            <li><strong>Total Líquido:</strong> 4h + 4h = <strong>8 horas trabalhadas</strong> (1 hora de almoço desconsiderada).</li>
          </ul>
        </div>
      </section>

      {/* Regras CLT */}
      <section className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-6">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>2. Regras Essenciais da CLT para Horas Diárias</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
            <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tolerância Legal de 10 Minutos
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              O Art. 58, § 1º da CLT estabelece que variações de até 5 minutos na entrada/saída (máximo 10 min diários) não são descontadas nem pagas como hora extra. Se ultrapassar 10 minutos, o valor <strong>integral</strong> é apurado (Súmula 366 do TST).
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
            <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Intervalo Intrajornada (Art. 71)
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Jornadas acima de 6 horas diárias exigem no mínimo <strong>1 hora</strong> de intervalo para repouso e alimentação. Jornadas entre 4h e 6h exigem 15 minutos obrigatórios.
            </p>
          </div>
        </div>
      </section>

      {/* Conversão minutos para decimal */}
      <section className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-6">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Percent className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>3. Tabela de Conversão: Minutos para Horas Decimais (Centesimais)</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Para multiplicar as horas pelo valor do salário, é obrigatório converter os minutos sexagesimais (base 60) em números decimais (Minutos ÷ 60):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
            <div className="font-bold text-neutral-900 dark:text-white">15 minutos</div>
            <div className="text-blue-600 dark:text-blue-400 font-mono font-bold">= 0,25h</div>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
            <div className="font-bold text-neutral-900 dark:text-white">30 minutos</div>
            <div className="text-blue-600 dark:text-blue-400 font-mono font-bold">= 0,50h</div>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
            <div className="font-bold text-neutral-900 dark:text-white">45 minutos</div>
            <div className="text-blue-600 dark:text-blue-400 font-mono font-bold">= 0,75h</div>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center">
            <div className="font-bold text-neutral-900 dark:text-white">48 minutos</div>
            <div className="text-blue-600 dark:text-blue-400 font-mono font-bold">= 0,80h</div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderOvertimeContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold rounded-lg text-xs border border-amber-200 dark:border-amber-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Legislação Trabalhista - Art. 59 da CLT</span>
        </div>
        <h2 id="guia-horas-extras" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Calcular Horas Extras de 50% e 100% e Reflexo no DSR
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Entenda a fórmula matemática oficial para apurar horas extras diárias, acréscimos legais de 50% (dias úteis), 100% (domingos e feriados) e o cálculo do reflexo no <strong>Descanso Semanal Remunerado (DSR)</strong> conforme a <strong>Súmula 172 do TST</strong>.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>Fórmulas Oficiais de Hora Extra</span>
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-neutral-900 text-white rounded-2xl font-mono text-xs sm:text-sm relative">
            <p className="text-neutral-400 text-[10px] uppercase font-sans font-bold mb-1">1. Hora Extra 50% (Dias Úteis e Sábados):</p>
            <code>Valor Hora Extra 50% = (Salário Base ÷ 220) × 1,50</code>
          </div>

          <div className="p-4 bg-neutral-900 text-white rounded-2xl font-mono text-xs sm:text-sm relative">
            <p className="text-neutral-400 text-[10px] uppercase font-sans font-bold mb-1">2. Hora Extra 100% (Domingos e Feriados - Súmula 146 TST):</p>
            <code>Valor Hora Extra 100% = (Salário Base ÷ 220) × 2,00</code>
          </div>

          <div className="p-4 bg-neutral-900 text-white rounded-2xl font-mono text-xs sm:text-sm relative">
            <p className="text-neutral-400 text-[10px] uppercase font-sans font-bold mb-1">3. Reflexo no DSR (Lei 605/49 e Súmula 172 TST):</p>
            <code>DSR = (Total R$ das Horas Extras do Mês ÷ Dias Úteis) × (Domingos e Feriados)</code>
          </div>
        </div>
      </section>

      <section className="space-y-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5">
        <h4 className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Limite Máximo Diário de Horas Extras</span>
        </h4>
        <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
          Pelo Art. 59 da CLT, o limite máximo de prorrogação de jornada é de <strong>2 horas extras por dia</strong>, mediante acordo individual escrito, convenção ou acordo coletivo de trabalho. Horas extras habituais integram a base de cálculo de férias, 13º salário, FGTS e aviso prévio indenizado.
        </p>
      </section>
    </div>
  );

  const renderNightContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-xs border border-indigo-200 dark:border-indigo-800">
          <Moon className="w-3.5 h-3.5" />
          <span>Jornada Noturna - Art. 73 da CLT</span>
        </div>
        <h2 id="guia-adicional-noturno" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Adicional Noturno Urbano e a Redução da Hora Ficta (52min30s)
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Entenda como funciona o trabalho no horário noturno urbano (das 22h às 05h), o adicional financeiro de no mínimo <strong>20%</strong> e o benefício legal da <strong>hora noturna reduzida (hora ficta)</strong>.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>1. O Que É a Hora Noturna Reduzida (Hora Ficta)?</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Conforme o Art. 73, § 1º da CLT, para o trabalhador urbano, <strong>1 hora noturna equivale a 52 minutos e 30 segundos</strong> (52,5 minutos). Isso significa que 7 horas de relógio trabalhadas no período das 22h às 05h equivalem a <strong>8 horas computadas para pagamento</strong> (Fator de multiplicação 60 / 52,5 = <strong>1,142857</strong>).
        </p>

        <div className="p-4 bg-neutral-900 text-white rounded-2xl font-mono text-xs sm:text-sm">
          <code>Horas Computadas = Horas Noturnas Relógio × (60 ÷ 52,5) = Horas Relógio × 1,142857</code>
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-6">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>2. Prorrogação da Jornada Noturna (Súmula 60, II do TST)</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Se o colaborador cumpre integralmente a jornada no período noturno (das 22h às 05h) e continua trabalhando além das 05h da manhã, as horas prorrogadas <strong>continuam recebendo o adicional noturno de 20%</strong> conforme a jurisprudência pacífica do Tribunal Superior do Trabalho.
        </p>
      </section>
    </div>
  );

  const renderBancoContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg text-xs border border-emerald-200 dark:border-emerald-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reforma Trabalhista - Art. 59 §§ 2º e 5º</span>
        </div>
        <h2 id="guia-banco-de-horas" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Banco de Horas CLT: Prazos de Validade, Compensação e Rescisão
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Tudo o que você precisa saber sobre as regras do Banco de Horas positivo e negativo, prazos legais de compensação (6 meses ou 1 ano) e o que acontece com as horas restantes na rescisão do contrato de trabalho.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Acordo Individual (Até 6 Meses)
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Desde a Reforma Trabalhista (Lei 13.467/17), o banco de horas pode ser pactuado por <strong>acordo individual escrito</strong> direto entre empresa e empregado, desde que a compensação ocorra no período máximo de 6 meses (Art. 59, § 5º).
          </p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Acordo Coletivo (Até 1 Ano)
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Se for estabelecido via Acordo ou Convenção Coletiva de Trabalho com o Sindicato da categoria, a validade do banco de horas pode ser de até <strong>1 ano</strong> (Art. 59, § 2º).
          </p>
        </div>
      </div>

      <section className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl space-y-2">
        <h4 className="font-bold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Quitação Obrigatória na Rescisão (Art. 59, § 3º da CLT)</span>
        </h4>
        <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
          Na hipótese de rescisão do contrato de trabalho sem que tenha havido a compensação integral da jornada extraordinária, o trabalhador terá direito ao pagamento das horas extras não compensadas calculadas sobre o valor da remuneração na data da rescisão (com acréscimo mínimo de 50%).
        </p>
      </section>
    </div>
  );

  const renderHoleriteContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg text-xs border border-emerald-200 dark:border-emerald-800">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Folha de Pagamento & Salário Líquido 2026</span>
        </div>
        <h2 id="guia-holerite" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Calcular Salário Líquido no Holerite (Tabelas INSS e IRRF 2026)
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Entenda passo a passo todas as deduções oficiais do contracheque: cálculo progressivo do INSS, alíquotas e faixas do Imposto de Renda (IRRF), desconto de Vale-Transporte (6%) e adicionais salariais.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Percent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>1. Tabela de Desconto Progressivo do INSS 2026</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          O INSS é calculado por faixas salariais fatiadas (cada parte do salário é tributada na respectiva alíquota de 7,5%, 9%, 12% ou 14% até o teto previdenciário):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-500 font-semibold block">1ª Faixa</span>
            <div className="font-bold text-neutral-900 dark:text-white">Até R$ 1.621,00</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">Alíquota: 7,5%</div>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-500 font-semibold block">2ª Faixa</span>
            <div className="font-bold text-neutral-900 dark:text-white">De R$ 1.621,01 a R$ 2.902,84</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">Alíquota: 9,0%</div>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-500 font-semibold block">3ª Faixa</span>
            <div className="font-bold text-neutral-900 dark:text-white">De R$ 2.902,85 a R$ 4.354,27</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">Alíquota: 12,0%</div>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-500 font-semibold block">4ª Faixa</span>
            <div className="font-bold text-neutral-900 dark:text-white">De R$ 4.354,28 a R$ 8.475,55</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">Alíquota: 14,0%</div>
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-6">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>2. Cálculo do IRRF e Dedução por Dependente</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          A base de cálculo do IRRF é obtida após deduzir o valor do INSS recolhido e o valor de <strong>R$ 189,59 por dependente legal</strong> (ou optando pelo desconto simplificado mensal).
        </p>
      </section>
    </div>
  );

  const renderRescisaoContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold rounded-lg text-xs border border-red-200 dark:border-red-800">
          <Scale className="w-3.5 h-3.5" />
          <span>Rescisão Contratual - Art. 477 da CLT</span>
        </div>
        <h2 id="guia-rescisao" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Cálculo de Rescisão Contratual CLT 2026: Verbas, Multa FGTS e Prazos
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Guia completo de direitos rescisórios: Aviso Prévio Proporcional (Lei 12.506/11), 13º salário proporcional, férias com 1/3 constitucional, multa rescisória de 40% do FGTS e o prazo de pagamento legal de 10 dias corridos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-red-500" /> Demissão Sem Justa Causa
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Garante todos os direitos: Saldo de salário, aviso prévio indenizado/trabalhado, 13º proporcional, férias vencidas + proporcionais + 1/3, saque do FGTS com multa de 40% e guias do seguro-desemprego.
          </p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> Acordo Mútuo (Art. 484-A CLT)
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Criado pela Reforma Trabalhista: O trabalhador recebe 50% do aviso prévio indenizado, 20% de multa do FGTS e pode movimentar até 80% da sua conta vinculada do FGTS (sem direito a seguro-desemprego).
          </p>
        </div>
      </div>

      <section className="p-4 bg-neutral-900 text-white rounded-2xl font-mono text-xs sm:text-sm">
        <p className="text-neutral-400 text-[10px] uppercase font-sans font-bold mb-1">Aviso Prévio Proporcional (Lei 12.506/2011):</p>
        <code>Dias de Aviso = 30 dias + (3 dias × Anos Completos Trabalhados) [Máx: 90 dias]</code>
      </section>
    </div>
  );

  const renderHourlyRateContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs border border-blue-200 dark:border-blue-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Divisores Oficiais da CLT</span>
        </div>
        <h2 id="guia-valor-da-hora" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Calcular o Valor da Hora de Trabalho CLT (Divisores 220, 200 e 180)
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Descubra como encontrar o valor da sua hora normal e do seu minuto trabalhado com base na jornada semanal contratual.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1">
          <div className="font-bold text-neutral-900 dark:text-white text-sm">Escala 44h / semana</div>
          <div className="text-blue-600 dark:text-blue-400 font-mono font-bold">Divisor = 220</div>
          <p className="text-[11px] text-neutral-500">Padrão da maioria das indústrias e comércios no Brasil.</p>
        </div>
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1">
          <div className="font-bold text-neutral-900 dark:text-white text-sm">Escala 40h / semana</div>
          <div className="text-blue-600 dark:text-blue-400 font-mono font-bold">Divisor = 200</div>
          <p className="text-[11px] text-neutral-500">Jornada de 8h diárias de segunda a sexta sem trabalho ao sábado.</p>
        </div>
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1">
          <div className="font-bold text-neutral-900 dark:text-white text-sm">Escala 36h / semana</div>
          <div className="text-blue-600 dark:text-blue-400 font-mono font-bold">Divisor = 180</div>
          <p className="text-[11px] text-neutral-500">Típico para atendentes de telemarketing, bancários e operadores.</p>
        </div>
      </div>
    </div>
  );

  const renderEscala12x36Content = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs border border-blue-200 dark:border-blue-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia Completo da Escala 12x36 CLT 2026</span>
        </div>
        <h2 id="como-funciona-escala-12x36" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Funciona a Escala 12x36 na Legislação Trabalhista (Art. 59-A CLT)
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
          A jornada de 12 horas de trabalho seguidas de 36 horas ininterruptas de descanso (escala 12x36) é amplamente utilizada em hospitais, segurança privada, portarias e indústria contínua. Regularizada pela Reforma Trabalhista, ela possui regras específicas quanto ao divisor de horas, adicional noturno e feriados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" /> Plantões e Carga Horária Mensal
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
            Em um mês padrão de 30 dias, o trabalhador cumpre <strong>15 plantões de 12 horas</strong>, totalizando 180 horas físicas de trabalho. Em meses de 31 dias, podem ser cumpridos até 16 plantões (192 horas). O divisor legal padrão para cálculo do salário-hora continua sendo <strong>220</strong> (ou 210/180 conforme CCT).
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-600" /> Adicional Noturno e Prorrogação (Súmula 60 TST)
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
            No plantão noturno (19h às 07h), o trabalhador tem direito ao adicional de 20% com a <strong>hora ficta reduzida de 52m30s</strong> das 22h às 05h. Além disso, as horas trabalhadas das 05h às 07h da manhã (prorrogação) continuam remuneradas com o adicional noturno.
          </p>
        </div>
      </div>
    </div>
  );

  const renderFaltasContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold rounded-lg text-xs border border-rose-200 dark:border-rose-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia de Atrasos, Faltas e Perda de DSR</span>
        </div>
        <h2 id="desconto-faltas-atrasos-dsr" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Calcular Descontos de Atrasos, Faltas Injustificadas e DSR (Lei 605/49)
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
          Entenda os limites legais da tolerância de ponto (Art. 58 § 1º CLT), o cálculo do valor do dia e do minuto de trabalho, e quando a empresa pode descontar o domingo (Descanso Semanal Remunerado).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" /> Tolerância Legal de 10 Minutos
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
            Variações de até 5 minutos na entrada ou saída (máximo de 10 minutos diários) não podem ser descontadas nem computadas como jornada extraordinária (Súmula 366 do TST). Se ultrapassar 10 minutos no total do dia, o desconto é integral.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-600" /> Perda do DSR por Falta na Semana
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
            De acordo com o Art. 6º da Lei 605/1949, a falta sem justificativa legal durante a semana retira a assiduidade integral, autorizando a empresa a descontar 1 dia referente ao repouso semanal remunerado (domingo).
          </p>
        </div>
      </div>
    </div>
  );

  const renderFeriasContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold rounded-lg text-xs border border-teal-200 dark:border-teal-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia Oficial de Férias CLT 2026</span>
        </div>
        <h2 id="calculo-ferias-clt" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Calcular Férias CLT: 1/3 Constitucional, Venda e Prazo de Pagamento
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
          O cálculo de férias pela CLT garante a remuneração normal acrescida de no mínimo um terço constitucional (Art. 7º, XVII da CF/88). Além disso, o trabalhador pode optar pelo abono pecuniário (vender 10 dias) com isenção total de tributos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-teal-600" /> Abono Pecuniário (Venda de 10 Dias)
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
            Pelo Art. 143 da CLT, o empregado pode converter 1/3 do seu período de férias em abono pecuniário. Esse valor indenizatório, juntamente com o seu terço constitucional, é <strong>100% isento de INSS e IRRF</strong>.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" /> Prazo Limite de Pagamento (Art. 145 CLT)
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
            O valor total líquido das férias deve ser depositado pelo empregador até <strong>2 dias antes do início do gozo</strong>. O atraso no pagamento pode gerar o direito à remuneração em dobro (Art. 137 CLT / Súmula 450 STF).
          </p>
        </div>
      </div>
    </div>
  );

  const renderDecimoContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg text-xs border border-emerald-200 dark:border-emerald-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia Oficial CLT • Lei nº 4.090/1962 e Lei nº 4.749/1965</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Calcular o 13º Salário em 2026: Prazos, Parcelas e Deduções
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          A Gratificação Natalina (13º Salário) é garantida pelo Artigo 7º, inciso VIII da Constituição Federal. O pagamento é dividido em duas parcelas obrigatórias, com regras fiscais distintas em cada uma.
        </p>
      </div>

      {/* Grid: 1ª vs 2ª Parcela */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            1ª Parcela (Adiantamento)
          </span>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base">
            De 1º de Fevereiro até 30 de Novembro
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Equivale exatamente a <strong>50% do salário bruto</strong> devido no ano (ou proporcional aos meses trabalhados). Não sofre <strong>nenhum desconto</strong> de INSS ou Imposto de Renda.
          </p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 space-y-3">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            2ª Parcela (Quitação Final)
          </span>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base">
            Até 20 de Dezembro
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Calcula-se o valor integral do 13º salário com base na remuneração de dezembro, deduz-se o valor adiantado na 1ª parcela e aplicam-se os <strong>descontos progressivos de INSS e IRRF</strong>.
          </p>
        </div>
      </div>

      {/* Formula Box */}
      <div className="bg-neutral-900 text-white p-5 rounded-2xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-emerald-400">Fórmula de Fração Proporcional (1/12 avos)</span>
          <button
            onClick={() => copyToClipboard('13º Proporcional = (Salário Bruto / 12) × Meses com mais de 15 dias trabalhados', 'decimo-formula')}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
          >
            {copiedFormula === 'decimo-formula' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFormula === 'decimo-formula' ? 'Copiado!' : 'Copiar Fórmula'}</span>
          </button>
        </div>
        <code className="block font-mono text-sm bg-neutral-950 p-3 rounded-xl text-emerald-300">
          13º Devido = (Salário Bruto / 12) × Meses Trabalhados (≥15 dias)
        </code>
      </div>
    </div>
  );

  const renderSeguroContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs border border-blue-200 dark:border-blue-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia MTE • Lei nº 7.998/1990 e Resolução CODEFAT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Como Funciona o Cálculo do Seguro-Desemprego em 2026
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          O seguro-desemprego é um benefício de assistência financeira temporária concedido ao trabalhador dispensado <strong>sem justa causa</strong> ou por rescisão indireta. O valor mensal é calculado com base na média dos últimos 3 salários.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 space-y-2">
          <span className="text-xs font-bold text-blue-600 block">1ª Solicitação</span>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            • 12 a 23 meses de carteira: <strong>4 parcelas</strong><br/>
            • 24 meses ou mais: <strong>5 parcelas</strong>
          </p>
        </div>
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 space-y-2">
          <span className="text-xs font-bold text-blue-600 block">2ª Solicitação</span>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            • 9 a 11 meses de carteira: <strong>3 parcelas</strong><br/>
            • 12 a 23 meses: <strong>4 parcelas</strong><br/>
            • 24 meses ou mais: <strong>5 parcelas</strong>
          </p>
        </div>
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 space-y-2">
          <span className="text-xs font-bold text-blue-600 block">3ª Solicitação em Diante</span>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            • 6 a 11 meses de carteira: <strong>3 parcelas</strong><br/>
            • 12 a 23 meses: <strong>4 parcelas</strong><br/>
            • 24 meses ou mais: <strong>5 parcelas</strong>
          </p>
        </div>
      </div>
    </div>
  );

  const renderInsalubridadeContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold rounded-lg text-xs border border-amber-200 dark:border-amber-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Normas Regulamentadoras NR-15 e NR-16 • CLT Art. 192 e 193</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Adicional de Insalubridade e Periculosidade: Regras e Diferenças
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Entenda as diferenças jurídicas fundamentais entre insalubridade (exposição contínua a agentes nocivos) e periculosidade (risco fatal imediato).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-amber-50/50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
          <h3 className="font-bold text-amber-900 dark:text-amber-200 text-base">
            Insalubridade (NR-15)
          </h3>
          <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1.5">
            <li>• <strong>Grau Mínimo (10%):</strong> R$ 162,10/mês</li>
            <li>• <strong>Grau Médio (20%):</strong> R$ 324,20/mês</li>
            <li>• <strong>Grau Máximo (40%):</strong> R$ 648,40/mês</li>
            <li>• <em>Base de cálculo:</em> Salário Mínimo Nacional (R$ 1.621,00).</li>
          </ul>
        </div>

        <div className="p-5 bg-orange-50/50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-800/60 space-y-3">
          <h3 className="font-bold text-orange-900 dark:text-orange-200 text-base">
            Periculosidade (NR-16)
          </h3>
          <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1.5">
            <li>• <strong>Alíquota Fixa de 30%</strong> sobre o Salário Base.</li>
            <li>• Atividades com eletricidade, explosivos, inflamáveis, segurança armada e motoboys.</li>
            <li>• <em>Não se calcula</em> sobre gratificações ou adicionais.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderCltPjContent = () => (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold rounded-lg text-xs border border-purple-200 dark:border-purple-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Planejamento de Carreira e Tributário • Simples Nacional & CLT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Comparativo Salarial CLT x PJ: Quanto Cobrar como Prestador de Serviços?
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Ao migrar de CLT para PJ, você abre mão de direitos garantidos em lei (férias remuneradas + 1/3, 13º salário, 8% de FGTS mensal e aviso prévio indenizado). Para manter o mesmo padrão financeiro, a remuneração PJ deve ser significativamente maior.
        </p>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 space-y-3">
        <h3 className="font-bold text-neutral-900 dark:text-white text-base">
          A Regra de Ouro do Mercado (Multiplicador 1.55x a 1.80x)
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Especialistas em remuneração recomendam que o valor bruto da nota fiscal PJ seja de <strong>55% a 80% superior</strong> ao salário bruto CLT anterior, além de somar os benefícios diretos (vale refeição e plano de saúde corporativo).
        </p>
      </div>
    </div>
  );

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'escala12x36':
        return renderEscala12x36Content();
      case 'faltas':
        return renderFaltasContent();
      case 'ferias':
        return renderFeriasContent();
      case 'decimo':
        return renderDecimoContent();
      case 'seguro':
        return renderSeguroContent();
      case 'insalubridade':
        return renderInsalubridadeContent();
      case 'cltpj':
        return renderCltPjContent();
      case 'overtime':
        return renderOvertimeContent();
      case 'night':
        return renderNightContent();
      case 'banco':
        return renderBancoContent();
      case 'holerite':
        return renderHoleriteContent();
      case 'rescisao':
        return renderRescisaoContent();
      case 'rate':
        return renderHourlyRateContent();
      default:
        return renderDailyContent();
    }
  };

  return (
    <article className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-8 animate-in fade-in duration-300 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <EATBadge />
        <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-blue-600" /> Atualizado em 2026 • Em conformidade com a Legislação Trabalhista Brasileira
        </span>
      </div>

      {/* Dynamic Tab-Specific In-Depth Content */}
      {getActiveTabContent()}

      {/* Interactive User Rating Widget */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <RatingWidget toolName={activeTab} />
      </div>

      {/* Bottom Cross-linking Grid */}
      <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
        <h4 className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Outras Calculadoras Trabalhistas CLT Disponíveis Gratuitamente</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <a
            href="/"
            onClick={(e) => handleTabClick(e, 'daily')}
            className="p-2.5 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 font-medium transition-all text-center block"
          >
            Horas Diárias
          </a>
          <a
            href={getHrefForTab('timesheet')}
            onClick={(e) => handleTabClick(e, 'timesheet')}
            className="p-2.5 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 font-medium transition-all text-center block"
          >
            Semanal 44h
          </a>
          <a
            href={getHrefForTab('overtime')}
            onClick={(e) => handleTabClick(e, 'overtime')}
            className="p-2.5 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 font-medium transition-all text-center block"
          >
            Horas Extras
          </a>
          <a
            href={getHrefForTab('holerite')}
            onClick={(e) => handleTabClick(e, 'holerite')}
            className="p-2.5 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 font-medium transition-all text-center block"
          >
            Simular Holerite
          </a>
        </div>
      </div>
    </article>
  );
}

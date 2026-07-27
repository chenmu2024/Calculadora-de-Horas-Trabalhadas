import { MouseEvent, useState } from 'react';
import EATBadge from './EATBadge';
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
  AlertCircle
} from 'lucide-react';

interface SEOContentProps {
  onSelectTab?: (tab: string) => void;
}

export default function SEOContent({ onSelectTab }: SEOContentProps) {
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <article className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200 space-y-8 animate-in fade-in duration-300">
      <EATBadge className="mb-2" />

      {/* Header */}
      <div className="space-y-3 border-b border-neutral-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs border border-blue-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia Oficial CLT 2026</span>
        </div>
        <h2 id="como-calcular-hora-de-trabalho" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Como calcular hora de trabalho? (Guia Completo CLT 2026)
        </h2>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
          Aprenda o passo a passo exato para calcular horas trabalhadas, horas extras, adicional noturno, tolerância do ponto e reflexos de DSR. Guia completo atualizado em conformidade com o Art. 58 da CLT, Reforma Trabalhista e Súmulas do TST.
        </p>
      </div>

      {/* Interactive Table of Contents / Índice de Conteúdo */}
      <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 text-xs space-y-3">
        <p className="font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Índice Rápido de Navegação do Guia</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-blue-700 font-semibold">
          <a href="#passo-a-passo" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">1.</span> Passo a Passo Prático de Cálculo
          </a>
          <a href="#regras-clt" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">2.</span> Regras CLT e Tolerância de Ponto
          </a>
          <a href="#tabela-divisores-clt" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">3.</span> Divisores de Horas (220h, 200h, 180h)
          </a>
          <a href="#formulas-praticas" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">4.</span> Fórmulas de Bolso (Copiar)
          </a>
          <a href="#como-calcular-44-horas" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">5.</span> Jornada 44h Semanal (8h48m)
          </a>
          <a href="#banco-de-horas" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">6.</span> Banco de Horas e Caducidade
          </a>
          <a href="#embasamento-legal" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">7.</span> Artigos CLT e Súmulas do TST
          </a>
          <a href="#ferramentas-auxiliares" className="p-2 bg-white rounded-lg border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-1.5">
            <span className="text-blue-500 font-extrabold">8.</span> Calculadoras Interativas Prontas
          </a>
        </div>
      </div>

      {/* SECTION 1: Step-by-Step Visual Infographic Guide */}
      <section id="passo-a-passo" className="space-y-4 pt-2">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span>Como Calcular Horas Trabalhadas: Passo a Passo Prático</span>
        </h3>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Para apurar com precisão a jornada diária e verificar se existem horas suplementares ou faltas, siga a sequência padrão utilizada pela fiscalização trabalhista e polos de RH:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">Passo 1</span>
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Registrar os 4 Batimentos de Ponto</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Anote os horários no formato HH:MM: <strong>Entrada 1 (Manhã)</strong>, <strong>Saída 1 (Início Almoço)</strong>, <strong>Entrada 2 (Retorno Almoço)</strong> e <strong>Saída 2 (Término)</strong>.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">Passo 2</span>
              <TrendingUp className="w-4 h-4 text-neutral-400" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Calcular Períodos e Subtrair o Almoço</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Soma do turno da manhã + turno da tarde. <br />
              <code className="bg-neutral-200 px-1.5 py-0.5 rounded font-mono text-[11px] text-neutral-800">
                Horas Efetivas = (Saída 1 - Entrada 1) + (Saída 2 - Entrada 2)
              </code>
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">Passo 3</span>
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Aplicar a Tolerância Legal (Art. 58 CLT)</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Verifique se a variação diária fica dentro do limite de <strong>10 minutos no total do dia</strong> (até 5 min por batida). Variações até 10min são desconsideradas.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">Passo 4</span>
              <Sparkles className="w-4 h-4 text-neutral-400" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Apurar Horas Extras ou Saldo Negativo</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Compare as horas trabalhadas com a jornada contratual (ex: 8h). O excedente é hora extra (com adicional de 50% ou 100%) ou crédito no banco de horas.
            </p>
          </div>
        </div>

        {/* Real Example Callout Box */}
        <div className="bg-blue-50/70 p-4 sm:p-5 rounded-2xl border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Exemplo Prático de Apuração CLT
            </span>
            <button
              onClick={(e) => handleTabClick(e, 'daily')}
              className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Simular na Calculadora <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
            <div>
              <span className="text-neutral-500 block font-medium">Batidas de Ponto:</span>
              <strong className="text-neutral-800 font-mono">08:03 - 12:00 | 13:00 - 18:05</strong>
            </div>
            <div>
              <span className="text-neutral-500 block font-medium">Cálculo Efetivo:</span>
              <strong className="text-neutral-800 font-mono">3h57m + 5h05m = 9h02m</strong>
            </div>
            <div>
              <span className="text-neutral-500 block font-medium">Resultado com Tolerância:</span>
              <strong className="text-emerald-700 font-bold font-mono">+2 min (Dentro da tolerância de 10 min, paga 8h exatas)</strong>
            </div>
          </div>
        </div>

        {/* Pro Tip: Minutes to Decimal Conversion & Excel Formula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Minutes to Decimal Conversion */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" /> Tabela de Conversão: Minutos → Horas Decimais
              </span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Para multiplicar horas pelo valor salarial na folha de pagamento, converta minutos dividindo por 60 (ex: 30min ÷ 60 = 0,5h):
            </p>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-mono pt-1">
              <div className="bg-white p-1.5 rounded border border-neutral-200">15m = <strong>0,25h</strong></div>
              <div className="bg-white p-1.5 rounded border border-neutral-200">30m = <strong>0,50h</strong></div>
              <div className="bg-white p-1.5 rounded border border-neutral-200">45m = <strong>0,75h</strong></div>
              <div className="bg-white p-1.5 rounded border border-neutral-200">48m = <strong>0,80h</strong></div>
            </div>
          </div>

          {/* Excel Formula Box */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Fórmula para Calcular Horas no Excel
              </span>
              <button
                onClick={() => copyToClipboard('=SE(D2<A2; (D2+1)-A2-(C2-B2); D2-A2-(C2-B2)) * 24', 'excel_formula')}
                className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedFormula === 'excel_formula' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFormula === 'excel_formula' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-600">
              Copie e cole na célula do Excel (sendo A2=Entrada1, B2=Saída1, C2=Entrada2, D2=Saída2):
            </p>
            <code className="block bg-white p-2 rounded border border-neutral-200 font-mono text-[10px] text-neutral-800 overflow-x-auto whitespace-nowrap">
              =SE(D2&lt;A2; (D2+1)-A2-(C2-B2); D2-A2-(C2-B2)) * 24
            </code>
          </div>
        </div>
      </section>

      {/* SECTION 2: Rules & Tolerances */}
      <section id="regras-clt" className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <span>Principais Regras da CLT sobre Jornada de Trabalho em 2026</span>
          </h3>
          <span className="text-xs bg-blue-50 text-blue-800 font-bold px-2.5 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            Em conformidade com a Reforma Trabalhista & Portaria 671 MTP
          </span>
        </div>

        <p className="text-neutral-600 text-sm leading-relaxed">
          A Constituição Federal (Art. 7º, XIII) e a Consolidação das Leis do Trabalho (CLT) fixam o limite máximo de <strong>8 horas diárias e 44 horas semanais</strong> para contratos regulares. Conheça as regras essenciais que regem a marcação e apuração de ponto:
        </p>

        {/* Structured Grid of Key CLT Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Card 1: Tolerância */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">Art. 58, § 1º CLT</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Súmula 366 TST</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Tolerância do Ponto (10 min)</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Variações de até 5 minutos por registro (máximo 10 min no total do dia) não são descontadas nem pagas como hora extra. Se ultrapassar 10 min diários, <strong>todo o tempo é apurado</strong>.
              </p>
            </div>
            <button
              onClick={(e) => handleTabClick(e, 'daily')}
              className="mt-2 text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              Simular na Calculadora Diária <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 2: Intervalo Intrajornada */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">Art. 71 CLT</span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Almoço / Repouso</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Intervalo Intrajornada</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Jornadas superiores a 6h exigem no mínimo 1h de intervalo (máx 2h). Para jornadas de 4h a 6h, o intervalo é de 15 min. Intervalo não concedido gera indenização de 50%.
              </p>
            </div>
            <button
              onClick={(e) => handleTabClick(e, 'daily')}
              className="mt-2 text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              Verificar Pausa de Almoço <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 3: Intervalo Interjornada (11h) */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">Art. 66 CLT</span>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">11h Mínimas</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Intervalo Interjornada (11h)</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Entre duas jornadas de trabalho diárias, deve haver um período mínimo de 11 horas consecutivas de descanso. O desrespeito gera pagamento suplementar com adicional.
              </p>
            </div>
            <button
              onClick={(e) => handleTabClick(e, 'timesheet')}
              className="mt-2 text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              Conferir no Cartão Semanal <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 4: Limite Horas Extras */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">Art. 59 CLT</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">+50% e +100%</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Horas Extras e Adicionais</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                A jornada pode ser estendida em até 2 horas diárias suplementares. Adicional mínimo de 50% em dias úteis e 100% em domingos/feriados sem folga compensatória.
              </p>
            </div>
            <button
              onClick={(e) => handleTabClick(e, 'overtime')}
              className="mt-2 text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              Calcular Horas Extras + DSR <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 5: Trabalho Noturno */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">Art. 73 CLT</span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">22h às 05h</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Adicional Noturno e Hora Ficta</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Trabalho urbano das 22h às 5h possui hora reduzida de 52min30s (fator 1,142857) e adicional noturno mínimo de 20% com reflexos em DSR e férias.
              </p>
            </div>
            <button
              onClick={(e) => handleTabClick(e, 'night')}
              className="mt-2 text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              Calcular Noturno e Hora Ficta <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 6: Portaria 671 MTP / Controle de Ponto */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">Portaria 671 MTP</span>
                <span className="text-[10px] font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md">REP-C, A e P</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Sistemas de Ponto Eletrônico</h4>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Empresas com mais de 20 funcionários são obrigadas a registrar o ponto (Art. 74, § 2º). A Portaria 671 proíbe restrições automáticas à marcação e adulterações.
              </p>
            </div>
            <button
              onClick={(e) => handleTabClick(e, 'excel')}
              className="mt-2 text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              Baixar Modelo de Espelho de Ponto <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Tabela de Divisores */}
      <section id="tabela-divisores-clt" className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Tabela de Divisores Oficiais de Horas CLT e Fórmula de Cálculo</span>
          </h3>
          <button
            onClick={(e) => handleTabClick(e, 'rate')}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Calculadora Completa de Valor Hora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-neutral-600 text-sm leading-relaxed">
          O divisor mensal é o número oficial estabelecido pela legislação trabalhista para converter o salário mensal fixo no valor exato de 1 hora de trabalho. Ele leva em consideração as <strong>5 semanas médias do mês comercial (30 dias ÷ 6 dias úteis/semana)</strong>.
        </p>

        {/* Formula Explanation Callout */}
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
          <span className="font-bold text-neutral-900 block flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" /> Como o Divisor CLT é calculado matematicamente?
          </span>
          <p className="text-neutral-600 leading-relaxed">
            Pela regra do TST: <code className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-mono text-blue-800 font-bold">(Carga Semanal ÷ 6 dias úteis) × 30 dias do mês = Divisor Mensal</code>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-white p-2 rounded border border-neutral-200 text-neutral-800">
              • 44h semanais: (44 ÷ 6) × 30 = <strong>220 horas</strong>
            </div>
            <div className="bg-white p-2 rounded border border-neutral-200 text-neutral-800">
              • 40h semanais: (40 ÷ 6) × 30 = <strong>200 horas</strong>
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
            <thead>
              <tr className="bg-neutral-100 text-neutral-800">
                <th className="p-3 border border-neutral-200 font-bold">Carga Horária Semanal</th>
                <th className="p-3 border border-neutral-200 font-bold">Divisor CLT</th>
                <th className="p-3 border border-neutral-200 font-bold">Jornada Diária de Referência</th>
                <th className="p-3 border border-neutral-200 font-bold">Aplicação Típica</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600">
              <tr className="hover:bg-blue-50/30 transition-colors">
                <td className="p-3 border border-neutral-200 font-semibold text-neutral-900">44 Horas / semana</td>
                <td className="p-3 border border-neutral-200 font-mono font-extrabold text-blue-700 text-sm">220</td>
                <td className="p-3 border border-neutral-200">8h/dia (Seg-Sex + 4h Sab) ou 8h48m (Seg-Sex)</td>
                <td className="p-3 border border-neutral-200 font-medium text-neutral-700">Comércio, Indústria, Serviços CLT</td>
              </tr>
              <tr className="bg-neutral-50/70 hover:bg-blue-50/30 transition-colors">
                <td className="p-3 border border-neutral-200 font-semibold text-neutral-900">40 Horas / semana</td>
                <td className="p-3 border border-neutral-200 font-mono font-extrabold text-blue-700 text-sm">200</td>
                <td className="p-3 border border-neutral-200">8h/dia de Segunda a Sexta-feira</td>
                <td className="p-3 border border-neutral-200 font-medium text-neutral-700">Escritórios, T.I., Servidores Públicos</td>
              </tr>
              <tr className="hover:bg-blue-50/30 transition-colors">
                <td className="p-3 border border-neutral-200 font-semibold text-neutral-900">36 Horas / semana</td>
                <td className="p-3 border border-neutral-200 font-mono font-extrabold text-blue-700 text-sm">180</td>
                <td className="p-3 border border-neutral-200">6h/dia ou Escala 12x36 (180/210/220 conforme CCT)</td>
                <td className="p-3 border border-neutral-200 font-medium text-neutral-700">Teleatendimento, Saúde, Portaria</td>
              </tr>
              <tr className="bg-neutral-50/70 hover:bg-blue-50/30 transition-colors">
                <td className="p-3 border border-neutral-200 font-semibold text-neutral-900">30 Horas / semana</td>
                <td className="p-3 border border-neutral-200 font-mono font-extrabold text-blue-700 text-sm">150</td>
                <td className="p-3 border border-neutral-200">6h/dia de Segunda a Sexta-feira</td>
                <td className="p-3 border border-neutral-200 font-medium text-neutral-700">Estágio Superior, Professores, Bancários</td>
              </tr>
              <tr className="hover:bg-blue-50/30 transition-colors">
                <td className="p-3 border border-neutral-200 font-semibold text-neutral-900">26 Horas / semana</td>
                <td className="p-3 border border-neutral-200 font-mono font-extrabold text-blue-700 text-sm">130</td>
                <td className="p-3 border border-neutral-200">Jornada Parcial (Art. 58-A CLT)</td>
                <td className="p-3 border border-neutral-200 font-medium text-neutral-700">Contrato de Trabalho Parcial</td>
              </tr>
              <tr className="bg-neutral-50/70 hover:bg-blue-50/30 transition-colors">
                <td className="p-3 border border-neutral-200 font-semibold text-neutral-900">24 Horas / semana</td>
                <td className="p-3 border border-neutral-200 font-mono font-extrabold text-blue-700 text-sm">120</td>
                <td className="p-3 border border-neutral-200">2 plantões de 12h ou 4 dias de 6h</td>
                <td className="p-3 border border-neutral-200 font-medium text-neutral-700">Plantões Médicos, Enfermagem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: Interactive Formula Cheat Sheet */}
      <section id="formulas-praticas" className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Copy className="w-5 h-5 text-blue-600" />
            <span>Fórmulas Práticas de Bolso (Copie para Usar)</span>
          </h3>
          <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Clique para copiar a fórmula</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-neutral-900 font-bold">1. Valor da Hora CLT</strong>
              <button
                onClick={() => copyToClipboard('Valor da Hora = Salário Bruto / Divisor (220, 200, 180)', 'f1')}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedFormula === 'f1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormula === 'f1' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <code className="block bg-white p-2 rounded-lg border border-neutral-200 font-mono text-neutral-800 text-[11px]">
              Valor_Hora = Salario_Bruto / Divisor
            </code>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-neutral-900 font-bold">2. Hora Extra 50% e 100%</strong>
              <button
                onClick={() => copyToClipboard('Hora Extra 50% = Valor da Hora x 1.5 | 100% = Valor da Hora x 2.0', 'f2')}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedFormula === 'f2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormula === 'f2' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <code className="block bg-white p-2 rounded-lg border border-neutral-200 font-mono text-neutral-800 text-[11px]">
              HE_50 = Valor_Hora * 1.50 | HE_100 = Valor_Hora * 2.00
            </code>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-neutral-900 font-bold">3. Hora Ficta Noturna</strong>
              <button
                onClick={() => copyToClipboard('Horas Noturnas Pagas = Horas do Relogio x (60 / 52.5) x 1.20', 'f3')}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedFormula === 'f3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormula === 'f3' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <code className="block bg-white p-2 rounded-lg border border-neutral-200 font-mono text-neutral-800 text-[11px]">
              Horas_Pagas = Horas_Relogio * 1.142857 * 1.20
            </code>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-neutral-900 font-bold">4. Reflexo no DSR (Súmula 172 TST)</strong>
              <button
                onClick={() => copyToClipboard('Valor DSR = (Total R$ HE / Dias Uteis Trabalhados) x (Domingos + Feriados)', 'f4')}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedFormula === 'f4' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormula === 'f4' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <code className="block bg-white p-2 rounded-lg border border-neutral-200 font-mono text-neutral-800 text-[11px]">
              Reflexo_DSR = (Total_HE / Dias_Uteis) * Feriados_Domingos
            </code>
          </div>
        </div>
      </section>

      {/* SECTION 5: 44h Semanal */}
      <section id="como-calcular-44-horas" className="space-y-3 pt-2 border-t border-neutral-100">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Como calcular 44 horas de trabalho de segunda a sexta-feira?</span>
        </h3>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Muitas empresas adotam o sistema de compensação de sábado, no qual as 44 horas semanais são cumpridas integralmente entre segunda e sexta-feira. Dividindo 44 horas por 5 dias, obtém-se <strong>8 horas e 48 minutos (8h48min)</strong> por dia de trabalho. Preencha facilmente esse cartão na nossa <a href="/?tab=timesheet" onClick={(e) => handleTabClick(e, 'timesheet')} className="text-blue-700 font-bold hover:underline">Calculadora de Ponto Semanal 44h</a>.
        </p>
      </section>

      {/* SECTION 6: Banco de Horas */}
      <section id="banco-de-horas" className="space-y-3 pt-2 border-t border-neutral-100">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Como gerenciar o Banco de Horas segundo a Reforma Trabalhista?</span>
        </h3>
        <p className="text-neutral-600 text-sm leading-relaxed">
          O banco de horas permite compensar horas extras com folgas correspondentes. No entanto, o saldo positivo ou negativo possui prazos de caducidade legais:
        </p>
        <ul className="list-disc pl-5 text-neutral-600 text-sm space-y-2">
          <li><strong>Acordo Individual Direto:</strong> Deve ser quitado/compensado em até <strong>6 meses</strong>.</li>
          <li><strong>Acordo Coletivo de Trabalho (CCT):</strong> O prazo estende-se por até <strong>1 ano</strong>.</li>
          <li><strong>Rescisão do Contrato:</strong> O saldo credor pendente deve ser totalmente pago como hora extra no holerite de rescisão. Acompanhe suas horas na <a href="/?tab=banco" onClick={(e) => handleTabClick(e, 'banco')} className="text-blue-700 font-bold hover:underline">Calculadora de Saldo do Banco de Horas</a>.</li>
        </ul>
      </section>

      {/* SECTION 7: Embasamento Legal e Jurisprudência TST */}
      <section id="embasamento-legal" className="space-y-3 pt-2 border-t border-neutral-100">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>Embasamento Legal e Jurisprudência TST (2026)</span>
        </h3>
        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 text-xs space-y-2">
          <p className="text-blue-950 font-bold mb-1">Todas as fórmulas utilizadas nas calculadoras seguem rigorosamente a legislação vigente:</p>
          <ul className="list-disc pl-4 text-neutral-700 space-y-1.5">
            <li><strong>Artigo 58 da CLT:</strong> Define a jornada normal de até 8 horas diárias e 44 semanais, além do limite de tolerância no registro de ponto.</li>
            <li><strong>Artigo 59 da CLT:</strong> Regulamenta o limite de até 2 horas extras diárias e a compensação via banco de horas.</li>
            <li><strong>Artigo 73 da CLT:</strong> Estabelece o adicional noturno urbano de 20% e a hora reduzida de 52m30s entre 22h e 05h.</li>
            <li><strong>Artigo 477 da CLT:</strong> Fixa o prazo de 10 dias corridos para quitação das verbas rescisórias após a cessação do contrato.</li>
            <li><strong>Artigo 484-A da CLT:</strong> Regulamenta a rescisão por acordo mútuo entre empregado e empregador.</li>
            <li><strong>Súmula 60 do TST:</strong> Garante o adicional noturno sobre a prorrogação da jornada noturna no período diurno.</li>
            <li><strong>Súmula 172 do TST:</strong> Obriga a integração das horas extras habituais no cálculo do Descanso Semanal Remunerado (DSR).</li>
            <li><strong>Súmula 366 do TST:</strong> Reafirma a tolerância máxima de 10 minutos diários no cartão de ponto.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 8: Ferramentas Interativas Prontas */}
      <section id="ferramentas-auxiliares" className="space-y-3 pt-2 border-t border-neutral-100">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span>Ferramentas Gratuitas de Cálculo no Site</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="/?tab=monthly"
            onClick={(e) => handleTabClick(e, 'monthly')}
            className="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 font-bold text-neutral-800 flex items-center justify-between group transition-colors"
          >
            <span>Calculadora de Ponto Mensal Integrado</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">Acessar →</span>
          </a>
          <a
            href="/?tab=overtime"
            onClick={(e) => handleTabClick(e, 'overtime')}
            className="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 font-bold text-neutral-800 flex items-center justify-between group transition-colors"
          >
            <span>Calculadora de Horas Extras 50% e 100% + DSR</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">Acessar →</span>
          </a>
          <a
            href="/?tab=holerite"
            onClick={(e) => handleTabClick(e, 'holerite')}
            className="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 font-bold text-neutral-800 flex items-center justify-between group transition-colors"
          >
            <span>Simulador de Holerite e Salário Líquido 2026</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">Acessar →</span>
          </a>
          <a
            href="/?tab=rescisao"
            onClick={(e) => handleTabClick(e, 'rescisao')}
            className="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 font-bold text-neutral-800 flex items-center justify-between group transition-colors"
          >
            <span>Calculadora de Rescisão CLT e Aviso Prévio</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">Acessar →</span>
          </a>
          <a
            href="/?tab=excel"
            onClick={(e) => handleTabClick(e, 'excel')}
            className="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 font-bold text-neutral-800 flex items-center justify-between group transition-colors"
          >
            <span>Baixar Planilha de Ponto Pronta em Excel</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">Baixar →</span>
          </a>
        </div>
      </section>
    </article>
  );
}



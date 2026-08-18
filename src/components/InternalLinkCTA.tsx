import React from 'react';
import { 
  Clock, 
  FileSpreadsheet, 
  DollarSign, 
  Moon, 
  ArrowRight, 
  Calculator, 
  Scale, 
  Calendar, 
  PlusCircle, 
  Briefcase,
  Palmtree,
  AlertTriangle,
  ShieldCheck,
  Gift,
  ShieldAlert,
  Biohazard,
  ArrowRightLeft
} from 'lucide-react';
import { getHrefForTab } from '../utils/routes';

interface InternalLinkCTAProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

interface ToolLink {
  tab: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}

const TAB_RECOMMENDATIONS: Record<string, string[]> = {
  daily: ['timesheet', 'overtime', 'escala12x36', 'rate'],
  timesheet: ['monthly', 'banco', 'faltas', 'overtime'],
  monthly: ['holerite', 'overtime', 'ferias', 'decimo'],
  escala12x36: ['night', 'holerite', 'overtime', 'insalubridade'],
  faltas: ['daily', 'holerite', 'timesheet', 'rate'],
  ferias: ['decimo', 'holerite', 'rescisao', 'monthly'],
  decimo: ['ferias', 'holerite', 'rescisao', 'seguro'],
  seguro: ['rescisao', 'holerite', 'decimo', 'ferias'],
  insalubridade: ['holerite', 'escala12x36', 'night', 'rate'],
  cltpj: ['holerite', 'rescisao', 'decimo', 'rate'],
  overtime: ['holerite', 'night', 'escala12x36', 'insalubridade'],
  night: ['escala12x36', 'insalubridade', 'overtime', 'holerite'],
  rate: ['cltpj', 'overtime', 'holerite', 'rescisao'],
  holerite: ['cltpj', 'decimo', 'ferias', 'rescisao'],
  rescisao: ['seguro', 'decimo', 'ferias', 'holerite'],
  banco: ['overtime', 'timesheet', 'faltas', 'monthly'],
  sum: ['daily', 'timesheet', 'excel', 'banco'],
  excel: ['daily', 'timesheet', 'monthly', 'escala12x36'],
};

const ALL_TOOLS: Record<string, ToolLink> = {
  daily: {
    tab: 'daily',
    title: 'Calculadora de Horas Diárias',
    desc: 'Calcule as 4 batidas de ponto do dia com almoço e horas extras.',
    icon: Clock,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 hover:border-blue-400'
  },
  timesheet: {
    tab: 'timesheet',
    title: 'Cartão de Ponto Semanal 44h',
    desc: 'Apuração semanal completa de 2ª a 6ª (8h48m) ou com sábado compensado.',
    icon: Calendar,
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400'
  },
  monthly: {
    tab: 'monthly',
    title: 'Calculadora Mensal de Horas',
    desc: 'Simule as horas do mês inteiro com divisor 220 e total a receber.',
    icon: Briefcase,
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/80 hover:border-cyan-400'
  },
  escala12x36: {
    tab: 'escala12x36',
    title: 'Calculadora de Escala 12x36',
    desc: 'Plantões de 12 horas, adicional noturno urbano e feriados em dobro.',
    icon: ShieldCheck,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 hover:border-blue-400'
  },
  faltas: {
    tab: 'faltas',
    title: 'Atrasos e Faltas (Perda DSR)',
    desc: 'Calcule descontos no salário por minutos de atraso e perda de DSR.',
    icon: AlertTriangle,
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 hover:border-rose-400'
  },
  ferias: {
    tab: 'ferias',
    title: 'Calculadora de Férias CLT',
    desc: 'Cálculo com 1/3 constitucional, venda de 10 dias e deduções INSS/IRRF.',
    icon: Palmtree,
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/80 hover:border-teal-400'
  },
  decimo: {
    tab: 'decimo',
    title: 'Calculadora de 13º Salário',
    desc: 'Simulação exata da 1ª e 2ª parcelas com deduções de INSS e IRRF.',
    icon: Gift,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400'
  },
  seguro: {
    tab: 'seguro',
    title: 'Seguro-Desemprego 2026',
    desc: 'Calcule quantidade de parcelas (3 a 5) e valor mensal conforme regras MTE.',
    icon: ShieldAlert,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 hover:border-blue-400'
  },
  insalubridade: {
    tab: 'insalubridade',
    title: 'Insalubridade & Periculosidade',
    desc: 'Adicional de 10%, 20%, 40% ou 30% periculosidade com reflexos.',
    icon: Biohazard,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 hover:border-amber-400'
  },
  cltpj: {
    tab: 'cltpj',
    title: 'Comparador CLT x PJ',
    desc: 'Descubra se vale a pena virar PJ e quanto cobrar para igualar benefícios CLT.',
    icon: ArrowRightLeft,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/80 hover:border-purple-400'
  },
  overtime: {
    tab: 'overtime',
    title: 'Horas Extras 50% e 100%',
    desc: 'Calcule o valor exato a receber com reflexo no DSR (Súmula 172 TST).',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 hover:border-amber-400'
  },
  holerite: {
    tab: 'holerite',
    title: 'Simulador de Salário Líquido',
    desc: 'Simule o contracheque oficial com INSS progressivo 2026, IRRF e VT.',
    icon: DollarSign,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400'
  },
  night: {
    tab: 'night',
    title: 'Adicional Noturno e Hora Ficta',
    desc: 'Calcule a redução de 52m30s e o acréscimo de 20% das 22h às 5h.',
    icon: Moon,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/80 hover:border-purple-400'
  },
  rate: {
    tab: 'rate',
    title: 'Calculadora de Valor da Hora',
    desc: 'Descubra o valor do seu salário por hora e por minuto no padrão CLT.',
    icon: Calculator,
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/80 hover:border-teal-400'
  },
  rescisao: {
    tab: 'rescisao',
    title: 'Calculadora de Rescisão CLT',
    desc: 'Simulação exata de aviso prévio, 13º, férias + 1/3 e multa do FGTS.',
    icon: Scale,
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 hover:border-rose-400'
  },
  banco: {
    tab: 'banco',
    title: 'Banco de Horas e Compensação',
    desc: 'Controle o saldo positivo ou negativo de horas a compensar ou pagar.',
    icon: PlusCircle,
    color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/80 hover:border-sky-400'
  },
  excel: {
    tab: 'excel',
    title: 'Planilha Pronta em Excel Grátis',
    desc: 'Baixe modelos prontos em Excel para controle de ponto e banco de horas.',
    icon: FileSpreadsheet,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 hover:border-blue-400'
  }
};

export default function InternalLinkCTA({ currentTab, onSelectTab }: InternalLinkCTAProps) {
  const recommendedTabs = TAB_RECOMMENDATIONS[currentTab] || ['daily', 'overtime', 'holerite', 'decimo'];
  const links = recommendedTabs
    .map(tab => ALL_TOOLS[tab])
    .filter(Boolean)
    .filter(link => link.tab !== currentTab)
    .slice(0, 3);

  return (
    <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4 no-print transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 
          <span>Ferramentas de Cálculo Relacionadas</span>
        </h3>
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">100% Grátis no padrão CLT</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              href={getHrefForTab(link.tab)}
              key={link.tab}
              onClick={(e) => { e.preventDefault(); onSelectTab(link.tab); }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-1.5 cursor-pointer group hover:shadow-md ${link.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {link.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-snug">
                {link.desc}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

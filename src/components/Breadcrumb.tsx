import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

const TAB_NAMES: Record<string, string> = {
  daily: 'Calculadora de Horas',
  counter: "Contador de Horas",
  decimal: "Horas Decimais: Converter Horas em Decimal",
  business: "Calculadora de Dias Úteis",
  service: "Calculadora de Tempo de Serviço",
  minutes: "Calculadora de Horas e Minutos",
  timesheet: 'Cartão de Ponto Semanal',
  monthly: 'Cálculo Mensal',
  banco: 'Banco de Horas',
  sum: 'Somador de Horas',
  holerite: 'Simulador de Holerite',
  rescisao: 'Calculadora de Rescisão CLT',
  rate: 'Valor da Hora',
  overtime: 'Horas Extras',
  night: 'Adicional Noturno',
  escala12x36: 'Escala 12x36',
  faltas: 'Atrasos e Faltas (DSR)',
  ferias: 'Calculadora de Férias',
  decimo: '13º Salário',
  seguro: 'Seguro-Desemprego',
  insalubridade: 'Insalubridade e Periculosidade',
  cltpj: 'Comparador CLT x PJ',
  excel: 'Planilhas em Excel',
  blog: 'Guia da CLT',
  about: 'Sobre Nós',
  contact: 'Contato',
  terms: 'Termos de Uso',
  privacy: 'Política de Privacidade',
};

export default function Breadcrumb({ activeTab, onSelectTab }: BreadcrumbProps) {
  const currentLabel = TAB_NAMES[activeTab] || 'Calculadora';

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap no-print">
      <button 
        onClick={() => onSelectTab('daily')}
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-medium cursor-pointer"
      >
        <Home className="w-3.5 h-3.5 text-neutral-400" />
        <span>Início</span>
      </button>
      <ChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-600 shrink-0" />
      <span className="font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
        {currentLabel}
      </span>
    </nav>
  );
}

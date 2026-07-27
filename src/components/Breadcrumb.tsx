import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

const TAB_NAMES: Record<string, string> = {
  daily: 'Calculadora Diária',
  timesheet: 'Cartão de Ponto Semanal',
  monthly: 'Cálculo Mensal',
  banco: 'Banco de Horas',
  sum: 'Somador de Horas',
  holerite: 'Simulador de Holerite',
  rescisao: 'Calculadora de Rescisão CLT',
  rate: 'Valor da Hora',
  overtime: 'Horas Extras',
  night: 'Adicional Noturno',
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
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-neutral-500 flex items-center gap-1.5 flex-wrap no-print">
      <button 
        onClick={() => onSelectTab('daily')}
        className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium cursor-pointer"
      >
        <Home className="w-3.5 h-3.5 text-neutral-400" />
        <span>Início</span>
      </button>
      <ChevronRight className="w-3 h-3 text-neutral-300 shrink-0" />
      <span className="font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-md">
        {currentLabel}
      </span>
    </nav>
  );
}

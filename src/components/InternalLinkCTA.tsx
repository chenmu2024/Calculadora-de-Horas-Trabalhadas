import React from 'react';
import { Clock, FileSpreadsheet, DollarSign, Moon, ArrowRight, Calculator } from 'lucide-react';

interface InternalLinkCTAProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export default function InternalLinkCTA({ currentTab, onSelectTab }: InternalLinkCTAProps) {
  const links = [
    {
      tab: 'overtime',
      title: 'Calculadora de Horas Extras 50% / 100%',
      desc: 'Descubra quanto você vai receber pelas horas excedentes trabalhadas.',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400'
    },
    {
      tab: 'holerite',
      title: 'Simulador de Holerite e Salário Líquido',
      desc: 'Simule todos os descontos de INSS, IRRF e proventos do mês.',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400'
    },
    {
      tab: 'night',
      title: 'Adicional Noturno e Hora Ficta',
      desc: 'Calcule a redução de 52m30s e o adicional de 20% das 22h às 5h.',
      icon: Moon,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-400'
    },
    {
      tab: 'excel',
      title: 'Baixar Planilha Pronta em Excel',
      desc: 'Modelo gratuito em Excel para controle de folha de ponto e banco de horas.',
      icon: FileSpreadsheet,
      color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400'
    }
  ].filter(link => link.tab !== currentTab);

  return (
    <div className="mt-8 pt-6 border-t border-neutral-100 space-y-4 no-print">
      <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-blue-600" /> Ferramentas de Cálculo Relacionadas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.slice(0, 2).map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.tab}
              onClick={() => onSelectTab(link.tab)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-1.5 cursor-pointer group ${link.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-blue-700 flex items-center gap-1.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {link.title}
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-neutral-600 leading-snug">
                {link.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Sparkles, Calendar, Check, X, Clock } from 'lucide-react';

export interface ShiftTemplate {
  id: string;
  name: string;
  description: string;
  badge: string;
  days: Array<{
    date: string;
    start: string;
    lunchStart: string;
    lunchEnd: string;
    end: string;
    breakTime: string;
  }>;
}

interface ShiftTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: ShiftTemplate) => void;
}

export const PRESET_TEMPLATES: ShiftTemplate[] = [
  {
    id: 'escala_5x2_44h',
    name: 'Escala 5x2 (44h Semanal Padrão CLT)',
    description: 'Segunda a Quinta das 08:00 às 18:00 (1h almoço) e Sexta das 08:00 às 17:00 (1h almoço). Completa exatamente 44h normais sem horas extras.',
    badge: 'Mais Utilizada em Escritórios',
    days: [
      { date: 'Segunda-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '18:00', breakTime: '01:00' },
      { date: 'Terça-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '18:00', breakTime: '01:00' },
      { date: 'Quarta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '18:00', breakTime: '01:00' },
      { date: 'Quinta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '18:00', breakTime: '01:00' },
      { date: 'Sexta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '17:00', breakTime: '01:00' },
    ]
  },
  {
    id: 'escala_6x1_44h',
    name: 'Escala 6x1 (44h Com Sábado / Comércio)',
    description: 'Segunda a Sábado das 08:00 às 16:20 (1h de almoço) diários (7h20m por dia = 44h semanais). Padrão do comércio e varejo.',
    badge: 'Comércio / Varejo',
    days: [
      { date: 'Segunda-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '16:20', breakTime: '01:00' },
      { date: 'Terça-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '16:20', breakTime: '01:00' },
      { date: 'Quarta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '16:20', breakTime: '01:00' },
      { date: 'Quinta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '16:20', breakTime: '01:00' },
      { date: 'Sexta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '16:20', breakTime: '01:00' },
      { date: 'Sábado', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '16:20', breakTime: '01:00' },
    ]
  },
  {
    id: 'escala_5x2_40h',
    name: 'Escala 5x2 (40h Semanal Comercial)',
    description: 'Segunda a Sexta das 08:00 às 17:00 (1h almoço). Totaliza 8h líquidas por dia = 40 horas semanais.',
    badge: 'Tecnologia / Multinacionais',
    days: [
      { date: 'Segunda-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '17:00', breakTime: '01:00' },
      { date: 'Terça-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '17:00', breakTime: '01:00' },
      { date: 'Quarta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '17:00', breakTime: '01:00' },
      { date: 'Quinta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '17:00', breakTime: '01:00' },
      { date: 'Sexta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '17:00', breakTime: '01:00' },
    ]
  },
  {
    id: 'jornada_6h_36h',
    name: 'Jornada de 6 Horas Diárias (36h Semanal)',
    description: 'Segunda a Sábado das 08:00 às 14:15 com 15 minutos de intervalo obrigatório. Típico de telemarketing, saúde e bancos.',
    badge: 'Call Center / Saúde / Turnos',
    days: [
      { date: 'Segunda-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '12:15', end: '14:15', breakTime: '00:15' },
      { date: 'Terça-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '12:15', end: '14:15', breakTime: '00:15' },
      { date: 'Quarta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '12:15', end: '14:15', breakTime: '00:15' },
      { date: 'Quinta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '12:15', end: '14:15', breakTime: '00:15' },
      { date: 'Sexta-feira', start: '08:00', lunchStart: '12:00', lunchEnd: '12:15', end: '14:15', breakTime: '00:15' },
      { date: 'Sábado', start: '08:00', lunchStart: '12:00', lunchEnd: '12:15', end: '14:15', breakTime: '00:15' },
    ]
  }
];

export default function ShiftTemplatesModal({ isOpen, onClose, onApplyTemplate }: ShiftTemplatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Modelos Prontos de Escalas de Trabalho</h3>
              <p className="text-xs text-neutral-500">Preencha todo o cartão de ponto da semana com 1 clique</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-6">
          {PRESET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-sm text-neutral-900 group-hover:text-blue-700">
                  {tmpl.name}
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {tmpl.description}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {tmpl.days.length} Dias Programados
                </span>
                <button
                  onClick={() => {
                    onApplyTemplate(tmpl);
                    onClose();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Aplicar Escala
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

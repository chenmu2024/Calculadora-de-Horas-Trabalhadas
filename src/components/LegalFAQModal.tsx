import { useDialog } from '../hooks/useDialog';
import React, { useState } from 'react';
import { BookOpen, X, ChevronDown, ChevronUp, Scale, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LegalFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalFAQModal: React.FC<LegalFAQModalProps> = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  const faqs = [
    {
      title: 'Como funciona o cálculo das Horas Extras e do DSR (Súmula 172 TST)?',
      legalRef: 'Art. 59 da CLT e Súmula nº 172 do TST',
      content: `A hora extra prestada em dias úteis deve ser paga com acréscimo mínimo de 50% sobre o valor da hora normal. Trabalhos em domingos e feriados não compensados são pagos a 100%.
      
O Descanso Semanal Remunerado (DSR) sobre horas extras é calculado pela fórmula:
DSR = (Valor Total das Horas Extras do Mês / Dias Úteis do Mês) × (Domingos + Feriados do Mês).`
    },
    {
      title: 'O que é a Hora Extra Noturna e a Hora Reduzida?',
      legalRef: 'Art. 73 da CLT',
      content: `O trabalho executado entre as 22h de um dia e as 5h do dia seguinte é considerado noturno no meio urbano.
Ele dá direito a:
1. Adicional Noturno mínimo de 20% sobre a hora diurna.
2. Hora Noturna Reduzida: cada hora noturna equivale a 52 minutos e 30 segundos (ou 1,142857 hora).`
    },
    {
      title: 'Quais são os prazos e regras para a Rescisão do Contrato de Trabalho?',
      legalRef: 'Art. 477 e Art. 484-A da CLT',
      content: `O pagamento das verbas rescisórias deve ser efetuado em até 10 dias corridos após o término do contrato.

Principais tipos de demissão:
- Sem Justa Causa: Aviso prévio, saldo salário, 13º e férias proporcionais, saque integral FGTS + multa de 40%, além de liberação do Seguro-Desemprego.
- Acordo Mútuo (Art. 484-A): Metade do aviso prévio indenizado, multa do FGTS de 20%, saque de até 80% do saldo FGTS (sem Seguro-Desemprego).`
    },
    {
      title: 'Como é calculada a tabela progressiva do INSS 2026?',
      legalRef: 'Portaria Interministerial MPS/MF 2026',
      content: `O INSS é calculado de forma progressiva por faixas salariais:
- Até R$ 1.621,00: 7,5%
- De R$ 1.621,01 até R$ 2.902,84: 9,0%
- De R$ 2.902,85 até R$ 4.354,27: 12,0%
- De R$ 4.354,28 até R$ 8.475,55 (Teto): 14,0%

O valor retido é a soma das alíquotas aplicadas em cada faixa do salário do empregado.`
    },
    {
      title: 'O que é a tolerância legal na marcação do ponto (Espelho de Ponto)?',
      legalRef: 'Art. 58, § 1º da CLT e Súmula 366 do TST',
      content: `Não serão descontadas nem computadas como jornada extraordinária as variações de horário no registro de ponto não excedentes de 5 minutos, observado o limite máximo de 10 minutos diários. Se ultrapassar o limite diário de 10 minutos, todo o tempo excedente é considerado hora extra ou atraso.`
    }
  ];

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Guia CLT" tabIndex={-1} className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-fade-in no-print">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 space-y-5 relative max-h-[90vh] overflow-y-auto transition-colors">
        <button
          onClick={onClose}
            aria-label="Fechar"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Guia Legislação Trabalhista & Direitos CLT 2026</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Esclarecimentos judiciais baseados na CLT e Súmulas do TST</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100/80 dark:hover:bg-neutral-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{faq.title}</h3>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{faq.legalRef}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-2 font-sans">
                    {faq.content.split('\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Atualizado conforme Tabela MTE / Portarias 2026</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="px-4 py-2 bg-neutral-900 dark:bg-blue-600 hover:bg-neutral-800 dark:hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, CheckCircle2, Scale } from 'lucide-react';

export default function EATBadge() {
  return (
    <div className="bg-gradient-to-r from-blue-50/80 via-neutral-50 to-emerald-50/80 border border-blue-100 rounded-2xl p-4 my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs no-print">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Referências de Cálculo Trabalhista</span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> CLT 2026
            </span>
          </div>
          <p className="text-neutral-500 text-[11px] mt-0.5">
            Referências: TST, Art. 58 e Art. 73 da CLT • Tabelas fiscais 2026 • Confirme o acordo aplicável
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 bg-white/80 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shrink-0">
        <Scale className="w-3.5 h-3.5 text-blue-600" />
        <span>100% Privado (Sem Banco de Dados)</span>
      </div>
    </div>
  );
}

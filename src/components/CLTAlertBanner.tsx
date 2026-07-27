import React from 'react';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert, Scale } from 'lucide-react';

interface CLTCheckProps {
  totalMinutes?: number;
  breakMinutes?: number;
  overtimeMinutes?: number;
  interShiftHours?: number;
  isNightShift?: boolean;
}

export default function CLTAlertBanner({
  totalMinutes = 0,
  breakMinutes = 0,
  overtimeMinutes = 0,
  isNightShift = false,
}: CLTCheckProps) {
  const alerts: Array<{
    type: 'danger' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    article: string;
  }> = [];

  const workHours = totalMinutes / 60;
  const breakHours = breakMinutes / 60;
  const overtimeHours = overtimeMinutes / 60;

  // 1. Intrajornada check (Art. 71 CLT)
  if (workHours > 6 && breakMinutes < 60) {
    alerts.push({
      type: 'danger',
      title: 'Intervalo Intrajornada Insuficiente',
      description: `Jornadas superiores a 6 horas exigem no mínimo 1 hora (60 min) de intervalo para almoço/descanso. O intervalo atual é de ${breakMinutes} min.`,
      article: 'Art. 71 da CLT',
    });
  } else if (workHours > 4 && workHours <= 6 && breakMinutes < 15) {
    alerts.push({
      type: 'warning',
      title: 'Intervalo Mínimo de 15 Minutos Necessário',
      description: `Jornadas entre 4h e 6h exigem no mínimo 15 minutos de intervalo de descanso.`,
      article: 'Art. 71, § 1º da CLT',
    });
  }

  // 2. Overtime limit check (Art. 59 CLT)
  if (overtimeHours > 2) {
    alerts.push({
      type: 'warning',
      title: 'Limite Máximo de Horas Extras Excedido',
      description: `A CLT limita a prestação de horas extras a no máximo 2 horas suplementares por dia (${overtimeHours.toFixed(1)}h calculadas).`,
      article: 'Art. 59 da CLT',
    });
  }

  // 3. Night Shift Warning (Art. 73 CLT)
  if (isNightShift) {
    alerts.push({
      type: 'info',
      title: 'Jornada Noturna Detectada (22h às 05h)',
      description: 'Lembre-se que horas trabalhadas no período noturno têm redução da hora ficta (52m30s = 1h) e adicional noturno mínimo de 20%.',
      article: 'Art. 73 da CLT',
    });
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 my-3 text-xs flex items-center gap-2.5 text-emerald-800 no-print">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold">Conformidade Legal CLT:</span> Os horários e descansos informados estão de acordo com as normas vigentes do Art. 58, 59 e 71 da CLT.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 my-3 no-print">
      {alerts.map((alert, idx) => {
        const bgMap = {
          danger: 'bg-red-50 border-red-200 text-red-900',
          warning: 'bg-amber-50 border-amber-200 text-amber-900',
          info: 'bg-blue-50 border-blue-200 text-blue-900',
          success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        };

        const IconMap = {
          danger: ShieldAlert,
          warning: AlertTriangle,
          info: Info,
          success: CheckCircle2,
        };

        const Icon = IconMap[alert.type];

        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-all ${bgMap[alert.type]}`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-bold">{alert.title}</span>
                <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-md border border-black/10">
                  <Scale className="w-3 h-3 inline mr-1" />
                  {alert.article}
                </span>
              </div>
              <p className="mt-1 leading-relaxed opacity-90">{alert.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

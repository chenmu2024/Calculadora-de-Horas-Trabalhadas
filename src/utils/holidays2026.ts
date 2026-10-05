export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'nacional' | 'facultativo';
}

export const HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-01', name: 'Confraternização Universal (Ano Novo)', type: 'nacional' },
  { date: '2026-02-16', name: 'Carnaval (Ponto Facultativo)', type: 'facultativo' },
  { date: '2026-02-17', name: 'Carnaval (Ponto Facultativo)', type: 'facultativo' },
  { date: '2026-02-18', name: 'Quarta-feira de Cinzas (Facultativo até 14h)', type: 'facultativo' },
  { date: '2026-04-03', name: 'Sexta-feira Santa (Paixão de Cristo)', type: 'nacional' },
  { date: '2026-04-21', name: 'Tiradentes', type: 'nacional' },
  { date: '2026-05-01', name: 'Dia Mundial do Trabalho', type: 'nacional' },
  { date: '2026-06-04', name: 'Corpus Christi (Ponto Facultativo)', type: 'facultativo' },
  { date: '2026-09-07', name: 'Independência do Brasil', type: 'nacional' },
  { date: '2026-10-12', name: 'Nossa Senhora Aparecida', type: 'nacional' },
  { date: '2026-11-02', name: 'Finados', type: 'nacional' },
  { date: '2026-11-15', name: 'Proclamação da República', type: 'nacional' },
  { date: '2026-11-20', name: 'Dia Nacional de Zumbi e da Consciência Negra', type: 'nacional' },
  { date: '2026-12-25', name: 'Natal', type: 'nacional' },
];

export function getCalendarHolidays(includeOptional = false, localDates: string[] = []) {
  const holidays = new Map(HOLIDAYS_2026.filter(holiday => holiday.type === 'nacional' || includeOptional).map(holiday => [holiday.date, holiday]));
  for (const date of localDates) if (!holidays.has(date)) holidays.set(date, { date, name: 'Feriado local informado', type: 'nacional' });
  return [...holidays.values()];
}

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

/**
 * Calculates working days (Mon-Sat or Mon-Fri) and Sundays/Holidays for a given month in 2026
 */
export function getMonthWorkStats(year: number, monthZeroIndexed: number, includeSaturdayAsWorkday: boolean = true, includeOptional = false, localDates: string[] = []) {
  const selectedHolidays = getCalendarHolidays(includeOptional, localDates);
  const daysInMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();
  let workingDays = 0;
  let sundaysAndHolidays = 0;
  let saturdaysOff = 0;
  const monthHolidays: { day: number; name: string }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthZeroIndexed, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    const dateStr = `${year}-${String(monthZeroIndexed + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const holiday = HOLIDAYS_2026.find(h => h.date === dateStr);

    if (holiday) monthHolidays.push({ day, name: holiday.name });
    if (selectedHolidays.some(item => item.date === dateStr)) {
      sundaysAndHolidays++;
    } else if (dayOfWeek === 0) {
      sundaysAndHolidays++;
    } else if (dayOfWeek === 6) {
      if (includeSaturdayAsWorkday) {
        workingDays++;
      } else {
        saturdaysOff++;
      }
    } else {
      workingDays++;
    }
  }

  return {
    daysInMonth,
    workingDays,
    sundaysAndHolidays,
    monthHolidays,
    saturdaysOff
  };
}

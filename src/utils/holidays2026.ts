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

// Future-year dates are calculated from fixed federal observances and the Gregorian
// Easter calendar. Confirm official annual decrees and state/municipal observances.
const iso = (date: Date) => date.toISOString().slice(0, 10);
function easterSunday(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k + 7 * 6) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  return new Date(Date.UTC(year, Math.floor(n / 31) - 1, (n % 31) + 1));
}
function offset(date: Date, days: number): string {
  return iso(new Date(date.getTime() + days * 86400000));
}
export function getHolidaysForYear(year: number): Holiday[] {
  if (!Number.isInteger(year) || year < 2026 || year > 2100) return [];
  if (year === 2026) return HOLIDAYS_2026;
  const fixed = [
    ['01-01', 'Confraternização Universal (Ano Novo)'],
    ['04-21', 'Tiradentes'], ['05-01', 'Dia Mundial do Trabalho'],
    ['09-07', 'Independência do Brasil'], ['10-12', 'Nossa Senhora Aparecida'],
    ['11-02', 'Finados'], ['11-15', 'Proclamação da República'],
    ['11-20', 'Dia Nacional de Zumbi e da Consciência Negra'],
    ['12-25', 'Natal']
  ] as const;
  const easter = easterSunday(year);
  return [
    ...fixed.map(([day, name]) => ({ date: year + '-' + day, name, type: 'nacional' as const })),
    { date: offset(easter, -2), name: 'Sexta-feira Santa (Paixão de Cristo)', type: 'nacional' as const },
    { date: offset(easter, -48), name: 'Carnaval (Ponto Facultativo)', type: 'facultativo' as const },
    { date: offset(easter, -47), name: 'Carnaval (Ponto Facultativo)', type: 'facultativo' as const },
    { date: offset(easter, -46), name: 'Quarta-feira de Cinzas (Facultativo até 14h)', type: 'facultativo' as const },
    { date: offset(easter, 60), name: 'Corpus Christi (Ponto Facultativo)', type: 'facultativo' as const }
  ].sort((a, b) => a.date.localeCompare(b.date));
}

export function getCalendarHolidaysForRange(fromYear: number, toYear: number, includeOptional = false, localDates: string[] = []): Holiday[] {
  if (!Number.isInteger(fromYear) || !Number.isInteger(toYear) || fromYear < 2026 || toYear > 2100 || toYear < fromYear) return [];
  const result = new Map<string, Holiday>();
  for (let year = fromYear; year <= toYear; year++) {
    for (const holiday of getHolidaysForYear(year)) if (holiday.type === 'nacional' || includeOptional) result.set(holiday.date, holiday);
  }
  for (const date of localDates) if (!result.has(date)) result.set(date, { date, name: 'Feriado local informado', type: 'nacional' });
  return [...result.values()].sort((a, b) => a.date.localeCompare(b.date));
}

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
  const selectedHolidays = getCalendarHolidaysForRange(year, year, includeOptional, localDates);
  const daysInMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();
  let workingDays = 0;
  let sundaysAndHolidays = 0;
  let saturdaysOff = 0;
  const monthHolidays: { day: number; name: string }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthZeroIndexed, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    const dateStr = `${year}-${String(monthZeroIndexed + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const holiday = selectedHolidays.find(h => h.date === dateStr);

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

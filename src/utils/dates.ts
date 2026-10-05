const DAY = 86400000;
export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}
export function today(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function addMonths(date: Date, count: number): Date {
  const target = new Date(date);
  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() + count);
  const end = new Date(target);
  end.setUTCMonth(end.getUTCMonth() + 1);
  end.setUTCDate(0);
  target.setUTCDate(Math.min(date.getUTCDate(), end.getUTCDate()));
  return target;
}
export function serviceTime(start: string, end: string) {
  const from = parseDate(start), to = parseDate(end);
  if (!from || !to || to < from) return null;
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + to.getUTCMonth() - from.getUTCMonth();
  if (addMonths(from, months) > to) months--;
  return { years: Math.floor(months / 12), months: months % 12, days: (to.getTime() - addMonths(from, months).getTime()) / DAY, totalDays: (to.getTime() - from.getTime()) / DAY };
}
export function countBusinessDays(start: string, end: string, options: { excludeSaturday: boolean; excludeSunday: boolean; holidays: { date: string; name: string }[] }) {
  const from = parseDate(start), to = parseDate(end);
  if (!from || !to || to < from || (to.getTime() - from.getTime()) / DAY > 36600) return null;
  const calendar = new Map(options.holidays.map(holiday => [holiday.date, holiday]));
  let weekends = 0, businessDays = 0;
  const discounted: { date: string; name: string }[] = [];
  for (let timestamp = from.getTime(); timestamp <= to.getTime(); timestamp += DAY) {
    const date = new Date(timestamp), key = date.toISOString().slice(0, 10);
    if ((date.getUTCDay() === 6 && options.excludeSaturday) || (date.getUTCDay() === 0 && options.excludeSunday)) weekends++;
    else if (calendar.has(key)) discounted.push(calendar.get(key)!);
    else businessDays++;
  }
  return { calendarDays: (to.getTime() - from.getTime()) / DAY + 1, businessDays, weekends, discounted };
}

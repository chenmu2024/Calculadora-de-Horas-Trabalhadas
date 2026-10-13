import { LABOR_RULES } from '../lib/legal-rules/2026';

const DAY = 86400000;
function date(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Informe todas as datas.');
  const result = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(result.getTime()) || result.toISOString().slice(0, 10) !== value) throw new Error('Data inválida.');
  return result;
}
function month(value: Date, count: number): Date {
  const first = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + count, 1));
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  first.setUTCDate(Math.min(value.getUTCDate(), last));
  return first;
}
/** Explicit unpaid period starts avoid inferring previously paid vacation or 13th salary. */
export function terminationDates(admission: string, lastWorked: string, unpaid13Start: string, unpaidVacationStart: string, projectNotice: boolean | number) {
  const hire = date(admission), last = date(lastWorked), start13 = date(unpaid13Start), startVacation = date(unpaidVacationStart);
  if (last < hire || start13 < hire || start13 > last || startVacation < hire || startVacation > last || last.getUTCFullYear() - hire.getUTCFullYear() > 100) throw new Error('Confira a ordem das datas e os períodos ainda não quitados.');
  let years = last.getUTCFullYear() - hire.getUTCFullYear();
  if (month(hire, years * 12) > last) years--;
  const notice = Math.min(LABOR_RULES.notice.value.max, LABOR_RULES.notice.value.base + years * LABOR_RULES.notice.value.perYear);
  const projectionDays = typeof projectNotice === 'number' ? projectNotice : projectNotice ? notice : 0;
  if (!Number.isInteger(projectionDays) || projectionDays < 0 || projectionDays > 90) throw new Error('Informe os dias de projeção previstos no acordo (0 a 90).');
  const projected = new Date(last.getTime() + projectionDays * DAY);
  const monthStart = new Date(last.getTime());
  monthStart.setUTCDate(1);
  const salaryStart = hire > monthStart ? hire : monthStart;
  const monthEnd = new Date(last.getTime());
  monthEnd.setUTCMonth(last.getUTCMonth() + 1, 0);
  const suggestedSalaryDays = salaryStart.getUTCDate() === 1 && last.getUTCDate() === monthEnd.getUTCDate()
    ? 30 : Math.min(30, (last.getTime() - salaryStart.getTime()) / DAY + 1);
  const byYear: Record<string, number> = {};
  for (let cursor = new Date(Date.UTC(start13.getUTCFullYear(), start13.getUTCMonth(), 1)); cursor <= projected; cursor = month(cursor, 1)) {
    const end = new Date(month(cursor, 1).getTime() - DAY);
    const days = (Math.min(end.getTime(), projected.getTime()) - Math.max(cursor.getTime(), start13.getTime())) / DAY + 1;
    if (days >= LABOR_RULES.qualifyingDays.value) byYear[cursor.getUTCFullYear()] = (byYear[cursor.getUTCFullYear()] ?? 0) + 1;
  }
  let completed = 0, doubled = 0;
  while (month(startVacation, (completed + 1) * 12).getTime() <= projected.getTime() + DAY) {
    if (projected.getTime() >= month(startVacation, (completed + 2) * 12).getTime()) doubled++;
    completed++;
  }
  const current = month(startVacation, completed * 12);
  let avos = 0;
  while (avos < 12 && month(current, avos + 1).getTime() <= projected.getTime() + DAY) avos++;
  if ((projected.getTime() - month(current, avos).getTime()) / DAY + 1 >= LABOR_RULES.qualifyingDays.value) avos++;
  return { years, notice, projected: projected.toISOString().slice(0, 10), byYear, avos: Math.min(12, avos), simple: completed - doubled, doubled, suggestedSalaryDays };
}

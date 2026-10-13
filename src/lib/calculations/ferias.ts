import { LABOR_RULES } from '../legal-rules/2026';

export function money(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function numeric(value: string | number, label: string, max = 1_000_000_000, integer = false): number {
  const result = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  if (!Number.isFinite(result) || result < 0 || result > max || (integer && !Number.isInteger(result))) {
    throw new Error(`${label}: informe um número ${integer ? 'inteiro ' : ''}entre 0 e ${max}.`);
  }
  return result;
}

export interface FeriasInput {
  salary: string | number;
  average: string | number;
  mode: 'integrais' | 'proporcionais';
  months: string | number;
  absences: string | number;
  taken: string | number;
  sell: boolean;
}

export function calculateFerias(input: FeriasInput) {
  // Rescisão can pass a base combining salary and two separately validated averages.
  const salary = numeric(input.salary, 'Salário', 3_000_000_000);
  if (salary === 0) throw new Error('Informe um salário maior que zero.');
  const average = numeric(input.average, 'Média de adicionais');
  if (!['integrais', 'proporcionais'].includes(input.mode)) throw new Error('Tipo de férias inválido.');
  const months = input.mode === 'integrais' ? 12 : numeric(input.months, 'Meses', 12, true);
  const absences = numeric(input.absences, 'Faltas injustificadas', 366, true);
  const annualDays = LABOR_RULES.vacationDays.value.find(band => absences <= band.maxAbsences)!.days;
  const entitlement = annualDays * months / 12;
  const taken = numeric(input.taken, 'Dias já gozados', 30);
  if (taken > entitlement) throw new Error('Os dias já gozados não podem superar o direito apurado.');
  if (input.sell && input.mode === 'proporcionais') throw new Error('Abono não se aplica à simulação de férias proporcionais indenizadas.');
  const soldDays = input.sell ? annualDays * LABOR_RULES.abono.value : 0;
  if (soldDays > entitlement - taken) throw new Error('O saldo de férias é insuficiente para converter um terço em abono.');
  const daysOff = entitlement - taken - soldDays;
  const base = money(salary + average);
  const vacation = money(base * daysOff / 30);
  const third = money(vacation * LABOR_RULES.third.value);
  const abono = money(base * soldDays / 30);
  const abonoThird = money(abono * LABOR_RULES.third.value);
  return { base, average, annualDays, entitlement, taken, soldDays, daysOff, vacation, third, abono, abonoThird, total: money(vacation + third + abono + abonoThird) };
}

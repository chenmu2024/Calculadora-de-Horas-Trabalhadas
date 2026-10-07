import { isValidTime, timeToMinutes } from './time';

export function hoursToDecimal(value: string): number | null {
  return isValidTime(value, true) ? timeToMinutes(value) / 60 : null;
}
export function decimalToMinutes(value: string): number | null {
  if (!/^\d+(?:[.,]\d+)?$/.test(value.trim())) return null;
  const minutes = Math.round(Number(value.replace(',', '.')) * 60);
  return Number.isSafeInteger(minutes) ? minutes : null;
}
export function parseDurationSeconds(value: string): number | null {
  if (!/^\d{1,6}:\d{2}(?::\d{2})?$/.test(value)) return null;
  const [hours, minutes, seconds = 0] = value.split(':').map(Number);
  return minutes < 60 && seconds < 60 ? hours * 3600 + minutes * 60 + seconds : null;
}
export function sumDurationSeconds(rows: { value: string; operation: '+' | '-' }[]): number | null {
  let total = 0;
  for (const row of rows) {
    const value = parseDurationSeconds(row.value);
    if (value === null) return null;
    total += row.operation === '+' ? value : -value;
  }
  return total;
}
export function formatDurationSeconds(value: number, seconds = false): string {
  const absolute = Math.abs(value);
  return `${value < 0 ? '-' : ''}${String(Math.floor(absolute / 3600)).padStart(2, '0')}:${String(Math.floor(absolute % 3600 / 60)).padStart(2, '0')}${seconds ? ':' + String(absolute % 60).padStart(2, '0') : ''}`;
}
export function bankBalance(worked: number, expected: number): number | null {
  return [worked, expected].every(value => Number.isFinite(value) && value >= 0) ? worked - expected : null;
}

// Returns null rather than Infinity/NaN for invalid salary-hour divisors.
export function hourlyRateForDivisor(salary: number, divisor: number): number | null {
  if (!Number.isFinite(salary) || salary < 0 || !Number.isFinite(divisor) || divisor <= 0) return null;
  const value = salary / divisor;
  return Number.isFinite(value) ? value : null;
}

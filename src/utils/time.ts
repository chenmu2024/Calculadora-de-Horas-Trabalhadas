export function isValidTime(value: string, duration = false): boolean {
  return typeof value === 'string' && /^\d{1,3}:\d{2}$/.test(value) && Number(value.split(':')[1]) < 60 && (duration || Number(value.split(':')[0]) < 24);
}
export function timeToMinutes(timeStr: string): number {
  if (!isValidTime(timeStr, true)) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}
export function minutesToTime(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return '00:00';
  const rounded = Math.round(minutes);
  return `${Math.floor(rounded / 60).toString().padStart(2, '0')}:${(rounded % 60).toString().padStart(2, '0')}`;
}
export function calculateDuration(start: string, end: string, breakStart?: string, breakEnd?: string, breakMinutes = 0): number {
  if (!isValidTime(start) || !isValidTime(end) || !Number.isFinite(breakMinutes) || breakMinutes < 0) return 0;
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end) + (timeToMinutes(end) < startMin ? 1440 : 0);
  let rest = breakMinutes;
  if (breakStart !== undefined || breakEnd !== undefined) {
    if (!isValidTime(breakStart ?? '') || !isValidTime(breakEnd ?? '')) return 0;
    let bStart = timeToMinutes(breakStart!);
    if (bStart < startMin) bStart += 1440;
    let bEnd = timeToMinutes(breakEnd!);
    if (bEnd < bStart) bEnd += 1440;
    if (bStart < startMin || bEnd > endMin) return 0;
    rest = bEnd - bStart;
  }
  return Math.max(0, endMin - startMin - rest);
}
export function calculateFourPunches(punches: string[]) {
  if (punches.length !== 4 || punches.some(p => !isValidTime(p))) return null;
  const points = punches.map(timeToMinutes);
  for (let i = 1; i < points.length; i++) {
    while (points[i] < points[i - 1]) points[i] += 1440;
  }
  if (points[3] - points[0] >= 1440) return null;
  return { worked: points[1] - points[0] + points[3] - points[2], rest: points[2] - points[1] };
}
export function calculateNightShift(start: string, end: string, sector: string) {
  if (!isValidTime(start) || !isValidTime(end)) return { night: 0, extension: 0 };
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end) + (timeToMinutes(end) < startMin ? 1440 : 0);
  const nightStart = sector === 'rural_agriculture' ? 21 * 60 : sector === 'rural_livestock' ? 20 * 60 : 22 * 60;
  const nightEnd = sector === 'rural_livestock' ? 4 * 60 : 5 * 60;
  let night = 0;
  let extension = 0;
  for (const offset of [-1440, 0, 1440]) {
    const from = nightStart + offset;
    const to = 1440 + nightEnd + offset;
    night += Math.max(0, Math.min(endMin, to) - Math.max(startMin, from));
    // Extension requires a full urban night and confirmation of the applicable agreement.
    if (sector === 'urban' && startMin <= from && endMin > to) extension = endMin - to;
  }
  return { night: night / 60, extension: extension / 60 };
}

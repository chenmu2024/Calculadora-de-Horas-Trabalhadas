export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) return '00:00';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function calculateDuration(start: string, end: string, breakStart?: string, breakEnd?: string, breakMinutes?: number): number {
  let startMin = timeToMinutes(start);
  let endMin = timeToMinutes(end);
  
  // Handle cross-midnight
  if (endMin < startMin) {
    endMin += 24 * 60;
  }
  
  let totalMin = endMin - startMin;
  
  if (breakStart && breakEnd) {
     let bStart = timeToMinutes(breakStart);
     let bEnd = timeToMinutes(breakEnd);
     if (bEnd < bStart) bEnd += 24 * 60;
     totalMin -= (bEnd - bStart);
  } else if (breakMinutes) {
     totalMin -= breakMinutes;
  }
  
  return Math.max(0, totalMin);
}

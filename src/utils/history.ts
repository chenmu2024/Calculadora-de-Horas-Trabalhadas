import { storage } from './browser';
import { TAB_ROUTES } from './routes';
export interface HistoryItem {
  id: string; date: string; toolTab: string; toolName: string; summary: string; mainValue: string;
}
export function readHistory(): HistoryItem[] {
  const items: HistoryItem[] = [];
  for (const key of ['calc_history', 'user_calc_history']) {
    try {
      const rows = JSON.parse(storage.getItem(key) || '[]');
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (!row || typeof row !== 'object') continue;
        const tab = row.toolTab ?? row.tab;
        if (!TAB_ROUTES[tab] || typeof row.id !== 'string' || typeof row.summary !== 'string') continue;
        if (items.some(item => item.id === row.id)) continue;
        items.push({ id: row.id, date: String(row.date ?? ''), toolTab: tab, toolName: String(row.toolName ?? row.title ?? tab), summary: row.summary, mainValue: String(row.mainValue ?? '') });
      }
    } catch { /* Discard corrupt records; retain other valid history. */ }
  }
  return items.slice(0, 50);
}
export function saveToHistory(item: Omit<HistoryItem, 'id' | 'date'>): boolean {
  const row = { ...item, id: crypto.randomUUID(), date: new Date().toLocaleString('pt-BR') };
  return storage.setItem('calc_history', JSON.stringify([row, ...readHistory()].slice(0, 50)));
}
export function clearHistory(): boolean {
  const current = storage.removeItem('calc_history');
  const legacy = storage.removeItem('user_calc_history');
  return current && legacy;
}

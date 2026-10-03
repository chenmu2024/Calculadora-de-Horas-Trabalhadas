export function notify(message: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('calculator-notice', { detail: message }));
}
export const storage = {
  getItem(key: string): string | null {
    try { return typeof localStorage === 'undefined' ? null : localStorage.getItem(key); } catch { return null; }
  },
  setItem(key: string, value: string): boolean {
    try { localStorage.setItem(key, value); return true; }
    catch { notify('Não foi possível salvar neste navegador. Seus resultados atuais continuam disponíveis.'); return false; }
  },
  removeItem(key: string): boolean {
    try { localStorage.removeItem(key); return true; }
    catch { notify('Não foi possível remover os dados salvos neste navegador.'); return false; }
  }
};
export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { notify('Não foi possível copiar. Selecione o resultado e copie manualmente.'); return false; }
}
export function nonNegative(value: string | number, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : value.trim() === '' ? NaN : Number(value);
  return Number.isFinite(parsed) && parsed <= Number.MAX_SAFE_INTEGER ? Math.max(0, parsed) : fallback;
}

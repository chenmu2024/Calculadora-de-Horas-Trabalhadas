export const TAB_ROUTES: Record<string, string> = {
  daily: '/',
  timesheet: '/calculadora-semanal',
  monthly: '/calculadora-mensal',
  banco: '/banco-de-horas',
  sum: '/somador-de-horas',
  holerite: '/simulador-de-holerite',
  rescisao: '/calculadora-de-rescisao',
  rate: '/valor-da-hora',
  overtime: '/horas-extras',
  night: '/adicional-noturno',
  excel: '/planilha-excel-ponto',
  blog: '/guia-clt',
  about: '/sobre',
  contact: '/contato',
  terms: '/termos',
  privacy: '/privacidade',
};

export const PATH_TO_TAB: Record<string, string> = {
  '/': 'daily',
  '/calculadora-semanal': 'timesheet',
  '/calculadora-mensal': 'monthly',
  '/banco-de-horas': 'banco',
  '/somador-de-horas': 'sum',
  '/simulador-de-holerite': 'holerite',
  '/calculadora-de-rescisao': 'rescisao',
  '/valor-da-hora': 'rate',
  '/horas-extras': 'overtime',
  '/adicional-noturno': 'night',
  '/planilha-excel-ponto': 'excel',
  '/guia-clt': 'blog',
  '/sobre': 'about',
  '/contato': 'contact',
  '/termos': 'terms',
  '/privacidade': 'privacy',
  // Short path aliases for backwards compatibility
  '/timesheet': 'timesheet',
  '/monthly': 'monthly',
  '/banco': 'banco',
  '/sum': 'sum',
  '/holerite': 'holerite',
  '/rescisao': 'rescisao',
  '/rate': 'rate',
  '/overtime': 'overtime',
  '/night': 'night',
  '/excel': 'excel',
  '/blog': 'blog',
  '/about': 'about',
  '/contact': 'contact',
  '/terms': 'terms',
  '/privacy': 'privacy',
};

export function getTabFromLocation(): string {
  if (typeof window === 'undefined') return 'daily';

  // 1. Check query param for legacy links (?tab=holerite)
  const params = new URLSearchParams(window.location.search);
  const queryTab = params.get('tab');
  if (queryTab && TAB_ROUTES[queryTab]) {
    return queryTab;
  }

  // 2. Check clean pathname
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  if (PATH_TO_TAB[pathname]) {
    return PATH_TO_TAB[pathname];
  }

  return 'not-found';
}

export function getHrefForTab(tab: string): string {
  return TAB_ROUTES[tab] || '/';
}

import { ARTICLE_META } from './articles';
export const TAB_ROUTES: Record<string, string> = {
  daily: '/',
  timesheet: '/calculadora-semanal',
  monthly: '/calculadora-mensal',
  escala12x36: '/escala-12x36',
  faltas: '/atrasos-e-faltas',
  ferias: '/calculadora-de-ferias',
  decimo: '/decimo-terceiro',
  seguro: '/seguro-desemprego',
  insalubridade: '/insalubridade-e-periculosidade',
  cltpj: '/calculadora-clt-pj',
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
  '/escala-12x36': 'escala12x36',
  '/atrasos-e-faltas': 'faltas',
  '/calculadora-de-ferias': 'ferias',
  '/decimo-terceiro': 'decimo',
  '/seguro-desemprego': 'seguro',
  '/insalubridade-e-periculosidade': 'insalubridade',
  '/calculadora-clt-pj': 'cltpj',
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
  '/12x36': 'escala12x36',
  '/escala12x36': 'escala12x36',
  '/faltas': 'faltas',
  '/ferias': 'ferias',
  '/decimo': 'decimo',
  '/13': 'decimo',
  '/seguro': 'seguro',
  '/insalubridade': 'insalubridade',
  '/cltpj': 'cltpj',
  '/clt-pj': 'cltpj',
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
  if (ARTICLE_META.some(article => pathname === `/guia-clt/${article.slug}`)) return 'blog';
  if (PATH_TO_TAB[pathname]) {
    return PATH_TO_TAB[pathname];
  }

  return 'not-found';
}

export function getHrefForTab(tab: string): string {
  return TAB_ROUTES[tab] || '/';
}

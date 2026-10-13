// Review date is editorial verification against these official sources, not legal certification.
export const LABOR_REVIEWED = '2026-10-14';
export const LABOR_SOURCES = {
  clt: { name: 'CLT — arts. 130, 137, 142–147, 477, 484-A e 487', url: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm' },
  constitution: { name: 'Constituição Federal — art. 7º, XVII', url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
  notice: { name: 'Lei 12.506/2011 — aviso prévio proporcional', url: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm' },
  thirteenth: { name: 'Lei 4.090/1962 — 13º salário', url: 'https://www.planalto.gov.br/ccivil_03/leis/l4090.htm' },
  mte: { name: 'MTE — direitos na rescisão', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/proteja/duvidas-frequentes' },
  fgts: { name: 'Lei 8.036/1990 — FGTS, arts. 18, 20 e 20-A', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm' },
  fgtsBase: { name: 'FGTS Digital — base total para fins rescisórios', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/perguntas-frequentes' },
  stf: { name: 'STF — ADPF 501: atraso no pagamento e férias em dobro', url: 'https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=492245&ori=1' },
};

export const LABOR_RULES = {
  vacationDays: { value: [{ maxAbsences: 5, days: 30 }, { maxAbsences: 14, days: 24 }, { maxAbsences: 23, days: 18 }, { maxAbsences: 32, days: 12 }, { maxAbsences: Infinity, days: 0 }], effectiveFrom: '1977-05-01', source: LABOR_SOURCES.clt.url, lastReviewed: LABOR_REVIEWED },
  third: { value: 1 / 3, effectiveFrom: '1988-10-05', source: LABOR_SOURCES.constitution.url, lastReviewed: LABOR_REVIEWED },
  abono: { value: 1 / 3, effectiveFrom: '1977-05-01', source: LABOR_SOURCES.clt.url, lastReviewed: LABOR_REVIEWED },
  notice: { value: { base: 30, perYear: 3, max: 90 }, effectiveFrom: '2011-10-13', source: LABOR_SOURCES.notice.url, lastReviewed: LABOR_REVIEWED },
  qualifyingDays: { value: 15, effectiveFrom: '1962-07-26', source: LABOR_SOURCES.thirteenth.url, lastReviewed: LABOR_REVIEWED },
  // Full salary, 13th and vacation entitlements apply to all three supported modalities.
  entitlements: { value: {
    sem_justa_causa: { noticeFactor: 1, fineRate: 0.4, withdrawalRate: 1 },
    pedido_demissao: { noticeFactor: 0, fineRate: 0, withdrawalRate: 0 },
    acordo_mutuo: { noticeFactor: 0.5, fineRate: 0.2, withdrawalRate: 0.8 },
  }, effectiveFrom: '2017-11-11', source: LABOR_SOURCES.clt.url, lastReviewed: LABOR_REVIEWED },
};

import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateFerias } from '../src/lib/calculations/ferias';
import { calculateRescisao, type RescisaoInput } from '../src/lib/calculations/rescisao';
import RescisaoCalculator from '../src/components/RescisaoCalculator';
import FeriasCalculator from '../src/components/FeriasCalculator';
import StaticPageContent from '../src/components/StaticPageContent';
import { LABOR_RULES } from '../src/lib/legal-rules/2026';

const base: RescisaoInput = {
  salary: 3000, overtime: 0, average: 0, type: 'pedido_demissao', notice: 'trabalhado', years: 0,
  salaryDays: 15, months13: 0, monthsVacation: 0, simpleDays: 0, doubleDays: 0, absences: 0,
  advance13: 0, credits: 0, deductions: 0, unworkedNoticeDays: 30, fgtsBalance: '', fgtsBase: '', withdrawal: 'rescisao',
};
const period = (admission: string, last: string, start13 = admission, vacation = admission, projectDays = '') => ({ admission, last, start13, vacation, projectDays });
// Independent BRL expectations, with rubrics rounded to cents before summation.
const scenarios: [string, Partial<RescisaoInput>, number][] = [
  ['pedido de demissão, saldo de 15 dias', {}, 1500],
  ['saldo zero', { salaryDays: 0 }, 0],
  ['saldo mensal completo', { salaryDays: 30 }, 3000],
  ['13º de seis meses', { months13: 6 }, 3000],
  ['férias proporcionais de seis meses + terço', { monthsVacation: 6 }, 3500],
  ['férias integrais simples + terço', { simpleDays: 30 }, 5500],
  ['férias vencidas em dobro + terço', { doubleDays: 30 }, 9500],
  ['férias parcialmente gozadas', { simpleDays: 12 }, 3100],
  ['sem justa causa, aviso de 30 dias', { type: 'sem_justa_causa', notice: 'indenizado' }, 4500],
  ['sem justa causa, aviso de 36 dias', { type: 'sem_justa_causa', notice: 'indenizado', years: 2 }, 5100],
  ['limite de 90 dias de aviso', { type: 'sem_justa_causa', notice: 'indenizado', years: 40 }, 10500],
  ['aviso trabalhado não é indenizado novamente', { type: 'sem_justa_causa', notice: 'trabalhado' }, 1500],
  ['aviso dispensado sem desconto', { notice: 'dispensado' }, 1500],
  ['pedido com 30 dias não cumpridos', { notice: 'nao_cumprido' }, -1500],
  ['pedido com 10 dias não cumpridos', { notice: 'nao_cumprido', unworkedNoticeDays: 10 }, 500],
  ['acordo com aviso indenizado pela metade', { type: 'acordo_mutuo', notice: 'indenizado', years: 2 }, 3300],
  ['acordo com aviso trabalhado integral na folha', { type: 'acordo_mutuo', notice: 'trabalhado' }, 1500],
  ['médias integradas uma vez', { overtime: 200, average: 400, months13: 6, monthsVacation: 6 }, 6000],
  ['13º antecipado abatido uma vez', { months13: 6, advance13: 1000 }, 2000],
  ['créditos e descontos', { credits: 400, deductions: 100 }, 1800],
  ['faltas reduzem férias para 24 dias anuais', { monthsVacation: 6, absences: 6 }, 3100],
  ['faltas reduzem férias para 18 dias anuais', { monthsVacation: 6, absences: 15 }, 2700],
  ['faltas reduzem férias para 12 dias anuais', { monthsVacation: 6, absences: 24 }, 2300],
  ['mais de 32 faltas não elimina férias de outro período', { monthsVacation: 6, absences: 33, simpleDays: 30 }, 5500],
  ['entrada e saída em janeiro, limite de 14 dias', { dates: period('2026-01-01', '2026-01-14'), salaryDays: 14 }, 1400],
  ['entrada e saída em janeiro, limite de 15 dias', { dates: period('2026-01-01', '2026-01-15') }, 2083.33],
  ['admissão no meio do mês, 15 dias', { dates: period('2026-01-17', '2026-01-31') }, 2083.33],
  ['admissão no meio do mês, 14 dias', { dates: period('2026-01-18', '2026-01-31'), salaryDays: 14 }, 1400],
  ['férias por mês de serviço, não por mês civil', { dates: period('2026-05-10', '2026-06-24'), salaryDays: 24 }, 3566.67],
  ['dois anos não quitados de 13º separados', { dates: period('2025-12-01', '2026-01-15') }, 2666.67],
  ['aviso cruza ano, férias adquiridas e proporcionais', { type: 'sem_justa_causa', notice: 'indenizado', dates: period('2020-01-01', '2026-12-20', '2026-01-01', '2026-01-01'), salaryDays: 20, simpleDays: 30 }, 14383.33],
  ['acordo usa 15 dias explícitos de projeção', { type: 'acordo_mutuo', notice: 'indenizado', dates: period('2020-01-01', '2026-12-20', '2026-01-01', '2026-01-01', '15'), salaryDays: 20, simpleDays: 30 }, 11400],
];
for (const [name, overrides, expected] of scenarios) test(`rescisão: ${name}`, () => {
  const result = calculateRescisao({ ...base, ...overrides });
  assert.equal(result.total, expected);
  assert.equal(result.gross - result.deductions, expected);
});

test('FGTS uses rescisory base, stays outside employer total, and respects withdrawal modality', () => {
  const dismissal = calculateRescisao({ ...base, type: 'sem_justa_causa', fgtsBalance: 10000, fgtsBase: 12000 });
  assert.equal(dismissal.total, 1500);
  assert.equal(dismissal.fgts.fine, 4800);
  assert.equal(dismissal.fgts.available, 14800);
  const agreement = calculateRescisao({ ...base, type: 'acordo_mutuo', fgtsBalance: 10000, fgtsBase: 12000 });
  assert.equal(agreement.fgts.fine, 2400);
  assert.equal(agreement.fgts.availableBalance, 8000);
  assert.equal(agreement.fgts.available, 10400);
  assert.equal(calculateRescisao({ ...base, type: 'sem_justa_causa', fgtsBalance: 10000, fgtsBase: 12000, withdrawal: 'aniversario' }).fgts.available, 4800);
  assert.equal(calculateRescisao({ ...base, fgtsBalance: 10000, fgtsBase: 12000 }).fgts.available, 0);
  assert.equal(calculateRescisao({ ...base, type: 'sem_justa_causa' }).fgts.fine, null);
  assert.equal(calculateRescisao({ ...base, type: 'sem_justa_causa', fgtsBalance: 0, fgtsBase: 0 }).fgts.available, 0);
});

const vacation = { salary: 3000, average: 0, mode: 'integrais' as const, months: 12, absences: 0, taken: 0, sell: false };
for (const [absences, days] of [[0, 30], [5, 30], [6, 24], [14, 24], [15, 18], [23, 18], [24, 12], [32, 12], [33, 0]]) {
  test(`férias: faixa de ${absences} faltas = ${days} dias`, () => {
    const result = calculateFerias({ ...vacation, absences, sell: true });
    assert.equal(result.entitlement, days);
    assert.equal(result.soldDays, days / 3);
    assert.equal(result.total, days / 30 * 4000);
  });
}
test('férias: proportional months, included averages, sold third and already paid days', () => {
  assert.equal(calculateFerias({ ...vacation, mode: 'proporcionais', months: 6 }).total, 2000);
  assert.equal(calculateFerias({ ...vacation, average: 300 }).total, 4400);
  assert.equal(calculateFerias({ ...vacation, taken: 10 }).total, 2666.67);
  assert.equal(calculateFerias({ ...vacation, taken: 20, sell: true }).total, 1333.33);
  const sold = calculateFerias({ ...vacation, sell: true });
  assert.deepEqual([sold.vacation, sold.third, sold.abono, sold.abonoThird, sold.total], [2000, 666.67, 1000, 333.33, 4000]);
  assert.equal(calculateFerias({ ...vacation, mode: 'proporcionais', months: 0 }).total, 0);
});

test('invalid money, integer counts, unsupported modalities and inconsistent dates are rejected', () => {
  for (const salary of ['', -1, NaN, Infinity, 0, 'abc', 1e12]) {
    assert.throws(() => calculateRescisao({ ...base, salary }));
    assert.throws(() => calculateFerias({ ...vacation, salary }));
  }
  for (const override of [{ months13: 13 }, { monthsVacation: 1.5 }, { absences: -1 }, { unworkedNoticeDays: 31, notice: 'nao_cumprido' }, { type: 'com_justa_causa' }, { notice: 'indenizado' }, { type: 'acordo_mutuo', notice: 'nao_cumprido' }, { fgtsBase: -1 }]) {
    assert.throws(() => calculateRescisao({ ...base, ...override } as RescisaoInput));
  }
  for (const dates of [period('2026-02-30', '2026-03-01'), period('2026-03-01', '2026-02-01'), period('2026-01-01', '2026-03-01', '', ''), period('2026-01-01', '2026-03-01', '2026-04-01')]) assert.throws(() => calculateRescisao({ ...base, dates }));
  assert.throws(() => calculateRescisao({ ...base, type: 'acordo_mutuo', notice: 'indenizado', dates: period('2026-01-01', '2026-03-01') }));
  assert.throws(() => calculateFerias({ ...vacation, mode: 'proporcionais', sell: true }));
  assert.throws(() => calculateFerias({ ...vacation, months: 13, mode: 'proporcionais' }));
  assert.throws(() => calculateFerias({ ...vacation, taken: 31 }));
  assert.throws(() => calculateFerias({ ...vacation, taken: 21, sell: true }));
});

test('extreme valid amounts remain finite and rounding is consistent', () => {
  const result = calculateRescisao({ ...base, salary: 1e9, average: 1e9, overtime: 1e9, simpleDays: 3600, doubleDays: 3600 });
  assert.ok(Number.isFinite(result.total));
  assert.equal(calculateFerias({ ...vacation, salary: 0.01 }).total, 0.01);
});

test('initial HTML has detailed gross calculators and relevant static guides with sources', () => {
  for (const [tab, Component] of [['rescisao', RescisaoCalculator], ['ferias', FeriasCalculator]] as const) {
    const html = renderToStaticMarkup(<><Component /><StaticPageContent tab={tab} /></>);
    assert.ok(html.includes('Como foi calculado?'));
    assert.ok(html.includes('14/10/2026'));
    assert.ok(html.includes('Fontes oficiais'));
    assert.ok(html.includes('Perguntas frequentes sobre'));
    assert.ok(html.includes('www.planalto.gov.br'));
    assert.ok(!html.includes('Líquido a Receber') && !html.includes('Direito Garantido'));
  }
});

test('changing rules retain values, effective dates, sources and review metadata', () => {
  for (const rule of Object.values(LABOR_RULES)) {
    assert.ok(rule.value !== undefined && rule.source.startsWith('https://'));
    assert.match(rule.effectiveFrom, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(rule.lastReviewed, '2026-10-14');
  }
});

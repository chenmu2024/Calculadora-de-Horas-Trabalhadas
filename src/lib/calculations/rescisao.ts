import { terminationDates } from '../../utils/termination';
import { LABOR_RULES } from '../legal-rules/2026';
import { calculateFerias, money, numeric } from './ferias';

export type TerminationType = keyof typeof LABOR_RULES.entitlements.value;
export type NoticeType = 'indenizado' | 'trabalhado' | 'dispensado' | 'nao_cumprido';
export interface RescisaoInput {
  salary: string | number;
  overtime: string | number;
  average: string | number;
  type: TerminationType;
  notice: NoticeType;
  years: string | number;
  salaryDays: string | number;
  months13: string | number;
  monthsVacation: string | number;
  simpleDays: string | number;
  doubleDays: string | number;
  absences: string | number;
  advance13: string | number;
  credits: string | number;
  deductions: string | number;
  unworkedNoticeDays: string | number;
  fgtsBalance: string | number;
  fgtsBase: string | number;
  withdrawal: 'rescisao' | 'aniversario';
  dates?: { admission: string; last: string; start13: string; vacation: string; projectDays: string };
}

export function calculateRescisao(input: RescisaoInput) {
  if (!Object.hasOwn(LABOR_RULES.entitlements.value, input.type)) throw new Error('Tipo de rescisão não suportado.');
  if (!['indenizado', 'trabalhado', 'dispensado', 'nao_cumprido'].includes(input.notice)) throw new Error('Aviso prévio inválido.');
  if (input.type === 'pedido_demissao' && input.notice === 'indenizado') throw new Error('No pedido de demissão, selecione aviso trabalhado, dispensado ou não cumprido.');
  if (input.type !== 'pedido_demissao' && input.notice === 'nao_cumprido') throw new Error('Desconto de aviso só está disponível para pedido de demissão.');
  if (input.type !== 'pedido_demissao' && input.notice === 'dispensado') throw new Error('Na dispensa ou acordo, informe aviso trabalhado ou indenizado.');
  if (!['rescisao', 'aniversario'].includes(input.withdrawal)) throw new Error('Modalidade de saque inválida.');
  const entitlement = LABOR_RULES.entitlements.value[input.type];
  const salary = numeric(input.salary, 'Salário');
  if (salary === 0) throw new Error('Informe um salário maior que zero.');
  const average = numeric(input.average, 'Média de adicionais') + numeric(input.overtime, 'Média de horas extras');
  const base = money(salary + average);
  const dates = input.dates;
  const projection = dates ? terminationDates(dates.admission, dates.last, dates.start13, dates.vacation,
    input.notice !== 'indenizado' ? false : input.type === 'acordo_mutuo' ? numeric(dates.projectDays, 'Dias de projeção do acordo', 90, true) : input.type === 'sem_justa_causa') : null;
  const years = projection?.years ?? numeric(input.years, 'Anos completos', 100, true);
  const rule = LABOR_RULES.notice.value;
  const noticeDays = input.type === 'pedido_demissao' ? rule.base : Math.min(rule.max, rule.base + years * rule.perYear);
  const notice = input.notice === 'indenizado' ? money(base * noticeDays / 30 * entitlement.noticeFactor) : 0;
  const noticeDeduction = input.type === 'pedido_demissao' && input.notice === 'nao_cumprido' ? money(base * numeric(input.unworkedNoticeDays, 'Dias de aviso não cumpridos', 30, true) / 30) : 0;
  // Salary days are explicit: confirm prior payroll payments and the monthly payroll divisor.
  const salaryDays = numeric(input.salaryDays, 'Dias de saldo de salário', 30, true);
  const salaryBalance = money(base * salaryDays / 30);
  const months13 = projection ? Object.values(projection.byYear).reduce((sum, value) => sum + value, 0) : numeric(input.months13, 'Avos de 13º', 12, true);
  const thirteenth = projection ? money(Object.values(projection.byYear).reduce((sum, months) => sum + money(base * months / 12), 0)) : money(base * months13 / 12);
  const vacationMonths = projection?.avos ?? numeric(input.monthsVacation, 'Avos de férias', 12, true);
  const vacation = calculateFerias({ salary: base, average: 0, mode: 'proporcionais', months: vacationMonths, absences: input.absences, taken: 0, sell: false });
  const simpleDays = numeric(input.simpleDays, 'Dias de férias integrais pendentes', 3600);
  const doubleDays = numeric(input.doubleDays, 'Dias de férias vencidas pendentes', 3600);
  const simpleVacation = money(base * simpleDays / 30);
  const doubleVacation = money(base * doubleDays / 30 * 2);
  const third = money((simpleVacation + doubleVacation + vacation.vacation) * LABOR_RULES.third.value);
  const credits = numeric(input.credits, 'Outros créditos');
  const advance13 = numeric(input.advance13, '13º já adiantado');
  const otherDeductions = numeric(input.deductions, 'Outros descontos');
  const deductions = money(advance13 + otherDeductions + noticeDeduction);
  const gross = money(salaryBalance + notice + thirteenth + simpleVacation + doubleVacation + vacation.vacation + third + credits);
  // Unknown FGTS fields remain unknown, never inferred from current salary or account balance.
  const balance = input.fgtsBalance === '' ? null : numeric(input.fgtsBalance, 'Saldo do FGTS');
  const fgtsBase = input.fgtsBase === '' ? null : numeric(input.fgtsBase, 'Base total para fins rescisórios');
  const fine = entitlement.fineRate === 0 ? 0 : fgtsBase === null ? null : money(fgtsBase * entitlement.fineRate);
  const withdrawalRate = input.withdrawal === 'aniversario' ? 0 : entitlement.withdrawalRate;
  const availableBalance = withdrawalRate === 0 ? 0 : balance === null ? null : money(balance * withdrawalRate);
  const available = availableBalance === null || fine === null ? null : money(availableBalance + fine);
  return { base, average, years, noticeDays, notice, noticeDeduction, salaryDays, salaryBalance, months13, thirteenth, vacationMonths, vacation: vacation.vacation, simpleVacation, doubleVacation, third, credits, advance13, otherDeductions, deductions, gross, total: money(gross - deductions), projection, fgts: { balance, base: fgtsBase, fine, availableBalance, available, rate: entitlement.fineRate, withdrawalRate } };
}

/** Official 2026 tables: RFB monthly IRRF and Portaria MPS/MF 13/2026. */
export const MINIMUM_WAGE_2026 = 1621;
export const INSS_BRACKETS_2026 = [
  { limit: 1621, rate: 0.075 }, { limit: 2902.84, rate: 0.09 },
  { limit: 4354.27, rate: 0.12 }, { limit: 8475.55, rate: 0.14 }
];
export const INSS_CEILING_2026 = 8475.55;
export const DEDUCTION_PER_DEPENDENT = 189.59;
export const SIMPLIFIED_IRRF_DISCOUNT = 607.20;
export const IRRF_BRACKETS_2026 = [
  { limit: 2428.80, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 182.16 },
  { limit: 3751.05, rate: 0.15, deduction: 394.16 },
  { limit: 4664.68, rate: 0.225, deduction: 675.49 },
  { limit: Infinity, rate: 0.275, deduction: 908.73 }
];
const cents = (value: number) => Math.round((value + Number.EPSILON * Math.max(1, Math.abs(value))) * 100) / 100;
export function calculateINSS(salary: number): number {
  if (!Number.isFinite(salary) || salary <= 0) return 0;
  let total = 0;
  let previous = 0;
  for (const { limit, rate } of INSS_BRACKETS_2026) {
    total += Math.max(0, Math.min(salary, limit) - previous) * rate;
    previous = limit;
  }
  return cents(total);
}
/** grossIncome is BEFORE INSS: simplified deduction replaces all legal deductions. */
export function calculateIRRFDetails(grossIncome: number, dependents = 0, inss = calculateINSS(grossIncome), otherLegalDeductions = 0) {
  const gross = Number.isFinite(grossIncome) ? Math.max(0, grossIncome) : 0;
  const legalDeductions = (Number.isFinite(inss) ? Math.max(0, inss) : 0) + (Number.isFinite(dependents) ? Math.max(0, Math.floor(dependents)) : 0) * DEDUCTION_PER_DEPENDENT + (Number.isFinite(otherLegalDeductions) ? Math.max(0, otherLegalDeductions) : 0);
  const isSimplified = legalDeductions < SIMPLIFIED_IRRF_DISCOUNT;
  const base = Math.max(0, gross - Math.max(legalDeductions, SIMPLIFIED_IRRF_DISCOUNT));
  const bracket = IRRF_BRACKETS_2026.find(b => base <= b.limit)!;
  const beforeReduction = cents(Math.max(0, base * bracket.rate - bracket.deduction));
  const reduction = gross <= 5000 ? Math.min(beforeReduction, 312.89)
    : gross <= 7350 ? Math.min(beforeReduction, cents(Math.max(0, 978.62 - 0.133145 * gross))) : 0;
  return { base, isSimplified, rate: bracket.rate, deduction: bracket.deduction, beforeReduction, reduction, tax: cents(Math.max(0, beforeReduction - reduction)) };
}
export function calculateIRRF(grossIncome: number, dependents = 0, inss = calculateINSS(grossIncome), otherLegalDeductions = 0): number {
  return calculateIRRFDetails(grossIncome, dependents, inss, otherLegalDeductions).tax;
}
/** MTE table effective 11 January 2026. Amount only; eligibility is separate. */
export function calculateSeguroDesemprego(averageSalary: number): number {
  if (!Number.isFinite(averageSalary) || averageSalary <= 0) return 0;
  const amount = averageSalary <= 2222.17 ? averageSalary * 0.8
    : averageSalary <= 3703.99 ? 1777.74 + (averageSalary - 2222.17) * 0.5 : 2518.65;
  return cents(Math.max(MINIMUM_WAGE_2026, Math.min(2518.65, amount)));
}

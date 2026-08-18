/**
 * Tabelas Fiscais Oficiais e Cálculos Tributários Brasileiros CLT 2026
 * INSS (Portaria Interministerial MPS/MF) e IRRF (Lei nº 14.663/2023 e atualizações)
 */

export const MINIMUM_WAGE_2026 = 1518.00;

// Faixas progressivas INSS 2026
export const INSS_BRACKETS_2026 = [
  { limit: 1518.00, rate: 0.075 },
  { limit: 2793.88, rate: 0.09 },
  { limit: 4190.83, rate: 0.12 },
  { limit: 8157.41, rate: 0.14 }
];

export const INSS_CEILING_2026 = 8157.41;
export const DEDUCTION_PER_DEPENDENT = 189.59;
export const SIMPLIFIED_IRRF_DISCOUNT = 607.20; // 25% do teto da 1ª faixa de isenção

// Faixas progressivas IRRF 2026
export const IRRF_BRACKETS_2026 = [
  { limit: 2428.80, rate: 0, deduction: 0 },
  { limit: 3042.94, rate: 0.075, deduction: 182.16 },
  { limit: 4057.49, rate: 0.15, deduction: 410.38 },
  { limit: 5071.99, rate: 0.225, deduction: 714.69 },
  { limit: Infinity, rate: 0.275, deduction: 968.29 }
];

/**
 * Calcula o desconto progressivo de INSS
 */
export function calculateINSS(salary: number): number {
  if (salary <= 0) return 0;
  
  let inssTotal = 0;
  let previousLimit = 0;

  for (const bracket of INSS_BRACKETS_2026) {
    if (salary > bracket.limit) {
      inssTotal += (bracket.limit - previousLimit) * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      inssTotal += (salary - previousLimit) * bracket.rate;
      return Math.round(inssTotal * 100) / 100;
    }
  }

  // Teto máximo
  return 951.62;
}

/**
 * Calcula o desconto progressivo de IRRF
 */
export function calculateIRRF(taxableBaseAfterINSS: number, dependentsCount: number = 0): number {
  if (taxableBaseAfterINSS <= 0) return 0;

  // Deduções legais: dependentes
  const dependentDeduction = dependentsCount * DEDUCTION_PER_DEPENDENT;
  const legalDeductionBase = Math.max(0, taxableBaseAfterINSS - dependentDeduction);
  const simplifiedBase = Math.max(0, taxableBaseAfterINSS - SIMPLIFIED_IRRF_DISCOUNT);

  // A regra da Receita Federal aplica o modelo mais vantajoso ao contribuinte
  const calculateBracketIRRF = (base: number): number => {
    if (base <= 2428.80) return 0;

    for (const bracket of IRRF_BRACKETS_2026) {
      if (base <= bracket.limit) {
        const tax = (base * bracket.rate) - bracket.deduction;
        return Math.max(0, tax);
      }
    }
    const lastBracket = IRRF_BRACKETS_2026[IRRF_BRACKETS_2026.length - 1];
    return Math.max(0, (base * lastBracket.rate) - lastBracket.deduction);
  };

  const taxWithLegalDeductions = calculateBracketIRRF(legalDeductionBase);
  const taxWithSimplifiedDeduction = calculateBracketIRRF(simplifiedBase);

  const finalTax = Math.min(taxWithLegalDeductions, taxWithSimplifiedDeduction);
  return Math.round(finalTax * 100) / 100;
}

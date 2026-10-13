export interface LaborRow { label: string; value: number | null; formula: string; deduction?: boolean; informational?: boolean }
export const formatLaborBRL = (value: number | null) => value === null ? 'Não informado' : value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function LaborBreakdown({ rows }: { rows: LaborRow[] }) {
  return <div className="overflow-x-auto"><table className="w-full text-left text-xs sm:text-sm border-collapse">
    <caption className="sr-only">Resultado detalhado e fórmulas de cálculo</caption>
    <thead><tr className="border-b border-neutral-200 dark:border-neutral-700"><th scope="col" className="py-3">Item</th><th scope="col" className="py-3 text-right">Valor estimado</th></tr></thead>
    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">{rows.map(row => <tr key={row.label}>
      <th scope="row" className="py-3 pr-3 font-medium">{row.label}{row.informational && <span className="block text-xs text-neutral-500">Referência, já incluída na base</span>}<details className="mt-1 font-normal text-xs"><summary className="cursor-pointer underline">Como foi calculado?</summary><p className="mt-2 break-words">{row.formula}</p></details></th>
      <td className={`py-3 text-right font-mono ${row.deduction ? 'text-red-600 dark:text-red-400' : ''}`}>{row.deduction ? '− ' : ''}{formatLaborBRL(row.value)}</td>
    </tr>)}</tbody>
  </table></div>;
}

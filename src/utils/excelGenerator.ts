/**
 * Generates an Excel-compatible CSV file for timesheet management in Portuguese format
 */
export function generateTimesheetCSV(entries: Array<{
  date: string;
  start: string;
  lunchStart?: string;
  lunchEnd?: string;
  end: string;
  breakTime?: string;
  totalHours: string;
}>, title: string = 'Planilha de Registro de Ponto'): void {
  const headers = ['Data / Dia', 'Entrada', 'Saida Almoço', 'Retorno Almoço', 'Saida Final', 'Intervalo Total', 'Total Horas'];
  
  const rows = entries.map(e => [
    e.date || 'Dia sem data',
    e.start || '',
    e.lunchStart || '',
    e.lunchEnd || '',
    e.end || '',
    e.breakTime || '',
    e.totalHours || '00:00'
  ]);

  // UTF-8 BOM for Excel to open accents properly (e.g. Terça, Saída)
  let csvContent = '\uFEFF';
  const quote = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  csvContent += quote(`${title} - calculadoradehorastrabalhadas.org`) + '\r\n\r\n';
  csvContent += headers.map(h => `"${h}"`).join(';') + '\n';

  rows.forEach(row => {
    // Prefix formula-like user text to prevent spreadsheet formula injection.
    csvContent += row.map(cell => quote(/^[=+@-]/.test(cell) ? `'${cell}` : cell)).join(';') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `planilha_horas_trabalhadas_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

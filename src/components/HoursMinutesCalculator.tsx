import { useState } from 'react';
import { formatDurationSeconds, sumDurationSeconds } from '../utils/conversions';
import ToolControls from './ToolControls';

export default function HoursMinutesCalculator() {
  const [rows, setRows] = useState<{ id: number; value: string; operation: '+' | '-' }[]>([{ id: 0, value: '01:30', operation: '+' }, { id: 1, value: '00:45', operation: '+' }]);
  const [nextId, setNextId] = useState(2);
  const total = rows.length ? sumDurationSeconds(rows) : null;
  const seconds = rows.some(row => row.value.split(':').length === 3);
  const result = total === null ? null : `${formatDurationSeconds(total, seconds)}; ${Number((total / 60).toFixed(4)).toLocaleString('pt-BR')} minutos; ${(total / 3600).toFixed(4).replace('.', ',')} h decimais`;
  return <section className="tool-card">
    <p>Informe durações HH:MM ou HH:MM:SS. As horas podem ultrapassar 24.</p>
    {rows.map((row, index) => <div className="grid grid-cols-[4rem_minmax(0,1fr)_auto] gap-2 my-3" key={row.id}>
      <select aria-label={`Operação ${index + 1}`} className="tool-input" value={row.operation} onChange={event => setRows(rows.map(item => item.id === row.id ? { ...item, operation: event.target.value as '+' | '-' } : item))}><option>+</option><option>-</option></select>
      <input className="tool-input" aria-label={`Duração ${index + 1}`} placeholder="HH:MM:SS" value={row.value} onChange={event => setRows(rows.map(item => item.id === row.id ? { ...item, value: event.target.value } : item))} />
      <button className="tool-button" aria-label={`Remover linha ${index + 1}`} onClick={() => setRows(rows.filter(item => item.id !== row.id))}>×</button>
    </div>)}
    <button className="tool-button" onClick={() => { setRows([...rows, { id: nextId, value: '00:00', operation: '+' }]); setNextId(nextId + 1); }}>Adicionar linha</button>
    {result === null ? <p role="alert">Informe ao menos uma duração válida. Minutos e segundos: 00–59.</p> : <><output className="tool-result" aria-live="polite">{result}</output><details open><summary>Memória de cálculo</summary><p>{rows.map(row => `${row.operation} ${row.value}`).join(' ')} = {formatDurationSeconds(total!, seconds)}</p><p>Minutos = segundos ÷ 60. Decimal = segundos ÷ 3.600.</p></details></>}
    <ToolControls result={result} reset={() => setRows([])} />
  </section>;
}

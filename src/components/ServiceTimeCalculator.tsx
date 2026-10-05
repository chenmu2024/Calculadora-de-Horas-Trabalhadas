import { useState } from 'react';
import { serviceTime, today } from '../utils/dates';
import ToolControls from './ToolControls';

export default function ServiceTimeCalculator() {
  const [start, setStart] = useState('2021-06-23'), [end, setEnd] = useState(today);
  const duration = serviceTime(start, end);
  const result = duration ? `${duration.years} anos, ${duration.months} meses e ${duration.days} dias; total de ${duration.totalDays} dias` : null;
  return <section className="tool-card">
    <div className="grid sm:grid-cols-2 gap-4"><label>Data inicial<input className="tool-input" type="date" value={start} onInput={event => setStart(event.currentTarget.value)} /></label><label>Data final<input className="tool-input" type="date" value={end} onInput={event => setEnd(event.currentTarget.value)} /></label></div>
    {result === null ? <p role="alert">Informe datas válidas; a data final deve ser igual ou posterior à inicial.</p> : <><output className="tool-result" aria-live="polite">{result}</output><details open><summary>Memória de cálculo</summary><p>{start} → {end}: {duration!.years} anos completos, {duration!.months} meses completos e {duration!.days} dias restantes.</p><p>Diferença entre as datas: {duration!.totalDays} dias. O dia inicial não é somado; fins de mês são ajustados ao último dia disponível.</p></details></>}
    <ToolControls result={result} reset={() => { setStart(''); setEnd(''); }} />
  </section>;
}

import { useState } from 'react';
import { countBusinessDays, parseDate } from '../utils/dates';
import { getCalendarHolidays } from '../utils/holidays2026';
import ToolControls from './ToolControls';

export default function BusinessDaysCalculator() {
  const [start, setStart] = useState('2026-10-01'), [end, setEnd] = useState('2026-10-31');
  const [saturday, setSaturday] = useState(true), [sunday, setSunday] = useState(true), [national, setNational] = useState(true);
  const [stateEnabled, setStateEnabled] = useState(false), [stateDates, setStateDates] = useState(''), [customDates, setCustomDates] = useState('');
  const state = stateEnabled ? stateDates.split(/[,\s]+/).filter(Boolean) : [];
  const custom = customDates.split(/[,\s]+/).filter(Boolean);
  const validDates = [...state, ...custom].every(date => parseDate(date) !== null);
  const covered = !national || (start.startsWith('2026-') && end.startsWith('2026-'));
  const holidays = [...(national ? getCalendarHolidays() : []), ...state.map(date => ({ date, name: 'Feriado estadual informado' })), ...custom.map(date => ({ date, name: 'Feriado personalizado' }))];
  const stats = validDates && covered ? countBusinessDays(start, end, { excludeSaturday: saturday, excludeSunday: sunday, holidays }) : null;
  const result = stats ? `Dias corridos: ${stats.calendarDays}; Dias úteis: ${stats.businessDays}; Fins de semana descontados: ${stats.weekends}; Feriados descontados: ${stats.discounted.length}` : null;
  return <section className="tool-card">
    <div className="grid sm:grid-cols-2 gap-4"><label>Data inicial<input className="tool-input" type="date" value={start} onInput={event => setStart(event.currentTarget.value)} /></label><label>Data final<input className="tool-input" type="date" value={end} onInput={event => setEnd(event.currentTarget.value)} /></label></div>
    <div className="flex flex-wrap gap-4 my-4">{[
      ['Excluir sábados', saturday, setSaturday], ['Excluir domingos', sunday, setSunday], ['Feriados nacionais (calendário 2026)', national, setNational], ['Feriados estaduais', stateEnabled, setStateEnabled],
    ].map(([label, checked, setter]) => <label key={String(label)} className="flex gap-2 items-center"><input type="checkbox" checked={checked as boolean} onChange={event => (setter as (value: boolean) => void)(event.target.checked)} />{label as string}</label>)}</div>
    {stateEnabled && <label>Datas dos feriados estaduais (AAAA-MM-DD, separadas por vírgula)<textarea className="tool-input" value={stateDates} onChange={event => setStateDates(event.target.value)} /></label>}
    <label>Feriados personalizados / municipais (AAAA-MM-DD)<textarea className="tool-input" value={customDates} onChange={event => setCustomDates(event.target.value)} /></label>
    <p className="text-sm">Confirme as datas estaduais e municipais na legislação local. O calendário nacional compartilhado cobre 2026 e inclui a Sexta-feira Santa; confirme sua aplicação local. Pontos facultativos não são descontados automaticamente. Fora de 2026, desmarque o calendário e informe os feriados.</p>
    {!stats ? <p role="alert">{!covered ? 'O calendário automático cobre somente 2026.' : 'Confira as datas, a ordem do intervalo e os feriados informados. Limite: 100 anos.'}</p> : <><output className="tool-result" aria-live="polite">{result}</output><details open><summary>Memória de cálculo</summary><p>{stats.calendarDays} − {stats.weekends} − {stats.discounted.length} = {stats.businessDays} dias úteis. Inclui data inicial e final; nenhum dia é descontado duas vezes.</p><ul>{stats.discounted.map(holiday => <li key={holiday.date}>{holiday.date}: {holiday.name}</li>)}</ul>{stats.discounted.length === 0 && <p>Nenhum feriado descontado.</p>}</details></>}
    <ToolControls result={result} reset={() => { setStart(''); setEnd(''); setStateDates(''); setCustomDates(''); }} />
  </section>;
}

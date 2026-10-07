import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateDuration, calculateFourPunches } from '../src/utils/time';
import { hoursToDecimal, decimalToMinutes, sumDurationSeconds, formatDurationSeconds, bankBalance, hourlyRateForDivisor } from '../src/utils/conversions';
import { serviceTime, countBusinessDays, parseDate } from '../src/utils/dates';
import { getCalendarHolidays, getMonthWorkStats, getCalendarHolidaysForRange, getHolidaysForYear } from '../src/utils/holidays2026';
import { TAB_ROUTES, PATH_TO_TAB } from '../src/utils/routes';
import { PAGE_META } from '../src/components/SEOHead';
import { buildStructuredData } from '../src/utils/structuredData';
import StaticPageContent from '../src/components/StaticPageContent';
import HourCounterCalculator from '../src/components/HourCounterCalculator';
import DecimalHoursCalculator from '../src/components/DecimalHoursCalculator';
import BusinessDaysCalculator from '../src/components/BusinessDaysCalculator';
import ServiceTimeCalculator from '../src/components/ServiceTimeCalculator';
import HoursMinutesCalculator from '../src/components/HoursMinutesCalculator';

test('clock counter and four punches cross midnight without inventing extra days', () => {
  assert.equal(calculateDuration('08:25', '17:46'), 561);
  assert.equal(calculateDuration('23:00', '05:30'), 390);
  assert.equal(calculateDuration('08:25', '08:25'), 0);
  assert.deepEqual(calculateFourPunches(['22:00','02:00','03:00','06:30']), {worked:450,rest:60});
  assert.deepEqual(calculateFourPunches(['08:00','12:00','13:00','17:30']), {worked:510,rest:60});
  assert.equal(calculateFourPunches(['08:00','07:00','13:00','17:30']), null);
});
test('decimal conversion accepts both separators and rejects malformed values', () => {
  assert.equal(hoursToDecimal('08:30'), 8.5);
  assert.equal(hoursToDecimal('07:15'), 7.25);
  assert.equal(decimalToMinutes('7,25'), 435);
  assert.equal(decimalToMinutes('7.25'), 435);
  assert.equal(decimalToMinutes('0.999'), 60);
  for (const invalid of ['', '-2','Infinity','1,2,3','abc']) assert.equal(decimalToMinutes(invalid), null);
  assert.equal(hoursToDecimal('08:60'), null);
  assert.equal(hoursToDecimal(''), null);
});
test('duration arithmetic handles seconds, negative balances and more than 24h', () => {
  assert.equal(sumDurationSeconds([{value:'30:00',operation:'+'},{value:'01:15',operation:'-'}]), 103500);
  assert.equal(formatDurationSeconds(-4500), '-01:15');
  assert.equal(formatDurationSeconds(75,true), '00:01:15');
  assert.equal(sumDurationSeconds([{value:'00:00:60',operation:'+'}]), null);
  assert.equal(bankBalance(2535,2400),135);
  assert.equal(bankBalance(2310,2400),-90);
  assert.equal(bankBalance(NaN,2400),null);
});
test('service dates use real leap days and clamp month ends', () => {
  assert.equal(parseDate('2026-02-29'),null);
  assert.deepEqual(serviceTime('2021-06-23','2026-10-05'),{years:5,months:3,days:12,totalDays:1930});
  assert.deepEqual(serviceTime('2024-01-31','2024-02-29'),{years:0,months:1,days:0,totalDays:29});
  assert.deepEqual(serviceTime('2024-02-29','2025-02-28'),{years:1,months:0,days:0,totalDays:365});
  assert.equal(serviceTime('2026-10-05','2026-10-04'),null);
  assert.equal(serviceTime('','2026-10-05'),null);
  assert.equal(serviceTime('2026-10-05','2026-10-05')!.totalDays,0);
});
test('business days count endpoints once and share the modal calendar', () => {
  const options={excludeSaturday:true,excludeSunday:true,holidays:getCalendarHolidays()};
  assert.equal(countBusinessDays('2026-01-01','2026-01-02',options)!.businessDays,1);
  const overlap=countBusinessDays('2026-11-15','2026-11-15',options)!;
  assert.equal(overlap.weekends,1); assert.equal(overlap.discounted.length,0); assert.equal(overlap.businessDays,0);
  assert.equal(countBusinessDays('2024-02-28','2024-03-01',{...options,holidays:[]})!.calendarDays,3);
  assert.equal(countBusinessDays('2026-12-31','2027-01-01',{...options,holidays:[]})!.calendarDays,2);
  assert.equal(countBusinessDays('2026-01-02','2026-01-01',options),null);
  assert.equal(countBusinessDays('2026-02-30','2026-03-01',options),null);
  for(let month=0;month<12;month++) {
    const start=`2026-${String(month+1).padStart(2,'0')}-01`;
    const end=`2026-${String(month+1).padStart(2,'0')}-${new Date(2026,month+1,0).getDate()}`;
    assert.equal(countBusinessDays(start,end,options)!.businessDays,getMonthWorkStats(2026,month,false).workingDays);
  }
  const duplicate=countBusinessDays('2026-10-05','2026-10-05',{...options,holidays:[{date:'2026-10-05',name:'A'},{date:'2026-10-05',name:'B'}]})!;
  assert.equal(duplicate.discounted.length,1);
});
test('new routes have independent initial content, tools, schema and no invented rating', () => {
  for(const tab of ['counter','decimal','business','service','minutes']) {
    assert.equal(PATH_TO_TAB[TAB_ROUTES[tab]],tab);
    assert.equal(PAGE_META[tab].canonical,'https://calculadoradehorastrabalhadas.org'+TAB_ROUTES[tab]);
    const html=renderToStaticMarkup(<StaticPageContent tab={tab}/>);
    assert.ok(html.includes('Como é calculado'));
    assert.equal((html.match(/<details>/g)??[]).length,4);
    const graph=buildStructuredData(tab,PAGE_META[tab])['@graph'];
    assert.ok(graph.some(node=>node['@type']==='WebApplication'));
    assert.ok(graph.some(node=>node['@type']==='BreadcrumbList'));
    assert.ok(!graph.some(node=>['Review','AggregateRating'].includes(String(node['@type']))));
  }
  for(const Component of [HourCounterCalculator,DecimalHoursCalculator,BusinessDaysCalculator,ServiceTimeCalculator,HoursMinutesCalculator]) {
    const html=renderToStaticMarkup(<Component/>);
    assert.ok(html.includes('Memória de cálculo')); assert.ok(html.includes('<output'));
  }
  assert.equal(PATH_TO_TAB['/calculadora-de-horas-trabalhadas'],undefined);
  assert.equal(PATH_TO_TAB['/somar-horas'],undefined);
  assert.equal(PATH_TO_TAB['/hora-extra'],undefined);
});

test('hourly wage rejects invalid divisors instead of producing Infinity or NaN', () => {
  assert.equal(hourlyRateForDivisor(3300, 220), 15);
  assert.equal(hourlyRateForDivisor(3300, 0), null);
  assert.equal(hourlyRateForDivisor(3300, NaN), null);
  assert.equal(hourlyRateForDivisor(-1, 220), null);
});
test('2027 projected national calendar covers Easter and year boundaries', () => {
  const holidays = getHolidaysForYear(2027);
  assert.ok(holidays.some(holiday => holiday.date === '2027-03-26' && holiday.type === 'nacional'));
  assert.ok(holidays.some(holiday => holiday.date === '2027-05-27' && holiday.type === 'facultativo'));
  const combined = getCalendarHolidaysForRange(2026, 2027);
  assert.ok(combined.some(holiday => holiday.date === '2026-04-03'));
  assert.ok(combined.some(holiday => holiday.date === '2027-03-26'));
  assert.ok(!combined.some(holiday => holiday.date === '2027-05-27'));
  assert.equal(countBusinessDays('2027-03-25', '2027-03-29', {excludeSaturday:true,excludeSunday:true,holidays:combined})?.businessDays, 2);
  assert.ok(getMonthWorkStats(2027, 2, false).monthHolidays.some(holiday => holiday.day === 26));
});

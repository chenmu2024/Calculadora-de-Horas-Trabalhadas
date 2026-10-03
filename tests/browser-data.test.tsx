import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { calculateINSS } from '../src/utils/taxCalculations';
import { clearHistory, readHistory, saveToHistory } from '../src/utils/history';
import { storage, copyText } from '../src/utils/browser';
import { isValidTimesheet } from '../src/components/TimesheetCalculator';
import DailyCalculator from '../src/components/DailyCalculator';
import CLTAlertBanner from '../src/components/CLTAlertBanner';
import { PAGE_META } from '../src/components/SEOHead';
import { PAGE_H1_TITLES } from '../src/App';
import { buildWorkbook } from '../src/utils/workbook';
import { generateTimesheetCSV } from '../src/utils/excelGenerator';

const data = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value), removeItem: (key: string) => data.delete(key) } });
test('saved records and legacy records appear and clear together', () => {
  data.clear();
  data.set('user_calc_history', JSON.stringify([{ id: 'old', date: '2026', toolTab: 'daily', toolName: 'Diária', summary: '08:00', mainValue: '08:00' }]));
  assert.equal(saveToHistory({ toolTab: 'decimo', toolName: '13º', summary: 'R$ 100', mainValue: '100' }), true);
  assert.equal(readHistory().length, 2);
  assert.equal(readHistory()[0].toolTab, 'decimo');
  assert.equal(clearHistory(), true);
  assert.equal(readHistory().length, 0);
  data.set('calc_history', '[null,{},"x"]');
  assert.deepEqual(readHistory(), []);
});
test('default daily has real lunch, invalid daily does not show 28h', () => {
  data.clear();
  const html = renderToStaticMarkup(<DailyCalculator />);
  assert.ok(html.includes('09:00'));
  assert.ok(!html.includes('O intervalo atual é de 0 min'));
  data.set('calc_daily_out1', '07:00');
  const invalid = renderToStaticMarkup(<DailyCalculator />);
  assert.ok(!invalid.includes('28:00'));
  data.clear();
});
test('unknown break is not falsely treated as zero break', () => {
  assert.ok(!renderToStaticMarkup(<CLTAlertBanner totalMinutes={540} />).includes('Intervalo Intrajornada Insuficiente'));
  assert.ok(renderToStaticMarkup(<CLTAlertBanner totalMinutes={540} breakMinutes={0} />).includes('Intervalo Intrajornada Insuficiente'));
});
test('backup schema blocks malformed rows and duplicate IDs', () => {
  assert.equal(isValidTimesheet([null]), false);
  assert.equal(isValidTimesheet({ rows: [] }), false);
  const row = { id: '1', date: 'Dia', start: '22:00', end: '06:00', breakTime: '01:00' };
  assert.equal(isValidTimesheet([row]), true);
  assert.equal(isValidTimesheet([row, row]), false);
  assert.equal(isValidTimesheet([{ ...row, breakTime: '10:00' }]), false);
});
test('SEO title, description, canonical, H1 and keyword snapshot is unchanged', () => {
  const fixture = JSON.parse(readFileSync('tests/fixtures/seo.json', 'utf8'));
  assert.equal(JSON.stringify(PAGE_META), JSON.stringify(runInNewContext('(' + fixture.metadata + ')')));
  // Objects from a different VM have different prototypes.
  assert.equal(JSON.stringify(PAGE_H1_TITLES), JSON.stringify(runInNewContext('(' + fixture.h1 + ')')));
  assert.deepEqual([...readFileSync('src/components/BlogSection.tsx', 'utf8').matchAll(/keywords: (\[[^\]]+\])/g)].map(match => match[1]), fixture.articleKeywords);
  assert.ok(readFileSync('index.html', 'utf8').includes(`name="keywords" content="${fixture.keywords}"`));
});
test('storage denied and clipboard denied return failure without crashing', async () => {
  const original = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('denied'); } });
  assert.equal(storage.getItem('key'), null);
  assert.equal(storage.setItem('key', 'value'), false);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: original });
  const originalNavigator = globalThis.navigator;
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: () => Promise.reject(new Error('denied')) } } });
  assert.equal(await copyText('hello'), false);
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
});
test('CSV escapes quotes, blocks formulas, never invents missing punches', async () => {
  let blob: Blob;
  const create = URL.createObjectURL;
  URL.createObjectURL = (value: Blob) => { blob = value; return 'blob:test'; };
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { createElement: () => ({ setAttribute() {}, click() {} }), body: { appendChild() {}, removeChild() {} } } });
  generateTimesheetCSV([{ date: 'Day "A"', start: '09:00', end: '17:00', breakTime: '00:30', totalHours: '07:30' }]);
  const csv = await blob!.text();
  assert.ok(csv.includes('"Day ""A"""'));
  assert.ok(!csv.includes('12:00'));
  generateTimesheetCSV([{ date: '=1+1', start: '', end: '', totalHours: '' }]);
  assert.ok((await blob!.text()).includes("'=1+1"));
  URL.createObjectURL = create;
  delete (globalThis as any).document;
});
test('Excel workbook is a valid ZIP with formula cells and cached values', () => {
  const bytes = buildWorkbook([{ date: 'Dia', start: '08:00', end: '18:00', breakTime: '01:00', totalHours: '09:00' }]);
  assert.equal(new DataView(bytes.buffer).getUint32(0, true), 0x04034b50);
  const text = new TextDecoder().decode(bytes);
  assert.ok(text.includes('MOD(E2-B2,1)-F2'));
  assert.ok(text.includes('<c r="G2" s="1"><f>'));
  writeFileSync('../verified-workbook.xlsx', bytes);
});

test('night workbook deducts lunch and includes fictitious hours and premium formulas', () => {
  const bytes = buildWorkbook([{ date: 'Night', start: '22:00', end: '06:00', lunchStart: '02:00', lunchEnd: '03:00', breakTime: '01:00', totalHours: '07:00' }], 25, true);
  const xml = new TextDecoder().decode(bytes);
  assert.ok(xml.includes('<c r="K2" s="2"><f>'));
  assert.ok(xml.includes('<v>6.857142857142857</v>'));
  assert.ok(xml.includes('<c r="N2" s="2"><v>0.2</v>'));
  writeFileSync('../verified-night-workbook.xlsx', bytes);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { terminationDates } from '../src/utils/termination';
test('notice projection crosses calendar years and keeps 13th salary separated', () => {
  const r = terminationDates('2020-01-01', '2026-12-20', '2026-01-01', '2026-01-01', true);
  assert.equal(r.notice, 48);
  assert.equal(r.projected, '2027-02-06');
  assert.deepEqual(r.byYear, { '2026': 12, '2027': 1 });
  assert.equal(r.simple, 1);
  assert.equal(r.avos, 1);
});
test('15-day threshold, notice cap, and no projection when worked/resigned', () => {
  assert.equal(terminationDates('2026-01-01','2026-01-14','2026-01-01','2026-01-01',false).byYear['2026'], undefined);
  assert.equal(terminationDates('2026-01-01','2026-01-15','2026-01-01','2026-01-01',false).byYear['2026'], 1);
  const r = terminationDates('2000-01-01','2026-03-01','2026-01-01','2026-01-01',true);
  assert.equal(r.notice,90);
});
test('multiple unpaid vacation periods classify simple and doubled with constitutional third outside helper', () => {
  const r = terminationDates('2020-01-01','2026-01-01','2026-01-01','2023-01-01',false);
  assert.equal(r.simple,1); assert.equal(r.doubled,2); assert.equal(r.avos,0);
});
test('leap dates clamp anniversaries and invalid or reversed dates are rejected', () => {
  assert.equal(terminationDates('2024-02-29','2025-02-28','2025-02-01','2024-02-29',false).years,1);
  assert.throws(() => terminationDates('2026-02-30','2026-03-01','2026-01-01','2026-01-01',true));
  assert.throws(() => terminationDates('2026-04-01','2026-03-01','2026-01-01','2026-01-01',true));
});

test('mutual agreement uses explicitly confirmed projection days and rejects missing days', () => {
  assert.equal(terminationDates('2020-01-01','2026-12-20','2026-01-01','2026-01-01',15).projected,'2027-01-04');
  assert.throws(() => terminationDates('2020-01-01','2026-12-20','2026-01-01','2026-01-01',NaN));
});

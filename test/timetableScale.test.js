import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timetableRange, layoutDay } from '../src/domain/timetableScale.js';

test('keeps the default hours and extends to cover earlier and later classes', () => {
  assert.deepEqual(timetableRange([]), { start: 540, end: 960 });
  assert.deepEqual(timetableRange([{ start_time: '08:30:00', end_time: '17:20:00' }]), { start: 480, end: 1080 });
  assert.deepEqual(timetableRange([{ start_time: '10:00:00', end_time: '15:30:00' }]), { start: 540, end: 960 });
});

test('places overlapping classes in separate lanes', () => {
  const blocks = [
    { slot: { start_time: '09:00:00', end_time: '10:30:00' } },
    { slot: { start_time: '10:00:00', end_time: '11:00:00' } },
  ];
  const result = layoutDay(blocks);
  assert.deepEqual(result.map(({ lane, lanes }) => [lane, lanes]), [[0, 2], [1, 2]]);
});

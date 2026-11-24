import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupTimetableRows } from '../src/domain/timetableMapper.js';

test('groups multiple slots and keeps courses with no slot', () => {
  const base = { offering_id: 1, course_code: '01022', section_code: '01', course_name: '강좌' };
  const result = groupTimetableRows([
    { ...base, slot_id: 10, weekday: 1, start_time: '09:00:00', end_time: '10:00:00' },
    { ...base, slot_id: 11, weekday: 3, start_time: '09:00:00', end_time: '10:00:00' },
    { ...base, offering_id: 2, section_code: '02', slot_id: null },
  ]);
  assert.equal(result.length, 2);
  assert.equal(result[0].offering_id, '1');
  assert.equal(result[0].course_code, '01022');
  assert.equal(result[0].section_code, '01');
  assert.equal(result[0].slots.length, 2);
  assert.deepEqual(result[1].slots, []);
});

export function toMinutes(time) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function timetableRange(slots) {
  const starts = slots.map((slot) => toMinutes(slot.start_time));
  const ends = slots.map((slot) => toMinutes(slot.end_time));
  return {
    start: Math.floor(Math.min(9 * 60, ...starts) / 60) * 60,
    end: Math.ceil(Math.max(16 * 60, ...ends) / 60) * 60,
  };
}

export function layoutDay(slots) {
  const sorted = slots.map((block) => ({ ...block, start: toMinutes(block.slot.start_time), end: toMinutes(block.slot.end_time) }))
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const groups = [];
  for (const block of sorted) {
    let group = groups.at(-1);
    if (!group || block.start >= group.end) {
      group = { end: block.end, blocks: [], lanes: [] };
      groups.push(group);
    }
    let lane = group.lanes.findIndex((end) => end <= block.start);
    if (lane === -1) lane = group.lanes.length;
    group.lanes[lane] = block.end;
    group.end = Math.max(group.end, block.end);
    group.blocks.push({ ...block, lane });
  }
  return groups.flatMap((group) => group.blocks.map((block) => ({ ...block, lanes: group.lanes.length })));
}

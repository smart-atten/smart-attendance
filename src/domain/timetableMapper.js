export function groupTimetableRows(rows) {
  const courses = new Map();
  for (const row of rows) {
    const id = String(row.offering_id);
    if (!courses.has(id)) {
      courses.set(id, {
        offering_id: id,
        course_code: row.course_code,
        course_name: row.course_name,
        academic_year: row.academic_year,
        term_code: row.term_code,
        section_code: row.section_code,
        instructor_name: row.instructor_name,
        delivery_type: row.delivery_type,
        slots: [],
      });
    }
    if (row.slot_id != null) {
      courses.get(id).slots.push({
        slot_id: String(row.slot_id),
        weekday: row.weekday,
        start_time: row.start_time,
        end_time: row.end_time,
        room: row.room,
      });
    }
  }
  return [...courses.values()];
}

// 서버 응답(camelCase 정식 API / snake_case 개발용 API)을 프론트 도메인 규격(snake_case)으로 변환합니다.
// BIGINT ID는 정밀도 유지를 위해 항상 string으로 바꿉니다.

const pick = (row, snake, camel) => row[snake] ?? row[camel];
const toId = (value) => (value == null ? null : String(value));

/** @returns {import('./user.js').User} */
export function toUser(row) {
  return {
    user_id: toId(pick(row, 'user_id', 'userId')),
    student_no: pick(row, 'student_no', 'studentNo') ?? null,
    display_name: pick(row, 'display_name', 'displayName') ?? '',
    role: row.role ?? 'STUDENT',
    push_enabled: Boolean(pick(row, 'push_enabled', 'pushEnabled')),
  };
}

/** @returns {import('./attendance.js').SessionAttendance} */
export function toSessionAttendance(row) {
  return {
    session_id: toId(pick(row, 'session_id', 'sessionId')),
    offering_id: toId(pick(row, 'offering_id', 'offeringId')),
    course_name: pick(row, 'course_name', 'courseName'),
    session_date: pick(row, 'session_date', 'sessionDate'),
    week_no: Number(pick(row, 'week_no', 'weekNo')),
    starts_at: pick(row, 'starts_at', 'startsAt'),
    ends_at: pick(row, 'ends_at', 'endsAt'),
    checkin_open_at: pick(row, 'checkin_open_at', 'checkinOpenAt'),
    checkin_close_at: pick(row, 'checkin_close_at', 'checkinCloseAt'),
    status: row.status ?? null,
  };
}

/** 정식 API의 Course(camelCase, slots 포함)를 CourseSchedule로 변환합니다. */
export function toCourseSchedule(row) {
  return {
    offering_id: toId(pick(row, 'offering_id', 'offeringId')),
    course_code: pick(row, 'course_code', 'courseCode'),
    course_name: pick(row, 'course_name', 'courseName'),
    academic_year: pick(row, 'academic_year', 'academicYear'),
    term_code: pick(row, 'term_code', 'termCode'),
    section_code: pick(row, 'section_code', 'sectionCode'),
    instructor_name: pick(row, 'instructor_name', 'instructorName') ?? null,
    delivery_type: pick(row, 'delivery_type', 'deliveryType'),
    slots: (row.slots ?? []).map((slot) => ({
      slot_id: toId(pick(slot, 'slot_id', 'slotId')),
      weekday: slot.weekday,
      start_time: pick(slot, 'start_time', 'startTime'),
      end_time: pick(slot, 'end_time', 'endTime'),
      room: slot.room,
    })),
  };
}

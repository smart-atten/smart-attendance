package kr.ac.bu.attendance;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
class StudentDataRepository {
    private final JdbcTemplate db;
    StudentDataRepository(JdbcTemplate db) { this.db = db; }

    Optional<Long> findStudentId(String studentNo) {
        return db.query("SELECT user_id FROM users WHERE student_no = ? AND role = 'STUDENT'",
                (rs, row) -> rs.getLong("user_id"), studentNo).stream().findFirst();
    }

    Optional<Map<String, Object>> findStudent(long userId) {
        return db.queryForList("SELECT user_id, student_no, display_name, role, push_enabled FROM users WHERE user_id = ? AND role = 'STUDENT'", userId).stream().findFirst();
    }

    int updatePushEnabled(long userId, boolean enabled) {
        return db.update("UPDATE users SET push_enabled = ? WHERE user_id = ? AND role = 'STUDENT'", enabled, userId);
    }

    List<Map<String, Object>> findTimetable(long userId, int year, String term) {
        return db.queryForList("""
            SELECT o.offering_id, c.course_code, c.course_name, o.academic_year, o.term_code,
                   o.section_code, o.instructor_name, o.delivery_type, s.slot_id, s.weekday,
                   s.start_time, s.end_time, s.room
              FROM enrollments e JOIN course_offerings o ON o.offering_id = e.offering_id
              JOIN courses c ON c.course_id = o.course_id
              LEFT JOIN schedule_slots s ON s.offering_id = o.offering_id
             WHERE e.user_id = ? AND o.academic_year = ? AND o.term_code = ?
             ORDER BY s.weekday, s.start_time, c.course_name
            """, userId, year, term);
    }

    List<Map<String, Object>> findAttendance(long userId, Long offeringId) {
        return db.queryForList("""
            SELECT s.session_id, s.offering_id, c.course_name, s.session_date, s.week_no,
                   s.starts_at, s.ends_at, s.checkin_open_at, s.checkin_close_at,
                   COALESCE(a.status, 'PENDING') AS status
              FROM enrollments e JOIN course_offerings o ON o.offering_id = e.offering_id
              JOIN courses c ON c.course_id = o.course_id
              JOIN class_sessions s ON s.offering_id = o.offering_id
              LEFT JOIN attendance_records a ON a.enrollment_id = e.enrollment_id AND a.session_id = s.session_id
             WHERE e.user_id = ? AND (? IS NULL OR o.offering_id = ?)
             ORDER BY s.starts_at
            """, userId, offeringId, offeringId);
    }
}

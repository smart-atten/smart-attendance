package kr.ac.bu.attendance;

import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Profile("dev")
@RequestMapping("/api/dev/students")
class DevelopmentTimetableController {
    private final JdbcTemplate db;
    private final TimetableService service;
    DevelopmentTimetableController(JdbcTemplate db, TimetableService service) { this.db = db; this.service = service; }

    @GetMapping("/{studentNo}/attendance")
    List<Map<String, Object>> attendance(@PathVariable String studentNo,
            @RequestParam(required = false) Long offeringId) {
        return service.getDevelopmentAttendance(studentNo, offeringId);
    }

    @GetMapping("/{studentNo}")
    Map<String, Object> student(@PathVariable String studentNo) {
        var users = db.queryForList("SELECT student_no, display_name FROM users WHERE student_no = ? AND role = 'STUDENT'", studentNo);
        if (users.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        return users.get(0);
    }

    @GetMapping("/{studentNo}/timetable")
    List<Map<String, Object>> timetable(@PathVariable String studentNo,
            @RequestParam int year, @RequestParam String term) {
        return db.queryForList("""
            SELECT o.offering_id, c.course_code, c.course_name, o.academic_year,
                   o.term_code, o.section_code, o.instructor_name, o.delivery_type,
                   s.slot_id, s.weekday, s.start_time, s.end_time, s.room
              FROM users u JOIN enrollments e ON e.user_id = u.user_id
              JOIN course_offerings o ON o.offering_id = e.offering_id
              JOIN courses c ON c.course_id = o.course_id
              LEFT JOIN schedule_slots s ON s.offering_id = o.offering_id
             WHERE u.student_no = ? AND o.academic_year = ? AND o.term_code = ?
             ORDER BY s.weekday, s.start_time, c.course_name
            """, studentNo, year, term);
    }
}

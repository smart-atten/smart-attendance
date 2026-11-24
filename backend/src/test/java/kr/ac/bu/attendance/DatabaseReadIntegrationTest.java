package kr.ac.bu.attendance;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@EnabledIfEnvironmentVariable(named = "RUN_DB_READ_TESTS", matches = "true")
class DatabaseReadIntegrationTest {
    @Autowired JdbcTemplate db;
    @Autowired StudentDataRepository students;
    @Autowired PostRepository posts;
    @Autowired NotificationRepository notifications;

    @Test
    void readsExistingStudentAndRelatedData() {
        Long id = db.queryForObject("SELECT MIN(user_id) FROM users WHERE role = 'STUDENT'", Long.class);
        assertNotNull(id);
        assertTrue(students.findStudent(id).isPresent());
        assertNotNull(students.findTimetable(id, 2026, "2"));
        assertNotNull(students.findAttendance(id, null));
        assertNotNull(posts.findPosts(null, null, null));
        assertNotNull(notifications.findForStudent(id));
    }

    @Test
    @Transactional
    void writesAreRolledBack() {
        Long id = db.queryForObject("SELECT MIN(user_id) FROM users WHERE role = 'STUDENT'", Long.class);
        assertNotNull(id);
        assertEquals(1, students.updatePushEnabled(id, true));
        assertEquals(1, posts.createPost(id, new ApiContracts.CreatePostRequest("QNA", "integration-test", "test", false)));
        assertFalse(posts.findPosts("QNA", null, "integration-test").isEmpty());
    }
}

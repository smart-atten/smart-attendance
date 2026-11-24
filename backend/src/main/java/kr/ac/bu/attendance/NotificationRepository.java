package kr.ac.bu.attendance;

import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
class NotificationRepository {
    private final JdbcTemplate db;
    NotificationRepository(JdbcTemplate db) { this.db = db; }

    List<Map<String, Object>> findForStudent(long userId) {
        return db.queryForList("""
            SELECT n.notification_id, n.notification_type, n.title, n.body, n.created_at, r.read_at
              FROM notification_recipients r JOIN notifications n ON n.notification_id = r.notification_id
             WHERE r.user_id = ? ORDER BY n.created_at DESC, n.notification_id DESC
            """, userId);
    }
}

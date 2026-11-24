package kr.ac.bu.attendance.auth;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserCredentialsRepository {
    private final JdbcTemplate db;

    public Optional<UserCredentials> findByStudentNo(String studentNo) {
        return db.query("SELECT user_id, student_no, password_hash, role FROM users WHERE student_no = ? AND role = 'STUDENT'",
            (rs, row) -> new UserCredentials(rs.getLong("user_id"), rs.getString("student_no"),
                rs.getString("password_hash"), rs.getString("role")), studentNo).stream().findFirst();
    }

    public record UserCredentials(long userId, String studentNo, String passwordHash, String role) {}
}

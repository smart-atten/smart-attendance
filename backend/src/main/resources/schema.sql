-- Development draft based on design v1.2. Apply explicitly to an empty development DB.
CREATE TABLE users (
 user_id BIGINT AUTO_INCREMENT PRIMARY KEY, login_id VARCHAR(50) UNIQUE,
 student_no VARCHAR(20) UNIQUE, password_hash VARCHAR(255) NOT NULL,
 display_name VARCHAR(80) NOT NULL, role VARCHAR(10) NOT NULL CHECK (role IN ('STUDENT','ADMIN')),
 push_enabled BOOLEAN NOT NULL DEFAULT FALSE, push_endpoint TEXT, push_p256dh VARCHAR(255), push_auth VARCHAR(255),
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
CREATE TABLE courses (
 course_id BIGINT AUTO_INCREMENT PRIMARY KEY, course_code VARCHAR(30) NOT NULL UNIQUE, course_name VARCHAR(120) NOT NULL
);
CREATE TABLE course_offerings (
 offering_id BIGINT AUTO_INCREMENT PRIMARY KEY, course_id BIGINT NOT NULL,
 academic_year SMALLINT NOT NULL, term_code VARCHAR(10) NOT NULL, section_code VARCHAR(20) NOT NULL,
 instructor_name VARCHAR(100), delivery_type VARCHAR(10) NOT NULL CHECK (delivery_type IN ('OFFLINE','CYBER')),
 FOREIGN KEY (course_id) REFERENCES courses(course_id), UNIQUE (course_id, academic_year, term_code, section_code)
);
CREATE TABLE schedule_slots (
 slot_id BIGINT AUTO_INCREMENT PRIMARY KEY, offering_id BIGINT NOT NULL,
 weekday TINYINT NOT NULL CHECK (weekday BETWEEN 1 AND 7), start_time TIME NOT NULL, end_time TIME NOT NULL,
 room VARCHAR(100), FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id), CHECK (end_time > start_time)
);
CREATE TABLE enrollments (
 enrollment_id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT NOT NULL, offering_id BIGINT NOT NULL,
 enrolled_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), FOREIGN KEY (user_id) REFERENCES users(user_id),
 FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id), UNIQUE (user_id, offering_id)
);
CREATE TABLE class_sessions (
 session_id BIGINT AUTO_INCREMENT PRIMARY KEY, offering_id BIGINT NOT NULL, session_date DATE NOT NULL,
 session_no SMALLINT NOT NULL DEFAULT 1, week_no SMALLINT NOT NULL, starts_at DATETIME(3) NOT NULL,
 ends_at DATETIME(3) NOT NULL, checkin_open_at DATETIME(3) NOT NULL, checkin_close_at DATETIME(3) NOT NULL,
 FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id), UNIQUE (offering_id, session_date, session_no)
);
CREATE TABLE attendance_records (
 attendance_id BIGINT AUTO_INCREMENT PRIMARY KEY, enrollment_id BIGINT NOT NULL, session_id BIGINT NOT NULL,
 status VARCHAR(12) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PRESENT','LATE','ABSENT')),
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 FOREIGN KEY (enrollment_id) REFERENCES enrollments(enrollment_id), FOREIGN KEY (session_id) REFERENCES class_sessions(session_id),
 UNIQUE (enrollment_id, session_id)
);
CREATE TABLE attendance_events (
 event_id BIGINT AUTO_INCREMENT PRIMARY KEY, attendance_id BIGINT NOT NULL, actor_user_id BIGINT,
 event_type VARCHAR(20) NOT NULL, outcome VARCHAR(10) NOT NULL, previous_status VARCHAR(12), new_status VARCHAR(12),
 device_info VARCHAR(255), reason VARCHAR(255), occurred_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 FOREIGN KEY (attendance_id) REFERENCES attendance_records(attendance_id), FOREIGN KEY (actor_user_id) REFERENCES users(user_id)
);
CREATE TABLE posts (
 post_id BIGINT AUTO_INCREMENT PRIMARY KEY, author_id BIGINT NOT NULL, post_type VARCHAR(10) NOT NULL,
 title VARCHAR(200) NOT NULL, body TEXT NOT NULL, is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
 is_faq BOOLEAN NOT NULL DEFAULT FALSE, answer_body TEXT, answered_by BIGINT, answered_at DATETIME(3),
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), deleted_at DATETIME(3),
 FOREIGN KEY (author_id) REFERENCES users(user_id), FOREIGN KEY (answered_by) REFERENCES users(user_id)
);
CREATE TABLE post_attachments (
 attachment_id BIGINT AUTO_INCREMENT PRIMARY KEY, post_id BIGINT NOT NULL, original_name VARCHAR(255) NOT NULL,
 storage_key VARCHAR(512) NOT NULL UNIQUE, mime_type VARCHAR(100) NOT NULL, size_bytes BIGINT NOT NULL,
 uploaded_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), FOREIGN KEY (post_id) REFERENCES posts(post_id)
);
CREATE TABLE notifications (
 notification_id BIGINT AUTO_INCREMENT PRIMARY KEY, notification_type VARCHAR(25) NOT NULL, related_post_id BIGINT,
 related_session_id BIGINT, title VARCHAR(200) NOT NULL, body TEXT NOT NULL,
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), FOREIGN KEY (related_post_id) REFERENCES posts(post_id),
 FOREIGN KEY (related_session_id) REFERENCES class_sessions(session_id)
);
CREATE TABLE notification_recipients (
 recipient_id BIGINT AUTO_INCREMENT PRIMARY KEY, notification_id BIGINT NOT NULL, user_id BIGINT NOT NULL,
 delivery_status VARCHAR(10) NOT NULL DEFAULT 'PENDING', sent_at DATETIME(3), read_at DATETIME(3), error_code VARCHAR(60),
 FOREIGN KEY (notification_id) REFERENCES notifications(notification_id), FOREIGN KEY (user_id) REFERENCES users(user_id),
 UNIQUE (notification_id, user_id)
);

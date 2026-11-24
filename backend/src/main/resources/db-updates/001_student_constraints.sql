DROP PROCEDURE IF EXISTS attendance_apply_student_constraints_001;
DELIMITER //
CREATE PROCEDURE attendance_apply_student_constraints_001()
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE role <> 'STUDENT' OR role IS NULL)
     OR EXISTS (SELECT 1 FROM class_sessions WHERE week_no < 1)
     OR EXISTS (SELECT 1 FROM attendance_events WHERE event_type NOT IN ('CHECKIN_ATTEMPT','STATUS_CHANGE') OR outcome NOT IN ('SUCCESS','FAILED'))
     OR EXISTS (SELECT 1 FROM posts WHERE post_type NOT IN ('QUESTION','NOTICE'))
     OR EXISTS (SELECT 1 FROM notifications WHERE notification_type NOT IN ('NOTICE','ATTENDANCE_START','CORRECTION_DEADLINE','SYSTEM'))
     OR EXISTS (SELECT 1 FROM notification_recipients WHERE delivery_status NOT IN ('PENDING','SENT','FAILED','SKIPPED')) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Existing data does not meet student schema constraints';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'users' AND constraint_name = 'ck_users_student_role') THEN
    ALTER TABLE users ADD CONSTRAINT ck_users_student_role CHECK (role = 'STUDENT');
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'role' AND (column_default IS NULL OR column_default <> 'STUDENT')) THEN
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'STUDENT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'class_sessions' AND constraint_name = 'ck_class_sessions_week') THEN
    ALTER TABLE class_sessions ADD CONSTRAINT ck_class_sessions_week CHECK (week_no >= 1);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'attendance_events' AND constraint_name = 'ck_attendance_events_type') THEN
    ALTER TABLE attendance_events ADD CONSTRAINT ck_attendance_events_type CHECK (event_type IN ('CHECKIN_ATTEMPT','STATUS_CHANGE'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'attendance_events' AND constraint_name = 'ck_attendance_events_outcome') THEN
    ALTER TABLE attendance_events ADD CONSTRAINT ck_attendance_events_outcome CHECK (outcome IN ('SUCCESS','FAILED'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'posts' AND constraint_name = 'ck_posts_type') THEN
    ALTER TABLE posts ADD CONSTRAINT ck_posts_type CHECK (post_type IN ('QUESTION','NOTICE'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'notifications' AND constraint_name = 'ck_notifications_type') THEN
    ALTER TABLE notifications ADD CONSTRAINT ck_notifications_type CHECK (notification_type IN ('NOTICE','ATTENDANCE_START','CORRECTION_DEADLINE','SYSTEM'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'notification_recipients' AND constraint_name = 'ck_notification_recipients_status') THEN
    ALTER TABLE notification_recipients ADD CONSTRAINT ck_notification_recipients_status CHECK (delivery_status IN ('PENDING','SENT','FAILED','SKIPPED'));
  END IF;
END//
DELIMITER ;
CALL attendance_apply_student_constraints_001();
DROP PROCEDURE attendance_apply_student_constraints_001;

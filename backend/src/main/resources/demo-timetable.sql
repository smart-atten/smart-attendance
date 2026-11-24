SET NAMES utf8mb4;

DROP PROCEDURE IF EXISTS attendance_apply_team_students_02;
DELIMITER //
CREATE PROCEDURE attendance_apply_team_students_02()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;
  IF (SELECT COUNT(*) FROM users WHERE student_no IN ('DEMO001', '20232656') AND display_name = '이은아') <> 1
     OR (SELECT COUNT(*) FROM users WHERE student_no IN ('DEMO002', '20221149') AND display_name = '김건우') <> 1
     OR (SELECT COUNT(*) FROM users WHERE student_no IN ('DEMO003', '20222267') AND display_name = '유다연') <> 1
     OR (SELECT COUNT(*) FROM users WHERE student_no IN ('DEMO004', '20221883') AND display_name = '박지연') <> 1
     OR EXISTS (SELECT 1 FROM users WHERE student_no = '20232656' AND display_name <> '이은아')
     OR EXISTS (SELECT 1 FROM users WHERE student_no = '20221149' AND display_name <> '김건우')
     OR EXISTS (SELECT 1 FROM users WHERE student_no = '20222267' AND display_name <> '유다연')
     OR EXISTS (SELECT 1 FROM users WHERE student_no = '20221883' AND display_name <> '박지연') THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student data does not match; no student numbers were changed';
  END IF;
  START TRANSACTION;
  UPDATE users SET student_no = CASE student_no
    WHEN 'DEMO001' THEN '20232656'
    WHEN 'DEMO002' THEN '20221149'
    WHEN 'DEMO003' THEN '20222267'
    WHEN 'DEMO004' THEN '20221883'
    ELSE student_no END
  WHERE student_no IN ('DEMO001','DEMO002','DEMO003','DEMO004');
  COMMIT;
END//
DELIMITER ;
CALL attendance_apply_team_students_02();
DROP PROCEDURE attendance_apply_team_students_02;

INSERT INTO courses (course_code, course_name)
SELECT source.course_code, source.course_name
FROM course_catalog_import source
WHERE (source.course_code, source.section_code) IN (('03671','01'),('03674','01'),('09571','01'),('09613','01'),('09942','01'))
ON DUPLICATE KEY UPDATE course_name = VALUES(course_name);

INSERT INTO course_offerings (course_id, academic_year, term_code, section_code, instructor_name, delivery_type)
SELECT c.course_id, 2026, '2', source.section_code, NULL, 'OFFLINE'
FROM course_catalog_import source JOIN courses c ON c.course_code = source.course_code
WHERE (source.course_code, source.section_code) IN (('03671','01'),('03674','01'),('09571','01'),('09613','01'),('09942','01'))
ON DUPLICATE KEY UPDATE offering_id = offering_id;

INSERT INTO schedule_slots (offering_id, weekday, start_time, end_time, room)
SELECT o.offering_id,
  CASE c.course_code WHEN '03671' THEN 1 WHEN '03674' THEN 2 WHEN '09571' THEN 3 WHEN '09613' THEN 4 ELSE 4 END,
  CASE c.course_code WHEN '03671' THEN '09:00:00' WHEN '03674' THEN '13:00:00' WHEN '09571' THEN '10:00:00' WHEN '09613' THEN '09:00:00' ELSE '13:00:00' END,
  CASE c.course_code WHEN '03671' THEN '10:40:00' WHEN '03674' THEN '14:40:00' WHEN '09571' THEN '11:40:00' WHEN '09613' THEN '10:40:00' ELSE '14:40:00' END,
  CASE c.course_code WHEN '03671' THEN '본부519' WHEN '03674' THEN '본부516' WHEN '09571' THEN '본부515' WHEN '09613' THEN '본부520' ELSE '본부504' END
FROM course_offerings o JOIN courses c ON c.course_id = o.course_id
WHERE o.academic_year = 2026 AND o.term_code = '2' AND o.section_code = '01'
  AND c.course_code IN ('03671','03674','09571','09613','09942')
  AND NOT EXISTS (SELECT 1 FROM schedule_slots s WHERE s.offering_id = o.offering_id);

INSERT IGNORE INTO enrollments (user_id, offering_id)
SELECT u.user_id, o.offering_id
FROM users u JOIN course_offerings o ON o.academic_year = 2026 AND o.term_code = '2' AND o.section_code = '01'
JOIN courses c ON c.course_id = o.course_id
WHERE u.role = 'STUDENT' AND (
    (u.student_no = '20232656' AND c.course_code IN ('03671','03674','09613')) OR
    (u.student_no = '20221149' AND c.course_code IN ('03674','09571','09942')) OR
    (u.student_no = '20222267' AND c.course_code IN ('03671','09571','09613')) OR
    (u.student_no = '20221883' AND c.course_code IN ('03671','03674','09571'))
);

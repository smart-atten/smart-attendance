SET NAMES utf8mb4;
INSERT INTO users (student_no,password_hash,display_name,role) VALUES
 ('DEMO001','UNUSABLE','이은아','STUDENT'), ('DEMO002','UNUSABLE','김건우','STUDENT'),
 ('DEMO003','UNUSABLE','유다연','STUDENT'), ('DEMO004','UNUSABLE','박지연','STUDENT');
INSERT INTO courses (course_code,course_name) VALUES ('01022','경영학원론');
INSERT INTO course_offerings (course_id,academic_year,term_code,section_code,instructor_name,delivery_type)
 SELECT course_id,2026,'2','01',NULL,'OFFLINE' FROM courses WHERE course_code='01022';
INSERT INTO schedule_slots (offering_id,weekday,start_time,end_time,room)
 SELECT offering_id,1,'15:00:00','16:40:00','지혜307' FROM course_offerings;
INSERT INTO enrollments (user_id,offering_id)
 SELECT u.user_id,o.offering_id FROM users u CROSS JOIN course_offerings o WHERE u.student_no = 'DEMO001';

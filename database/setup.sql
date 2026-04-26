-- Oracle SQL Plus Setup Script for School Management System
-- Run this script to initialize the database

-- Connect to your Oracle database first using SQL Plus:
-- sqlplus your_username/your_password@your_connection_string

-- Then run: @setup.sql

-- This script will:
-- 1. Create all necessary tables
-- 2. Create sequences and triggers
-- 3. Insert sample data
-- 4. Set up proper constraints and indexes

-- Start the setup
@schema.sql

-- Create additional indexes for performance
CREATE INDEX idx_students_grade ON students(grade_level);
CREATE INDEX idx_teachers_dept ON teachers(dept_id);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);

-- Create views for common queries
CREATE OR REPLACE VIEW student_details AS
SELECT s.student_id, s.first_name, s.last_name, s.grade_level, s.email, s.phone,
       u.username, s.status, s.admission_date,
       c.class_name, t.first_name || ' ' || t.last_name as class_teacher
FROM students s
JOIN users u ON s.user_id = u.user_id
LEFT JOIN enrollments e ON s.student_id = e.student_id AND e.status = 'Active'
LEFT JOIN classes c ON e.class_id = c.class_id
LEFT JOIN teachers t ON c.teacher_id = t.teacher_id
WHERE s.status = 'Active';

CREATE OR REPLACE VIEW teacher_details AS
SELECT t.teacher_id, t.first_name, t.last_name, t.email, t.phone,
       t.qualification, t.specialization, t.experience_years, t.salary,
       d.dept_name, u.username, t.status, t.hire_date
FROM teachers t
JOIN users u ON t.user_id = u.user_id
JOIN departments d ON t.dept_id = d.dept_id
WHERE t.status = 'Active';

CREATE OR REPLACE VIEW class_details AS
SELECT c.class_id, c.class_name, c.grade_level, c.section, c.room_number,
       c.capacity, t.first_name || ' ' || t.last_name as teacher_name,
       d.dept_name, c.academic_year, c.status
FROM classes c
LEFT JOIN teachers t ON c.teacher_id = t.teacher_id
LEFT JOIN departments d ON c.dept_id = d.dept_id
WHERE c.status = 'Active';

CREATE OR REPLACE VIEW attendance_summary AS
SELECT a.student_id, a.class_id, a.attendance_date,
       COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
       COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_days,
       COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_days,
       COUNT(*) as total_days
FROM attendance a
GROUP BY a.student_id, a.class_id, a.attendance_date;

CREATE OR REPLACE VIEW grade_summary AS
SELECT g.student_id, g.subject_id, g.academic_year,
       AVG(g.percentage) as average_percentage,
       COUNT(*) as total_exams,
       MAX(g.percentage) as highest_score,
       MIN(g.percentage) as lowest_score
FROM grades g
GROUP BY g.student_id, g.subject_id, g.academic_year;

-- Create stored procedures for common operations
CREATE OR REPLACE PROCEDURE add_student(
    p_username IN VARCHAR2,
    p_password IN VARCHAR2,
    p_email IN VARCHAR2,
    p_phone IN VARCHAR2,
    p_first_name IN VARCHAR2,
    p_last_name IN VARCHAR2,
    p_date_of_birth IN DATE,
    p_gender IN VARCHAR2,
    p_grade_level IN NUMBER,
    p_parent_name IN VARCHAR2,
    p_parent_phone IN VARCHAR2,
    p_parent_email IN VARCHAR2
) AS
    v_user_id NUMBER;
BEGIN
    -- Insert user record
    INSERT INTO users (username, password, role, email, phone)
    VALUES (p_username, p_password, 'student', p_email, p_phone)
    RETURNING user_id INTO v_user_id;
    
    -- Insert student record
    INSERT INTO students (
        user_id, first_name, last_name, date_of_birth, gender,
        grade_level, parent_name, parent_phone, parent_email
    ) VALUES (
        v_user_id, p_first_name, p_last_name, p_date_of_birth, p_gender,
        p_grade_level, p_parent_name, p_parent_phone, p_parent_email
    );
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Student added successfully with ID: ' || v_user_id);
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error adding student: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE mark_attendance(
    p_student_id IN NUMBER,
    p_class_id IN NUMBER,
    p_subject_id IN NUMBER,
    p_teacher_id IN NUMBER,
    p_attendance_date IN DATE,
    p_status IN VARCHAR2,
    p_remarks IN VARCHAR2 DEFAULT NULL
) AS
BEGIN
    INSERT INTO attendance (
        student_id, class_id, subject_id, teacher_id,
        attendance_date, status, remarks
    ) VALUES (
        p_student_id, p_class_id, p_subject_id, p_teacher_id,
        p_attendance_date, p_status, p_remarks
    );
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Attendance marked successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error marking attendance: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE add_grade(
    p_student_id IN NUMBER,
    p_subject_id IN NUMBER,
    p_class_id IN NUMBER,
    p_teacher_id IN NUMBER,
    p_exam_type IN VARCHAR2,
    p_exam_date IN DATE,
    p_marks_obtained IN NUMBER,
    p_total_marks IN NUMBER,
    p_academic_year IN VARCHAR2,
    p_remarks IN VARCHAR2 DEFAULT NULL
) AS
    v_percentage NUMBER;
    v_grade VARCHAR2(2);
BEGIN
    -- Calculate percentage
    v_percentage := (p_marks_obtained / p_total_marks) * 100;
    
    -- Calculate grade
    IF v_percentage >= 90 THEN
        v_grade := 'A+';
    ELSIF v_percentage >= 80 THEN
        v_grade := 'A';
    ELSIF v_percentage >= 70 THEN
        v_grade := 'B';
    ELSIF v_percentage >= 60 THEN
        v_grade := 'C';
    ELSIF v_percentage >= 50 THEN
        v_grade := 'D';
    ELSIF v_percentage >= 40 THEN
        v_grade := 'E';
    ELSE
        v_grade := 'F';
    END IF;
    
    -- Insert grade
    INSERT INTO grades (
        student_id, subject_id, class_id, teacher_id,
        exam_type, exam_date, marks_obtained, total_marks,
        grade, remarks, academic_year
    ) VALUES (
        p_student_id, p_subject_id, p_class_id, p_teacher_id,
        p_exam_type, p_exam_date, p_marks_obtained, p_total_marks,
        v_grade, p_remarks, p_academic_year
    );
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Grade added successfully: ' || v_grade || ' (' || v_percentage || '%)');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error adding grade: ' || SQLERRM);
END;
/

-- Create functions for reporting
CREATE OR REPLACE FUNCTION get_student_attendance_percentage(
    p_student_id IN NUMBER,
    p_start_date IN DATE,
    p_end_date IN DATE
) RETURN NUMBER AS
    v_total_classes NUMBER;
    v_present_classes NUMBER;
    v_percentage NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_total_classes
    FROM attendance
    WHERE student_id = p_student_id
    AND attendance_date BETWEEN p_start_date AND p_end_date;
    
    SELECT COUNT(*) INTO v_present_classes
    FROM attendance
    WHERE student_id = p_student_id
    AND status = 'Present'
    AND attendance_date BETWEEN p_start_date AND p_end_date;
    
    IF v_total_classes = 0 THEN
        RETURN 0;
    ELSE
        v_percentage := (v_present_classes / v_total_classes) * 100;
        RETURN ROUND(v_percentage, 2);
    END IF;
END;
/

CREATE OR REPLACE FUNCTION get_student_average_grade(
    p_student_id IN NUMBER,
    p_academic_year IN VARCHAR2
) RETURN NUMBER AS
    v_average NUMBER;
BEGIN
    SELECT AVG(percentage) INTO v_average
    FROM grades
    WHERE student_id = p_student_id
    AND academic_year = p_academic_year;
    
    IF v_average IS NULL THEN
        RETURN 0;
    ELSE
        RETURN ROUND(v_average, 2);
    END IF;
END;
/

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON students TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON teachers TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON classes TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON subjects TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON grades TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON attendance TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON enrollments TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON departments TO app_user;

-- Grant sequence usage
-- GRANT SELECT ON users_seq TO app_user;
-- GRANT SELECT ON students_seq TO app_user;
-- GRANT SELECT ON teachers_seq TO app_user;
-- GRANT SELECT ON classes_seq TO app_user;
-- GRANT SELECT ON subjects_seq TO app_user;
-- GRANT SELECT ON grades_seq TO app_user;
-- GRANT SELECT ON attendance_seq TO app_user;
-- GRANT SELECT ON enrollments_seq TO app_user;
-- GRANT SELECT ON departments_seq TO app_user;

-- Grant procedure execution
-- GRANT EXECUTE ON add_student TO app_user;
-- GRANT EXECUTE ON mark_attendance TO app_user;
-- GRANT EXECUTE ON add_grade TO app_user;
-- GRANT EXECUTE ON get_student_attendance_percentage TO app_user;
-- GRANT EXECUTE ON get_student_average_grade TO app_user;

COMMIT;
DBMS_OUTPUT.PUT_LINE('School Management System setup completed successfully!');
DBMS_OUTPUT.PUT_LINE('Database is ready for use with the Node.js application.');

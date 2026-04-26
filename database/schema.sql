-- School Management System Database Schema
-- Compatible with Oracle SQL Plus

-- Drop existing tables (for fresh start)
DROP TABLE enrollments CASCADE CONSTRAINTS;
DROP TABLE attendance CASCADE CONSTRAINTS;
DROP TABLE grades CASCADE CONSTRAINTS;
DROP TABLE subjects CASCADE CONSTRAINTS;
DROP TABLE classes CASCADE CONSTRAINTS;
DROP TABLE teachers CASCADE CONSTRAINTS;
DROP TABLE students CASCADE CONSTRAINTS;
DROP TABLE departments CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;

-- Users table for authentication
CREATE TABLE users (
    user_id NUMBER(10) PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    role VARCHAR2(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    email VARCHAR2(100) UNIQUE NOT NULL,
    phone VARCHAR2(20),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    is_active NUMBER(1) DEFAULT 1
);

-- Departments table
CREATE TABLE departments (
    dept_id NUMBER(10) PRIMARY KEY,
    dept_name VARCHAR2(100) NOT NULL,
    dept_code VARCHAR2(20) UNIQUE NOT NULL,
    description VARCHAR2(500),
    head_of_dept VARCHAR2(100),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Students table
CREATE TABLE students (
    student_id NUMBER(10) PRIMARY KEY,
    user_id NUMBER(10) UNIQUE,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR2(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    address VARCHAR2(200),
    city VARCHAR2(50),
    state VARCHAR2(50),
    postal_code VARCHAR2(20),
    country VARCHAR2(50),
    admission_date DATE DEFAULT SYSTIMESTAMP,
    grade_level NUMBER(2) NOT NULL,
    parent_name VARCHAR2(100),
    parent_phone VARCHAR2(20),
    parent_email VARCHAR2(100),
    emergency_contact VARCHAR2(20),
    blood_group VARCHAR2(10),
    nationality VARCHAR2(50),
    religion VARCHAR2(50),
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Graduated', 'Transferred')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Teachers table
CREATE TABLE teachers (
    teacher_id NUMBER(10) PRIMARY KEY,
    user_id NUMBER(10) UNIQUE,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR2(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    address VARCHAR2(200),
    city VARCHAR2(50),
    state VARCHAR2(50),
    postal_code VARCHAR2(20),
    country VARCHAR2(50),
    phone VARCHAR2(20),
    email VARCHAR2(100) UNIQUE NOT NULL,
    hire_date DATE DEFAULT SYSTIMESTAMP,
    qualification VARCHAR2(100),
    specialization VARCHAR2(100),
    experience_years NUMBER(3) DEFAULT 0,
    salary NUMBER(10,2),
    dept_id NUMBER(10),
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Classes table
CREATE TABLE classes (
    class_id NUMBER(10) PRIMARY KEY,
    class_name VARCHAR2(50) NOT NULL,
    grade_level NUMBER(2) NOT NULL,
    section VARCHAR2(10),
    room_number VARCHAR2(20),
    capacity NUMBER(3) DEFAULT 40,
    teacher_id NUMBER(10),
    dept_id NUMBER(10),
    academic_year VARCHAR2(20) NOT NULL,
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Subjects table
CREATE TABLE subjects (
    subject_id NUMBER(10) PRIMARY KEY,
    subject_name VARCHAR2(100) NOT NULL,
    subject_code VARCHAR2(20) UNIQUE NOT NULL,
    description VARCHAR2(500),
    credits NUMBER(3) DEFAULT 1,
    dept_id NUMBER(10),
    is_elective NUMBER(1) DEFAULT 0,
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Grades table
CREATE TABLE grades (
    grade_id NUMBER(10) PRIMARY KEY,
    student_id NUMBER(10) NOT NULL,
    subject_id NUMBER(10) NOT NULL,
    class_id NUMBER(10) NOT NULL,
    teacher_id NUMBER(10) NOT NULL,
    exam_type VARCHAR2(50) NOT NULL CHECK (exam_type IN ('Midterm', 'Final', 'Quiz', 'Assignment', 'Project')),
    exam_date DATE NOT NULL,
    marks_obtained NUMBER(5,2) NOT NULL,
    total_marks NUMBER(5,2) NOT NULL,
    percentage NUMBER(5,2) GENERATED ALWAYS AS ((marks_obtained/total_marks)*100) VIRTUAL,
    grade VARCHAR2(2),
    remarks VARCHAR2(200),
    academic_year VARCHAR2(20) NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Attendance table
CREATE TABLE attendance (
    attendance_id NUMBER(10) PRIMARY KEY,
    student_id NUMBER(10) NOT NULL,
    class_id NUMBER(10) NOT NULL,
    subject_id NUMBER(10),
    teacher_id NUMBER(10) NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR2(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    remarks VARCHAR2(200),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Enrollments table
CREATE TABLE enrollments (
    enrollment_id NUMBER(10) PRIMARY KEY,
    student_id NUMBER(10) NOT NULL,
    class_id NUMBER(10) NOT NULL,
    enrollment_date DATE DEFAULT SYSTIMESTAMP,
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Completed')),
    academic_year VARCHAR2(20) NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    UNIQUE (student_id, class_id, academic_year)
);

-- Create sequences for auto-incrementing IDs
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE departments_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE students_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE teachers_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE classes_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE subjects_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE grades_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE attendance_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE enrollments_seq START WITH 1 INCREMENT BY 1;

-- Create triggers for auto-incrementing IDs
CREATE OR REPLACE TRIGGER users_trig
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    :NEW.user_id := users_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER departments_trig
BEFORE INSERT ON departments
FOR EACH ROW
BEGIN
    :NEW.dept_id := departments_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER students_trig
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    :NEW.student_id := students_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER teachers_trig
BEFORE INSERT ON teachers
FOR EACH ROW
BEGIN
    :NEW.teacher_id := teachers_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER classes_trig
BEFORE INSERT ON classes
FOR EACH ROW
BEGIN
    :NEW.class_id := classes_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER subjects_trig
BEFORE INSERT ON subjects
FOR EACH ROW
BEGIN
    :NEW.subject_id := subjects_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER grades_trig
BEFORE INSERT ON grades
FOR EACH ROW
BEGIN
    :NEW.grade_id := grades_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER attendance_trig
BEFORE INSERT ON attendance
FOR EACH ROW
BEGIN
    :NEW.attendance_id := attendance_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER enrollments_trig
BEFORE INSERT ON enrollments
FOR EACH ROW
BEGIN
    :NEW.enrollment_id := enrollments_seq.NEXTVAL;
END;
/

-- Insert sample data
INSERT INTO departments (dept_name, dept_code, description) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Technology'),
('Mathematics', 'MATH', 'Department of Mathematical Sciences'),
('Physics', 'PHY', 'Department of Physical Sciences'),
('Chemistry', 'CHEM', 'Department of Chemical Sciences'),
('Biology', 'BIO', 'Department of Biological Sciences'),
('English', 'ENG', 'Department of English Language'),
('History', 'HIST', 'Department of Historical Studies'),
('Physical Education', 'PE', 'Department of Physical Education');

INSERT INTO users (username, password, role, email, phone) VALUES
('admin', 'admin123', 'admin', 'admin@school.edu', '1234567890'),
('john_teacher', 'teacher123', 'teacher', 'john@school.edu', '1234567891'),
('jane_teacher', 'teacher123', 'teacher', 'jane@school.edu', '1234567892'),
('student1', 'student123', 'student', 'student1@school.edu', '1234567893'),
('student2', 'student123', 'student', 'student2@school.edu', '1234567894');

INSERT INTO teachers (user_id, first_name, last_name, date_of_birth, gender, email, qualification, specialization, experience_years, salary, dept_id) VALUES
(2, 'John', 'Smith', TO_DATE('1985-05-15', 'YYYY-MM-DD'), 'Male', 'john@school.edu', 'M.Sc Computer Science', 'Software Engineering', 10, 60000, 1),
(3, 'Jane', 'Doe', TO_DATE('1988-08-20', 'YYYY-MM-DD'), 'Female', 'jane@school.edu', 'M.Sc Mathematics', 'Applied Mathematics', 8, 55000, 2);

INSERT INTO subjects (subject_name, subject_code, description, credits, dept_id) VALUES
('Computer Programming', 'CS101', 'Introduction to Computer Programming', 4, 1),
('Data Structures', 'CS102', 'Data Structures and Algorithms', 4, 1),
('Calculus', 'MATH101', 'Differential and Integral Calculus', 4, 2),
('Linear Algebra', 'MATH102', 'Linear Algebra and Matrix Theory', 3, 2),
('Physics', 'PHY101', 'General Physics', 4, 3),
('Chemistry', 'CHEM101', 'General Chemistry', 4, 4);

INSERT INTO classes (class_name, grade_level, section, room_number, teacher_id, dept_id, academic_year) VALUES
('Computer Science 101', 10, 'A', 'CS101', 1, 1, '2024-2025'),
('Mathematics 101', 10, 'A', 'MATH101', 2, 2, '2024-2025');

INSERT INTO students (user_id, first_name, last_name, date_of_birth, gender, grade_level, parent_name, parent_phone) VALUES
(4, 'Alice', 'Johnson', TO_DATE('2008-03-15', 'YYYY-MM-DD'), 'Female', 10, 'Robert Johnson', '1234567895'),
(5, 'Bob', 'Wilson', TO_DATE('2008-07-22', 'YYYY-MM-DD'), 'Male', 10, 'Mary Wilson', '1234567896');

INSERT INTO enrollments (student_id, class_id, academic_year) VALUES
(1, 1, '2024-2025'),
(2, 1, '2024-2025'),
(1, 2, '2024-2025'),
(2, 2, '2024-2025');

COMMIT;

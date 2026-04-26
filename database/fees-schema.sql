-- Student Fees Management System Database Schema
-- Compatible with Oracle SQL Plus

-- Drop existing tables (for fresh start)
DROP TABLE fee_payments CASCADE CONSTRAINTS;
DROP TABLE fee_assignments CASCADE CONSTRAINTS;
DROP TABLE fee_structures CASCADE CONSTRAINTS;
DROP TABLE fee_categories CASCADE CONSTRAINTS;
DROP TABLE fee_concessions CASCADE CONSTRAINTS;
DROP TABLE fee_receipts CASCADE CONSTRAINTS;
DROP TABLE payment_methods CASCADE CONSTRAINTS;
DROP TABLE payment_history CASCADE CONSTRAINTS;
DROP TABLE fee_reminders CASCADE CONSTRAINTS;
DROP TABLE students CASCADE CONSTRAINTS;
DROP TABLE classes CASCADE CONSTRAINTS;
DROP TABLE academic_years CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;

-- Users table for authentication
CREATE TABLE users (
    user_id NUMBER(10) PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    role VARCHAR2(20) NOT NULL CHECK (role IN ('admin', 'accountant', 'student', 'parent')),
    email VARCHAR2(100) UNIQUE NOT NULL,
    phone VARCHAR2(20),
    full_name VARCHAR2(100) NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    is_active NUMBER(1) DEFAULT 1
);

-- Academic Years table
CREATE TABLE academic_years (
    year_id NUMBER(10) PRIMARY KEY,
    year_name VARCHAR2(20) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current NUMBER(1) DEFAULT 0,
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Completed')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    class_id NUMBER(10) PRIMARY KEY,
    class_name VARCHAR2(50) NOT NULL,
    grade_level NUMBER(2) NOT NULL,
    section VARCHAR2(10),
    academic_year_id NUMBER(10) NOT NULL,
    tuition_fee NUMBER(10,2) DEFAULT 0,
    other_fee NUMBER(10,2) DEFAULT 0,
    total_fee NUMBER(10,2) GENERATED ALWAYS AS (tuition_fee + other_fee) VIRTUAL,
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(year_id)
);

-- Students table
CREATE TABLE students (
    student_id NUMBER(10) PRIMARY KEY,
    user_id NUMBER(10) UNIQUE,
    admission_number VARCHAR2(20) UNIQUE NOT NULL,
    roll_number VARCHAR2(20),
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
    email VARCHAR2(100),
    parent_name VARCHAR2(100),
    parent_phone VARCHAR2(20),
    parent_email VARCHAR2(100),
    admission_date DATE DEFAULT SYSTIMESTAMP,
    class_id NUMBER(10),
    academic_year_id NUMBER(10),
    concession_id NUMBER(10),
    total_fee NUMBER(10,2) DEFAULT 0,
    paid_amount NUMBER(10,2) DEFAULT 0,
    balance_amount NUMBER(10,2) GENERATED ALWAYS AS (total_fee - paid_amount) VIRTUAL,
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Graduated', 'Transferred')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(year_id),
    FOREIGN KEY (concession_id) REFERENCES fee_concessions(concession_id)
);

-- Fee Categories table
CREATE TABLE fee_categories (
    category_id NUMBER(10) PRIMARY KEY,
    category_name VARCHAR2(100) NOT NULL,
    category_code VARCHAR2(20) UNIQUE NOT NULL,
    description VARCHAR2(500),
    is_mandatory NUMBER(1) DEFAULT 1,
    is_recurring NUMBER(1) DEFAULT 1,
    due_day NUMBER(2) DEFAULT 1,
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Fee Structures table
CREATE TABLE fee_structures (
    structure_id NUMBER(10) PRIMARY KEY,
    structure_name VARCHAR2(100) NOT NULL,
    class_id NUMBER(10) NOT NULL,
    academic_year_id NUMBER(10) NOT NULL,
    total_annual_fee NUMBER(10,2) NOT NULL,
    description VARCHAR2(500),
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(year_id)
);

-- Fee Assignments table (links fee structures to categories)
CREATE TABLE fee_assignments (
    assignment_id NUMBER(10) PRIMARY KEY,
    structure_id NUMBER(10) NOT NULL,
    category_id NUMBER(10) NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    frequency VARCHAR2(20) NOT NULL CHECK (frequency IN ('Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time')),
    due_months VARCHAR2(100), -- Comma-separated months for payment
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (structure_id) REFERENCES fee_structures(structure_id),
    FOREIGN KEY (category_id) REFERENCES fee_categories(category_id)
);

-- Fee Concessions table
CREATE TABLE fee_concessions (
    concession_id NUMBER(10) PRIMARY KEY,
    concession_name VARCHAR2(100) NOT NULL,
    concession_type VARCHAR2(20) NOT NULL CHECK (concession_type IN ('Percentage', 'Fixed', 'Full')),
    concession_value NUMBER(10,2) NOT NULL,
    max_amount NUMBER(10,2),
    applicable_categories VARCHAR2(500), -- Comma-separated category IDs
    description VARCHAR2(500),
    status VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Payment Methods table
CREATE TABLE payment_methods (
    method_id NUMBER(10) PRIMARY KEY,
    method_name VARCHAR2(50) NOT NULL,
    method_code VARCHAR2(20) UNIQUE NOT NULL,
    description VARCHAR2(200),
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Fee Receipts table
CREATE TABLE fee_receipts (
    receipt_id NUMBER(10) PRIMARY KEY,
    receipt_number VARCHAR2(20) UNIQUE NOT NULL,
    student_id NUMBER(10) NOT NULL,
    academic_year_id NUMBER(10) NOT NULL,
    total_amount NUMBER(10,2) NOT NULL,
    paid_amount NUMBER(10,2) NOT NULL,
    discount_amount NUMBER(10,2) DEFAULT 0,
    fine_amount NUMBER(10,2) DEFAULT 0,
    payment_date DATE NOT NULL,
    payment_method_id NUMBER(10),
    transaction_id VARCHAR2(100),
    cheque_number VARCHAR2(50),
    bank_name VARCHAR2(100),
    received_by NUMBER(10) NOT NULL, -- User ID who received payment
    remarks VARCHAR2(500),
    status VARCHAR2(20) DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Cancelled', 'Refunded')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(year_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(method_id),
    FOREIGN KEY (received_by) REFERENCES users(user_id)
);

-- Fee Payments table (detailed payment breakdown)
CREATE TABLE fee_payments (
    payment_id NUMBER(10) PRIMARY KEY,
    receipt_id NUMBER(10) NOT NULL,
    assignment_id NUMBER(10) NOT NULL,
    category_id NUMBER(10) NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    paid_amount NUMBER(10,2) NOT NULL,
    discount_amount NUMBER(10,2) DEFAULT 0,
    fine_amount NUMBER(10,2) DEFAULT 0,
    for_month VARCHAR2(20), -- Month for which payment is made
    payment_date DATE NOT NULL,
    status VARCHAR2(20) DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Partial')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (receipt_id) REFERENCES fee_receipts(receipt_id),
    FOREIGN KEY (assignment_id) REFERENCES fee_assignments(assignment_id),
    FOREIGN KEY (category_id) REFERENCES fee_categories(category_id)
);

-- Payment History table (audit trail)
CREATE TABLE payment_history (
    history_id NUMBER(10) PRIMARY KEY,
    receipt_id NUMBER(10) NOT NULL,
    action_type VARCHAR2(20) NOT NULL CHECK (action_type IN ('Created', 'Updated', 'Cancelled', 'Refunded')),
    old_amount NUMBER(10,2),
    new_amount NUMBER(10,2),
    reason VARCHAR2(500),
    performed_by NUMBER(10) NOT NULL,
    action_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (receipt_id) REFERENCES fee_receipts(receipt_id),
    FOREIGN KEY (performed_by) REFERENCES users(user_id)
);

-- Fee Reminders table
CREATE TABLE fee_reminders (
    reminder_id NUMBER(10) PRIMARY KEY,
    student_id NUMBER(10) NOT NULL,
    category_id NUMBER(10),
    due_amount NUMBER(10,2) NOT NULL,
    due_date DATE NOT NULL,
    reminder_type VARCHAR2(20) NOT NULL CHECK (reminder_type IN ('SMS', 'Email', 'Both')),
    message_sent NUMBER(1) DEFAULT 0,
    sent_date TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Sent', 'Failed', 'Resolved')),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (category_id) REFERENCES fee_categories(category_id)
);

-- Create sequences for auto-incrementing IDs
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE academic_years_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE classes_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE students_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fee_categories_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fee_structures_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fee_assignments_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fee_concessions_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE payment_methods_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fee_receipts_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fee_payments_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE payment_history_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fee_reminders_seq START WITH 1 INCREMENT BY 1;

-- Create triggers for auto-incrementing IDs
CREATE OR REPLACE TRIGGER users_trig
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    :NEW.user_id := users_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER academic_years_trig
BEFORE INSERT ON academic_years
FOR EACH ROW
BEGIN
    :NEW.year_id := academic_years_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER classes_trig
BEFORE INSERT ON classes
FOR EACH ROW
BEGIN
    :NEW.class_id := classes_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER students_trig
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    :NEW.student_id := students_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER fee_categories_trig
BEFORE INSERT ON fee_categories
FOR EACH ROW
BEGIN
    :NEW.category_id := fee_categories_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER fee_structures_trig
BEFORE INSERT ON fee_structures
FOR EACH ROW
BEGIN
    :NEW.structure_id := fee_structures_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER fee_assignments_trig
BEFORE INSERT ON fee_assignments
FOR EACH ROW
BEGIN
    :NEW.assignment_id := fee_assignments_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER fee_concessions_trig
BEFORE INSERT ON fee_concessions
FOR EACH ROW
BEGIN
    :NEW.concession_id := fee_concessions_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER payment_methods_trig
BEFORE INSERT ON payment_methods
FOR EACH ROW
BEGIN
    :NEW.method_id := payment_methods_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER fee_receipts_trig
BEFORE INSERT ON fee_receipts
FOR EACH ROW
BEGIN
    :NEW.receipt_id := fee_receipts_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER fee_payments_trig
BEFORE INSERT ON fee_payments
FOR EACH ROW
BEGIN
    :NEW.payment_id := fee_payments_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER payment_history_trig
BEFORE INSERT ON payment_history
FOR EACH ROW
BEGIN
    :NEW.history_id := payment_history_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER fee_reminders_trig
BEFORE INSERT ON fee_reminders
FOR EACH ROW
BEGIN
    :NEW.reminder_id := fee_reminders_seq.NEXTVAL;
END;
/

-- Insert sample data
INSERT INTO academic_years (year_name, start_date, end_date, is_current) VALUES
('2023-2024', TO_DATE('2023-04-01', 'YYYY-MM-DD'), TO_DATE('2024-03-31', 'YYYY-MM-DD'), 0),
('2024-2025', TO_DATE('2024-04-01', 'YYYY-MM-DD'), TO_DATE('2025-03-31', 'YYYY-MM-DD'), 1);

INSERT INTO users (username, password, role, email, phone, full_name) VALUES
('admin', 'admin123', 'admin', 'admin@fees.edu', '1234567890', 'System Administrator'),
('accountant', 'acc123', 'accountant', 'accountant@fees.edu', '1234567891', 'Fee Accountant'),
('student1', 'stud123', 'student', 'student1@fees.edu', '1234567892', 'John Student'),
('parent1', 'par123', 'parent', 'parent1@fees.edu', '1234567893', 'Jane Parent');

INSERT INTO classes (class_name, grade_level, section, academic_year_id, tuition_fee, other_fee) VALUES
('Nursery A', 1, 'A', 2, 5000, 2000),
('Nursery B', 1, 'B', 2, 5000, 2000),
('LKG A', 2, 'A', 2, 6000, 2500),
('UKG A', 3, 'A', 2, 7000, 3000),
('Class 1 A', 4, 'A', 2, 8000, 3500),
('Class 2 A', 5, 'A', 2, 9000, 4000);

INSERT INTO students (user_id, admission_number, roll_number, first_name, last_name, date_of_birth, gender, phone, email, parent_name, parent_phone, class_id, academic_year_id, total_fee) VALUES
(3, 'ADM2024001', 'NUR001', 'John', 'Doe', TO_DATE('2018-03-15', 'YYYY-MM-DD'), 'Male', '9876543210', 'john@fees.edu', 'Robert Doe', '9876543211', 1, 2, 7000),
(4, 'ADM2024002', 'NUR002', 'Jane', 'Smith', TO_DATE('2018-07-22', 'YYYY-MM-DD'), 'Female', '9876543212', 'jane@fees.edu', 'Mary Smith', '9876543213', 1, 2, 7000);

INSERT INTO fee_categories (category_name, category_code, description, is_mandatory, is_recurring, due_day) VALUES
('Tuition Fee', 'TUIT', 'Monthly tuition fee for all students', 1, 1, 5),
('Transport Fee', 'TRAN', 'Transportation fee for bus users', 0, 1, 10),
('Lab Fee', 'LAB', 'Laboratory and equipment fee', 1, 0, 15),
('Library Fee', 'LIB', 'Library and reading materials fee', 1, 0, 20),
('Sports Fee', 'SPRT', 'Sports and extracurricular activities fee', 0, 0, 25),
('Examination Fee', 'EXAM', 'Examination and assessment fee', 1, 0, 30);

INSERT INTO fee_structures (structure_name, class_id, academic_year_id, total_annual_fee, description) VALUES
('Nursery Fee Structure 2024-25', 1, 2, 84000, 'Complete fee structure for Nursery class'),
('LKG Fee Structure 2024-25', 3, 2, 102000, 'Complete fee structure for LKG class'),
('UKG Fee Structure 2024-25', 5, 2, 120000, 'Complete fee structure for UKG class');

INSERT INTO fee_assignments (structure_id, category_id, amount, frequency, due_months) VALUES
(1, 1, 5000, 'Monthly', '1,2,3,4,5,6,7,8,9,10,11,12'),
(1, 2, 1000, 'Monthly', '1,2,3,4,5,6,7,8,9,10,11,12'),
(1, 3, 2000, 'Yearly', '4'),
(1, 4, 1000, 'Yearly', '4'),
(1, 5, 500, 'Yearly', '4'),
(1, 6, 1500, 'Quarterly', '7,10,1,4');

INSERT INTO fee_concessions (concession_name, concession_type, concession_value, max_amount, description) VALUES
('Sibling Discount', 'Percentage', 10, 5000, '10% discount for siblings'),
('Merit Scholarship', 'Percentage', 25, 10000, '25% discount for merit students'),
('Staff Ward', 'Fixed', 2000, NULL, 'Fixed 2000 discount for staff children'),
('Full Scholarship', 'Full', 100, NULL, '100% fee waiver for deserving students');

INSERT INTO payment_methods (method_name, method_code, description) VALUES
('Cash', 'CASH', 'Cash payment at counter'),
('Cheque', 'CHQ', 'Cheque payment'),
('Bank Transfer', 'BT', 'Bank transfer/NEFT/RTGS'),
('Online Payment', 'ONLINE', 'Online payment gateway'),
('UPI', 'UPI', 'UPI payment');

COMMIT;

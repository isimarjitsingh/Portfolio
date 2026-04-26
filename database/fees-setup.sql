-- Oracle SQL Plus Setup Script for Student Fees Management System
-- Run this script to initialize the database

-- Connect to your Oracle database first using SQL Plus:
-- sqlplus your_username/your_password@your_connection_string

-- Then run: @fees-setup.sql

-- This script will:
-- 1. Create all necessary tables for fee management
-- 2. Create sequences and triggers
-- 3. Insert sample data
-- 4. Set up proper constraints and indexes

-- Start the setup
@fees-schema.sql

-- Create additional indexes for performance
CREATE INDEX idx_students_admission ON students(admission_number);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_academic_year ON students(academic_year_id);
CREATE INDEX idx_fee_receipts_student ON fee_receipts(student_id);
CREATE INDEX idx_fee_receipts_date ON fee_receipts(payment_date);
CREATE INDEX idx_fee_receipts_academic_year ON fee_receipts(academic_year_id);
CREATE INDEX idx_fee_payments_receipt ON fee_payments(receipt_id);
CREATE INDEX idx_fee_payments_category ON fee_payments(category_id);
CREATE INDEX idx_payment_history_receipt ON payment_history(receipt_id);
CREATE INDEX idx_fee_reminders_student ON fee_reminders(student_id);
CREATE INDEX idx_fee_reminders_due_date ON fee_reminders(due_date);

-- Create views for common queries
CREATE OR REPLACE VIEW student_fee_summary AS
SELECT s.student_id, s.admission_number, s.first_name, s.last_name, s.total_fee, s.paid_amount, s.balance_amount,
       c.class_name, ay.year_name, s.status, s.parent_name, s.parent_phone, s.parent_email
FROM students s
JOIN classes c ON s.class_id = c.class_id
JOIN academic_years ay ON s.academic_year_id = ay.year_id
WHERE s.status = 'Active';

CREATE OR REPLACE VIEW fee_receipt_details AS
SELECT fr.receipt_id, fr.receipt_number, fr.student_id, fr.payment_date, fr.total_amount, fr.paid_amount,
       fr.discount_amount, fr.fine_amount, fr.status, fr.remarks,
       s.admission_number, s.first_name, s.last_name,
       c.class_name, ay.year_name,
       pm.method_name, u.full_name as received_by_name
FROM fee_receipts fr
JOIN students s ON fr.student_id = s.student_id
JOIN classes c ON s.class_id = c.class_id
JOIN academic_years ay ON fr.academic_year_id = ay.year_id
LEFT JOIN payment_methods pm ON fr.payment_method_id = pm.method_id
JOIN users u ON fr.received_by = u.user_id
ORDER BY fr.payment_date DESC;

CREATE OR REPLACE VIEW class_fee_collection AS
SELECT c.class_id, c.class_name, c.grade_level, c.section,
       COUNT(s.student_id) as total_students,
       SUM(s.total_fee) as total_fees,
       SUM(s.paid_amount) as collected_amount,
       SUM(s.balance_amount) as pending_amount,
       ROUND((SUM(s.paid_amount) / SUM(s.total_fee)) * 100, 2) as collection_percentage
FROM classes c
LEFT JOIN students s ON c.class_id = s.class_id AND s.status = 'Active'
WHERE c.status = 'Active'
GROUP BY c.class_id, c.class_name, c.grade_level, c.section
ORDER BY c.grade_level, c.section;

CREATE OR REPLACE VIEW monthly_fee_collection AS
SELECT TO_CHAR(fr.payment_date, 'MM') as month,
       TO_CHAR(fr.payment_date, 'Month') as month_name,
       TO_CHAR(fr.payment_date, 'YYYY') as year,
       COUNT(fr.receipt_id) as receipt_count,
       SUM(fr.paid_amount) as total_collection,
       COUNT(DISTINCT fr.student_id) as unique_students
FROM fee_receipts fr
WHERE fr.status = 'Paid'
GROUP BY TO_CHAR(fr.payment_date, 'MM'), TO_CHAR(fr.payment_date, 'Month'), TO_CHAR(fr.payment_date, 'YYYY')
ORDER BY year, month;

CREATE OR REPLACE VIEW overdue_students AS
SELECT s.student_id, s.admission_number, s.first_name, s.last_name, s.total_fee, s.paid_amount, s.balance_amount,
       c.class_name, s.parent_name, s.parent_phone, s.parent_email,
       s.admission_date
FROM students s
JOIN classes c ON s.class_id = c.class_id
WHERE s.status = 'Active' AND s.balance_amount > 0
ORDER BY s.balance_amount DESC;

-- Create stored procedures for fee operations
CREATE OR REPLACE PROCEDURE add_student_fee(
    p_student_id IN NUMBER,
    p_amount IN NUMBER,
    p_payment_date IN DATE,
    p_payment_method_id IN NUMBER,
    p_received_by IN NUMBER,
    p_remarks IN VARCHAR2 DEFAULT NULL
) AS
    v_receipt_id NUMBER;
    v_receipt_number VARCHAR2(20);
    v_balance_before NUMBER;
BEGIN
    -- Get current balance
    SELECT balance_amount INTO v_balance_before
    FROM students
    WHERE student_id = p_student_id;
    
    -- Generate receipt number
    v_receipt_number := 'REC' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(fee_receipts_seq.NEXTVAL, 4, '0');
    
    -- Insert receipt
    INSERT INTO fee_receipts (
        receipt_number, student_id, academic_year_id, total_amount, paid_amount,
        payment_date, payment_method_id, received_by, remarks
    ) VALUES (
        v_receipt_number, p_student_id, 
        (SELECT academic_year_id FROM students WHERE student_id = p_student_id),
        v_balance_before + p_amount, p_amount,
        p_payment_date, p_payment_method_id, p_received_by, p_remarks
    ) RETURNING receipt_id INTO v_receipt_id;
    
    -- Update student paid amount
    UPDATE students
    SET paid_amount = paid_amount + p_amount
    WHERE student_id = p_student_id;
    
    -- Insert history record
    INSERT INTO payment_history (receipt_id, action_type, new_amount, performed_by)
    VALUES (v_receipt_id, 'Created', p_amount, p_received_by);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Fee payment recorded successfully. Receipt: ' || v_receipt_number);
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error recording fee payment: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE generate_fee_reminder(
    p_student_id IN NUMBER,
    p_category_id IN NUMBER,
    p_due_amount IN NUMBER,
    p_due_date IN DATE,
    p_reminder_type IN VARCHAR2
) AS
BEGIN
    INSERT INTO fee_reminders (
        student_id, category_id, due_amount, due_date, reminder_type, status
    ) VALUES (
        p_student_id, p_category_id, p_due_amount, p_due_date, p_reminder_type, 'Pending'
    );
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Fee reminder generated successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error generating fee reminder: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE calculate_student_balance(
    p_student_id IN NUMBER
) AS
    v_total_paid NUMBER;
    v_total_fee NUMBER;
BEGIN
    -- Calculate total paid from receipts
    SELECT NVL(SUM(paid_amount), 0) INTO v_total_paid
    FROM fee_receipts
    WHERE student_id = p_student_id AND status = 'Paid';
    
    -- Get total fee from student record
    SELECT total_fee INTO v_total_fee
    FROM students
    WHERE student_id = p_student_id;
    
    -- Update student record
    UPDATE students
    SET paid_amount = v_total_paid
    WHERE student_id = p_student_id;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Student balance calculated successfully');
    DBMS_OUTPUT.PUT_LINE('Total Fee: ' || v_total_fee || ', Paid: ' || v_total_paid || ', Balance: ' || (v_total_fee - v_total_paid));
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error calculating student balance: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE cancel_fee_receipt(
    p_receipt_id IN NUMBER,
    p_cancelled_by IN NUMBER,
    p_reason IN VARCHAR2
) AS
    v_student_id NUMBER;
    v_paid_amount NUMBER;
BEGIN
    -- Get receipt details
    SELECT student_id, paid_amount INTO v_student_id, v_paid_amount
    FROM fee_receipts
    WHERE receipt_id = p_receipt_id;
    
    -- Update receipt status
    UPDATE fee_receipts
    SET status = 'Cancelled'
    WHERE receipt_id = p_receipt_id;
    
    -- Update student paid amount
    UPDATE students
    SET paid_amount = paid_amount - v_paid_amount
    WHERE student_id = v_student_id;
    
    -- Insert history record
    INSERT INTO payment_history (receipt_id, action_type, old_amount, new_amount, reason, performed_by)
    VALUES (p_receipt_id, 'Cancelled', v_paid_amount, 0, p_reason, p_cancelled_by);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Fee receipt cancelled successfully');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error cancelling fee receipt: ' || SQLERRM);
END;
/

-- Create functions for reporting
CREATE OR REPLACE FUNCTION get_collection_percentage(
    p_class_id IN NUMBER DEFAULT NULL,
    p_academic_year_id IN NUMBER DEFAULT NULL
) RETURN NUMBER AS
    v_total_fee NUMBER;
    v_total_paid NUMBER;
    v_percentage NUMBER;
BEGIN
    SELECT NVL(SUM(total_fee), 0), NVL(SUM(paid_amount), 0)
    INTO v_total_fee, v_total_paid
    FROM students
    WHERE status = 'Active'
    AND (p_class_id IS NULL OR class_id = p_class_id)
    AND (p_academic_year_id IS NULL OR academic_year_id = p_academic_year_id);
    
    IF v_total_fee = 0 THEN
        RETURN 0;
    ELSE
        v_percentage := (v_total_paid / v_total_fee) * 100;
        RETURN ROUND(v_percentage, 2);
    END IF;
END;
/

CREATE OR REPLACE FUNCTION get_monthly_collection(
    p_month IN VARCHAR2,
    p_year IN VARCHAR2
) RETURN NUMBER AS
    v_collection NUMBER;
BEGIN
    SELECT NVL(SUM(paid_amount), 0)
    INTO v_collection
    FROM fee_receipts
    WHERE TO_CHAR(payment_date, 'MM') = p_month
    AND TO_CHAR(payment_date, 'YYYY') = p_year
    AND status = 'Paid';
    
    RETURN v_collection;
END;
/

CREATE OR REPLACE FUNCTION get_overdue_amount(
    p_class_id IN NUMBER DEFAULT NULL
) RETURN NUMBER AS
    v_overdue_amount NUMBER;
BEGIN
    SELECT NVL(SUM(balance_amount), 0)
    INTO v_overdue_amount
    FROM students
    WHERE status = 'Active'
    AND balance_amount > 0
    AND (p_class_id IS NULL OR class_id = p_class_id);
    
    RETURN v_overdue_amount;
END;
/

-- Create trigger to automatically update student balance
CREATE OR REPLACE TRIGGER update_student_balance_trigger
AFTER INSERT OR UPDATE ON fee_receipts
FOR EACH ROW
BEGIN
    IF :NEW.status = 'Paid' AND (:OLD.status IS NULL OR :OLD.status != 'Paid') THEN
        UPDATE students
        SET paid_amount = paid_amount + :NEW.paid_amount
        WHERE student_id = :NEW.student_id;
    ELSIF :NEW.status = 'Cancelled' AND (:OLD.status IS NULL OR :OLD.status != 'Cancelled') THEN
        UPDATE students
        SET paid_amount = paid_amount - :NEW.paid_amount
        WHERE student_id = :NEW.student_id;
    END IF;
END;
/

-- Create trigger for receipt number generation
CREATE OR REPLACE TRIGGER generate_receipt_number
BEFORE INSERT ON fee_receipts
FOR EACH ROW
WHEN (NEW.receipt_number IS NULL)
BEGIN
    :NEW.receipt_number := 'REC' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(fee_receipts_seq.NEXTVAL, 4, '0');
END;
/

-- Create scheduled job for fee reminders (if you have DBMS_SCHEDULER)
BEGIN
    DBMS_SCHEDULER.CREATE_JOB (
        job_name        => 'fee_reminder_job',
        job_type        => 'PLSQL_BLOCK',
        job_action      => 'BEGIN generate_fee_reminders; END;',
        start_date      => SYSTIMESTAMP,
        repeat_interval => 'FREQ=DAILY; BYHOUR=9;',
        enabled         => FALSE,
        comments        => 'Job to generate fee reminders daily'
    );
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Scheduler job creation failed: ' || SQLERRM);
END;
/

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON academic_years TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON classes TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON students TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fee_categories TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fee_structures TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fee_assignments TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fee_concessions TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON payment_methods TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fee_receipts TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fee_payments TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON payment_history TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fee_reminders TO app_user;

-- Grant sequence usage
-- GRANT SELECT ON users_seq TO app_user;
-- GRANT SELECT ON academic_years_seq TO app_user;
-- GRANT SELECT ON classes_seq TO app_user;
-- GRANT SELECT ON students_seq TO app_user;
-- GRANT SELECT ON fee_categories_seq TO app_user;
-- GRANT SELECT ON fee_structures_seq TO app_user;
-- GRANT SELECT ON fee_assignments_seq TO app_user;
-- GRANT SELECT ON fee_concessions_seq TO app_user;
-- GRANT SELECT ON payment_methods_seq TO app_user;
-- GRANT SELECT ON fee_receipts_seq TO app_user;
-- GRANT SELECT ON fee_payments_seq TO app_user;
-- GRANT SELECT ON payment_history_seq TO app_user;
-- GRANT SELECT ON fee_reminders_seq TO app_user;

-- Grant procedure execution
-- GRANT EXECUTE ON add_student_fee TO app_user;
-- GRANT EXECUTE ON generate_fee_reminder TO app_user;
-- GRANT EXECUTE ON calculate_student_balance TO app_user;
-- GRANT EXECUTE ON cancel_fee_receipt TO app_user;
-- GRANT EXECUTE ON get_collection_percentage TO app_user;
-- GRANT EXECUTE ON get_monthly_collection TO app_user;
-- GRANT EXECUTE ON get_overdue_amount TO app_user;

COMMIT;
DBMS_OUTPUT.PUT_LINE('Student Fees Management System setup completed successfully!');
DBMS_OUTPUT.PUT_LINE('Database is ready for use with the Node.js application.');
DBMS_OUTPUT.PUT_LINE('Sample data has been inserted for testing purposes.');

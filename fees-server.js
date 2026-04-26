const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Oracle Database Connection
let connection;

async function initializeDatabase() {
    try {
        connection = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectionString: process.env.ORACLE_CONNECTION_STRING
        });
        console.log('Successfully connected to Oracle Database');
    } catch (err) {
        console.error('Error connecting to Oracle Database:', err);
        process.exit(1);
    }
}

// Initialize database connection
initializeDatabase();

// API Routes

// Authentication
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await connection.execute(
            `SELECT u.*, 
                    CASE 
                        WHEN u.role = 'student' THEN s.student_id
                        WHEN u.role = 'parent' THEN s.student_id
                        ELSE NULL
                    END as role_id
             FROM users u
             LEFT JOIN students s ON u.user_id = s.user_id
             WHERE u.username = :username AND u.password = :password AND u.is_active = 1`,
            { username, password },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Dashboard Statistics
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [students, totalFees, collectedFees, pendingFees] = await Promise.all([
            connection.execute(`SELECT COUNT(*) as count FROM students WHERE status = 'Active'`),
            connection.execute(`SELECT SUM(total_fee) as total FROM students WHERE status = 'Active'`),
            connection.execute(`SELECT SUM(paid_amount) as total FROM students WHERE status = 'Active'`),
            connection.execute(`SELECT SUM(balance_amount) as total FROM students WHERE status = 'Active'`)
        ]);
        
        res.json({
            totalStudents: students.rows[0][0],
            totalFees: totalFees.rows[0][0] || 0,
            collectedFees: collectedFees.rows[0][0] || 0,
            pendingFees: pendingFees.rows[0][0] || 0
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Students Management
app.get('/api/students', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT s.*, u.username, u.email, c.class_name, ay.year_name,
                    (SELECT SUM(paid_amount) FROM fee_receipts WHERE student_id = s.student_id) as total_paid
             FROM students s
             JOIN users u ON s.user_id = u.user_id
             LEFT JOIN classes c ON s.class_id = c.class_id
             LEFT JOIN academic_years ay ON s.academic_year_id = ay.year_id
             WHERE s.status = 'Active'
             ORDER BY s.admission_number`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const { username, password, email, phone, fullName, admissionNumber, rollNumber, firstName, lastName, dateOfBirth, gender, address, city, state, postalCode, country, parentName, parentPhone, parentEmail, classId, academicYearId, totalFee } = req.body;
        
        // Start transaction
        await connection.execute('BEGIN NULL; END;');
        
        // Insert user
        const userResult = await connection.execute(
            `INSERT INTO users (username, password, role, email, phone, full_name) 
             VALUES (:username, :password, 'student', :email, :phone, :fullName) 
             RETURNING user_id INTO :user_id`,
            {
                username, password, email, phone, fullName,
                user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: false }
        );
        
        const userId = userResult.outBinds.user_id[0];
        
        // Insert student
        await connection.execute(
            `INSERT INTO students (user_id, admission_number, roll_number, first_name, last_name, date_of_birth, gender, address, city, state, postal_code, country, parent_name, parent_phone, parent_email, class_id, academic_year_id, total_fee) 
             VALUES (:user_id, :admissionNumber, :rollNumber, :firstName, :lastName, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :address, :city, :state, :postalCode, :country, :parentName, :parentPhone, :parentEmail, :classId, :academicYearId, :totalFee)`,
            { userId, admissionNumber, rollNumber, firstName, lastName, dateOfBirth, gender, address, city, state, postalCode, country, parentName, parentPhone, parentEmail, classId, academicYearId, totalFee },
            { autoCommit: false }
        );
        
        await connection.commit();
        res.json({ success: true, message: 'Student added successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Error adding student:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Classes Management
app.get('/api/classes', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT c.*, ay.year_name,
                    (SELECT COUNT(*) FROM students WHERE class_id = c.class_id AND status = 'Active') as student_count
             FROM classes c
             JOIN academic_years ay ON c.academic_year_id = ay.year_id
             WHERE c.status = 'Active'
             ORDER BY c.grade_level, c.section`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching classes:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fee Categories
app.get('/api/fee-categories', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT * FROM fee_categories WHERE status = 'Active' ORDER BY category_name`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching fee categories:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fee Structures
app.get('/api/fee-structures', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT fs.*, c.class_name, ay.year_name
             FROM fee_structures fs
             JOIN classes c ON fs.class_id = c.class_id
             JOIN academic_years ay ON fs.academic_year_id = ay.year_id
             WHERE fs.status = 'Active'
             ORDER BY c.grade_level, c.section`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching fee structures:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fee Receipts
app.get('/api/fee-receipts', async (req, res) => {
    try {
        const { studentId, startDate, endDate } = req.query;
        
        let query = `
            SELECT fr.*, s.admission_number, s.first_name, s.last_name, 
                   c.class_name, pm.method_name, u.full_name as received_by_name
            FROM fee_receipts fr
            JOIN students s ON fr.student_id = s.student_id
            JOIN classes c ON s.class_id = c.class_id
            LEFT JOIN payment_methods pm ON fr.payment_method_id = pm.method_id
            JOIN users u ON fr.received_by = u.user_id
            WHERE 1=1
        `;
        
        const params = {};
        
        if (studentId) {
            query += ` AND fr.student_id = :studentId`;
            params.studentId = studentId;
        }
        
        if (startDate) {
            query += ` AND fr.payment_date >= TO_DATE(:startDate, 'YYYY-MM-DD')`;
            params.startDate = startDate;
        }
        
        if (endDate) {
            query += ` AND fr.payment_date <= TO_DATE(:endDate, 'YYYY-MM-DD')`;
            params.endDate = endDate;
        }
        
        query += ` ORDER BY fr.payment_date DESC`;
        
        const result = await connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching fee receipts:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/fee-receipts', async (req, res) => {
    try {
        const { studentId, academicYearId, totalAmount, paidAmount, discountAmount, fineAmount, paymentDate, paymentMethodId, transactionId, chequeNumber, bankName, remarks, paymentBreakdown } = req.body;
        
        // Generate receipt number
        const receiptNumber = 'REC' + new Date().getFullYear() + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        
        // Start transaction
        await connection.execute('BEGIN NULL; END;');
        
        // Insert receipt
        const receiptResult = await connection.execute(
            `INSERT INTO fee_receipts (receipt_number, student_id, academic_year_id, total_amount, paid_amount, discount_amount, fine_amount, payment_date, payment_method_id, transaction_id, cheque_number, bank_name, received_by, remarks) 
             VALUES (:receiptNumber, :studentId, :academicYearId, :totalAmount, :paidAmount, :discountAmount, :fineAmount, TO_DATE(:paymentDate, 'YYYY-MM-DD'), :paymentMethodId, :transactionId, :chequeNumber, :bankName, :receivedBy, :remarks) 
             RETURNING receipt_id INTO :receipt_id`,
            {
                receiptNumber, studentId, academicYearId, totalAmount, paidAmount, discountAmount, fineAmount, paymentDate, paymentMethodId, transactionId, chequeNumber, bankName, receivedBy: 1, remarks,
                receipt_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: false }
        );
        
        const receiptId = receiptResult.outBinds.receipt_id[0];
        
        // Insert payment breakdown
        for (const payment of paymentBreakdown) {
            await connection.execute(
                `INSERT INTO fee_payments (receipt_id, assignment_id, category_id, amount, paid_amount, discount_amount, fine_amount, for_month, payment_date) 
                 VALUES (:receiptId, :assignmentId, :categoryId, :amount, :paidAmount, :discountAmount, :fineAmount, :forMonth, TO_DATE(:paymentDate, 'YYYY-MM-DD'))`,
                {
                    receiptId, assignmentId: payment.assignmentId, categoryId: payment.categoryId,
                    amount: payment.amount, paidAmount: payment.paidAmount,
                    discountAmount: payment.discountAmount || 0, fineAmount: payment.fineAmount || 0,
                    forMonth: payment.forMonth, paymentDate
                },
                { autoCommit: false }
            );
        }
        
        // Update student paid amount
        await connection.execute(
            `UPDATE students SET paid_amount = paid_amount + :paidAmount WHERE student_id = :studentId`,
            { paidAmount, studentId },
            { autoCommit: false }
        );
        
        // Insert history record
        await connection.execute(
            `INSERT INTO payment_history (receipt_id, action_type, new_amount, performed_by) 
             VALUES (:receiptId, 'Created', :paidAmount, :performedBy)`,
            { receiptId, paidAmount, performedBy: 1 },
            { autoCommit: false }
        );
        
        await connection.commit();
        res.json({ success: true, message: 'Payment recorded successfully', receiptId, receiptNumber });
    } catch (err) {
        await connection.rollback();
        console.error('Error recording payment:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Payment Methods
app.get('/api/payment-methods', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY method_name`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching payment methods:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fee Reports
app.get('/api/reports/collection-summary', async (req, res) => {
    try {
        const { startDate, endDate, classId } = req.query;
        
        let query = `
            SELECT c.class_name, 
                   COUNT(s.student_id) as total_students,
                   SUM(s.total_fee) as total_fees,
                   SUM(s.paid_amount) as collected_amount,
                   SUM(s.balance_amount) as pending_amount,
                   ROUND((SUM(s.paid_amount) / SUM(s.total_fee)) * 100, 2) as collection_percentage
            FROM students s
            JOIN classes c ON s.class_id = c.class_id
            WHERE s.status = 'Active'
        `;
        
        const params = {};
        
        if (classId) {
            query += ` AND s.class_id = :classId`;
            params.classId = classId;
        }
        
        query += ` GROUP BY c.class_name ORDER BY c.grade_level, c.section`;
        
        const result = await connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error('Error generating collection summary:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/reports/monthly-collection', async (req, res) => {
    try {
        const { year } = req.query;
        const currentYear = year || new Date().getFullYear();
        
        const result = await connection.execute(
            `SELECT TO_CHAR(fr.payment_date, 'MM') as month,
                    TO_CHAR(fr.payment_date, 'Month') as month_name,
                    COUNT(fr.receipt_id) as receipt_count,
                    SUM(fr.paid_amount) as total_collection
             FROM fee_receipts fr
             WHERE TO_CHAR(fr.payment_date, 'YYYY') = :year
             GROUP BY TO_CHAR(fr.payment_date, 'MM'), TO_CHAR(fr.payment_date, 'Month')
             ORDER BY TO_CHAR(fr.payment_date, 'MM')`,
            { year: currentYear },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error generating monthly collection report:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/reports/overdue-students', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT s.admission_number, s.first_name, s.last_name, c.class_name,
                    s.total_fee, s.paid_amount, s.balance_amount,
                    s.parent_name, s.parent_phone, s.parent_email
             FROM students s
             JOIN classes c ON s.class_id = c.class_id
             WHERE s.status = 'Active' AND s.balance_amount > 0
             ORDER BY s.balance_amount DESC`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching overdue students:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Academic Years
app.get('/api/academic-years', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT * FROM academic_years ORDER BY start_date DESC`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching academic years:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fee Reminders
app.get('/api/fee-reminders', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT fr.*, s.admission_number, s.first_name, s.last_name, c.class_name,
                    fc.category_name
             FROM fee_reminders fr
             JOIN students s ON fr.student_id = s.student_id
             JOIN classes c ON s.class_id = c.class_id
             LEFT JOIN fee_categories fc ON fr.category_id = fc.category_id
             WHERE fr.status = 'Pending'
             ORDER BY fr.due_date`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching fee reminders:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Student Fees Management System running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    if (connection) {
        await connection.close();
    }
    process.exit(0);
});

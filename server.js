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
                        WHEN u.role = 'teacher' THEN t.teacher_id
                        ELSE NULL
                    END as role_id
             FROM users u
             LEFT JOIN students s ON u.user_id = s.user_id
             LEFT JOIN teachers t ON u.user_id = t.user_id
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

// Students
app.get('/api/students', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT s.*, u.username, u.email
             FROM students s
             JOIN users u ON s.user_id = u.user_id
             WHERE s.status = 'Active'
             ORDER BY s.first_name, s.last_name`,
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
        const { username, password, email, phone, firstName, lastName, dateOfBirth, gender, gradeLevel, parentName, parentPhone, parentEmail } = req.body;
        
        // Start transaction
        await connection.execute('BEGIN NULL; END;');
        
        // Insert user
        const userResult = await connection.execute(
            `INSERT INTO users (username, password, role, email, phone) 
             VALUES (:username, :password, 'student', :email, :phone) 
             RETURNING user_id INTO :user_id`,
            {
                username, password, email, phone,
                user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: false }
        );
        
        const userId = userResult.outBinds.user_id[0];
        
        // Insert student
        await connection.execute(
            `INSERT INTO students (user_id, first_name, last_name, date_of_birth, gender, grade_level, parent_name, parent_phone, parent_email) 
             VALUES (:user_id, :firstName, :lastName, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :gradeLevel, :parentName, :parentPhone, :parentEmail)`,
            { userId, firstName, lastName, dateOfBirth, gender, gradeLevel, parentName, parentPhone, parentEmail },
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

// Teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT t.*, d.dept_name, u.username, u.email
             FROM teachers t
             JOIN departments d ON t.dept_id = d.dept_id
             JOIN users u ON t.user_id = u.user_id
             WHERE t.status = 'Active'
             ORDER BY t.first_name, t.last_name`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Classes
app.get('/api/classes', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT c.*, t.first_name || ' ' || t.last_name as teacher_name, d.dept_name
             FROM classes c
             LEFT JOIN teachers t ON c.teacher_id = t.teacher_id
             LEFT JOIN departments d ON c.dept_id = d.dept_id
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

// Subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const result = await connection.execute(
            `SELECT s.*, d.dept_name
             FROM subjects s
             LEFT JOIN departments d ON s.dept_id = d.dept_id
             WHERE s.status = 'Active'
             ORDER BY s.subject_name`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Attendance
app.get('/api/attendance/:classId/:date', async (req, res) => {
    try {
        const { classId, date } = req.params;
        const result = await connection.execute(
            `SELECT a.*, s.first_name || ' ' || s.last_name as student_name
             FROM attendance a
             JOIN students s ON a.student_id = s.student_id
             WHERE a.class_id = :classId AND a.attendance_date = TO_DATE(:date, 'YYYY-MM-DD')
             ORDER BY s.first_name, s.last_name`,
            { classId, date },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching attendance:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/attendance', async (req, res) => {
    try {
        const { classId, subjectId, teacherId, date, attendance } = req.body;
        
        for (const record of attendance) {
            await connection.execute(
                `INSERT INTO attendance (student_id, class_id, subject_id, teacher_id, attendance_date, status, remarks) 
                 VALUES (:studentId, :classId, :subjectId, :teacherId, TO_DATE(:date, 'YYYY-MM-DD'), :status, :remarks)`,
                {
                    studentId: record.studentId,
                    classId,
                    subjectId,
                    teacherId,
                    date,
                    status: record.status,
                    remarks: record.remarks || null
                }
            );
        }
        
        res.json({ success: true, message: 'Attendance recorded successfully' });
    } catch (err) {
        console.error('Error recording attendance:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Grades
app.get('/api/grades/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await connection.execute(
            `SELECT g.*, sub.subject_name, t.first_name || ' ' || t.last_name as teacher_name
             FROM grades g
             JOIN subjects sub ON g.subject_id = sub.subject_id
             JOIN teachers t ON g.teacher_id = t.teacher_id
             WHERE g.student_id = :studentId
             ORDER BY g.academic_year, g.exam_date`,
            { studentId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching grades:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/grades', async (req, res) => {
    try {
        const { studentId, subjectId, classId, teacherId, examType, examDate, marksObtained, totalMarks, remarks, academicYear } = req.body;
        
        // Calculate grade
        const percentage = (marksObtained / totalMarks) * 100;
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else if (percentage >= 40) grade = 'E';
        
        await connection.execute(
            `INSERT INTO grades (student_id, subject_id, class_id, teacher_id, exam_type, exam_date, marks_obtained, total_marks, grade, remarks, academic_year) 
             VALUES (:studentId, :subjectId, :classId, :teacherId, :examType, TO_DATE(:examDate, 'YYYY-MM-DD'), :marksObtained, :totalMarks, :grade, :remarks, :academicYear)`,
            { studentId, subjectId, classId, teacherId, examType, examDate, marksObtained, totalMarks, grade, remarks, academicYear }
        );
        
        res.json({ success: true, message: 'Grade added successfully' });
    } catch (err) {
        console.error('Error adding grade:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Dashboard Statistics
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [students, teachers, classes, subjects] = await Promise.all([
            connection.execute(`SELECT COUNT(*) as count FROM students WHERE status = 'Active'`),
            connection.execute(`SELECT COUNT(*) as count FROM teachers WHERE status = 'Active'`),
            connection.execute(`SELECT COUNT(*) as count FROM classes WHERE status = 'Active'`),
            connection.execute(`SELECT COUNT(*) as count FROM subjects WHERE status = 'Active'`)
        ]);
        
        res.json({
            totalStudents: students.rows[0][0],
            totalTeachers: teachers.rows[0][0],
            totalClasses: classes.rows[0][0],
            totalSubjects: subjects.rows[0][0]
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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

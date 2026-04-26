// School Management System - Frontend JavaScript
class SchoolManagementSystem {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Menu toggle
        document.querySelector('.menu-toggle')?.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // Modal overlay click
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeAllModals();
            }
        });

        // Set today's date for attendance
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('attendanceDate') && (document.getElementById('attendanceDate').value = today);
        document.getElementById('attendanceModalDate') && (document.getElementById('attendanceModalDate').value = today);
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showToast('Please enter both username and password', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.currentUser = data.user;
                this.showDashboard();
                this.showToast('Login successful!');
            } else {
                this.showToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Server error. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.showLoginScreen();
        this.showToast('Logged out successfully');
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('dashboardScreen').classList.add('hidden');
        document.getElementById('loginForm').reset();
    }

    showDashboard() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboardScreen').classList.remove('hidden');
        
        // Update user info
        document.getElementById('userName').textContent = this.currentUser.first_name || this.currentUser.username;
        document.getElementById('userRole').textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
        
        // Load dashboard data
        this.loadDashboardStats();
        this.loadInitialData();
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            students: 'Students Management',
            teachers: 'Teachers Management',
            classes: 'Classes Management',
            subjects: 'Subjects Management',
            attendance: 'Attendance Management',
            grades: 'Grades Management'
        };
        document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

        // Show/hide pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}Page`).classList.add('active');

        this.currentPage = page;

        // Load page-specific data
        this.loadPageData(page);
    }

    async loadPageData(page) {
        switch (page) {
            case 'dashboard':
                await this.loadDashboardStats();
                break;
            case 'students':
                await this.loadStudents();
                break;
            case 'teachers':
                await this.loadTeachers();
                break;
            case 'classes':
                await this.loadClasses();
                break;
            case 'subjects':
                await this.loadSubjects();
                break;
            case 'attendance':
                await this.loadAttendanceData();
                break;
            case 'grades':
                await this.loadGradesData();
                break;
        }
    }

    async loadDashboardStats() {
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();
            
            document.getElementById('totalStudents').textContent = data.totalStudents || 0;
            document.getElementById('totalTeachers').textContent = data.totalTeachers || 0;
            document.getElementById('totalClasses').textContent = data.totalClasses || 0;
            document.getElementById('totalSubjects').textContent = data.totalSubjects || 0;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async loadInitialData() {
        // Load data for dropdowns
        await Promise.all([
            this.loadClasses(),
            this.loadSubjects(),
            this.loadStudents()
        ]);
    }

    async loadStudents() {
        try {
            const response = await fetch('/api/students');
            const students = await response.json();
            
            const tbody = document.getElementById('studentsTableBody');
            if (tbody) {
                tbody.innerHTML = students.map(student => `
                    <tr>
                        <td>${student.student_id}</td>
                        <td>${student.first_name} ${student.last_name}</td>
                        <td>${student.grade_level}</td>
                        <td>${student.email}</td>
                        <td>${student.phone || 'N/A'}</td>
                        <td><span class="status-badge ${student.status.toLowerCase()}">${student.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="app.editStudent(${student.student_id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteStudent(${student.student_id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }

            // Update dropdowns
            this.updateStudentDropdowns(students);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    async loadTeachers() {
        try {
            const response = await fetch('/api/teachers');
            const teachers = await response.json();
            
            const tbody = document.getElementById('teachersTableBody');
            if (tbody) {
                tbody.innerHTML = teachers.map(teacher => `
                    <tr>
                        <td>${teacher.teacher_id}</td>
                        <td>${teacher.first_name} ${teacher.last_name}</td>
                        <td>${teacher.dept_name || 'N/A'}</td>
                        <td>${teacher.email}</td>
                        <td>${teacher.phone || 'N/A'}</td>
                        <td>${teacher.experience_years} years</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="app.editTeacher(${teacher.teacher_id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteTeacher(${teacher.teacher_id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading teachers:', error);
        }
    }

    async loadClasses() {
        try {
            const response = await fetch('/api/classes');
            const classes = await response.json();
            
            const tbody = document.getElementById('classesTableBody');
            if (tbody) {
                tbody.innerHTML = classes.map(cls => `
                    <tr>
                        <td>${cls.class_id}</td>
                        <td>${cls.class_name}</td>
                        <td>${cls.grade_level}</td>
                        <td>${cls.section || 'N/A'}</td>
                        <td>${cls.teacher_name || 'N/A'}</td>
                        <td>${cls.room_number || 'N/A'}</td>
                        <td>${cls.capacity}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="app.editClass(${cls.class_id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteClass(${cls.class_id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }

            // Update dropdowns
            this.updateClassDropdowns(classes);
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    }

    async loadSubjects() {
        try {
            const response = await fetch('/api/subjects');
            const subjects = await response.json();
            
            const tbody = document.getElementById('subjectsTableBody');
            if (tbody) {
                tbody.innerHTML = subjects.map(subject => `
                    <tr>
                        <td>${subject.subject_id}</td>
                        <td>${subject.subject_name}</td>
                        <td>${subject.subject_code}</td>
                        <td>${subject.dept_name || 'N/A'}</td>
                        <td>${subject.credits}</td>
                        <td><span class="status-badge ${subject.is_elective ? 'elective' : 'core'}">${subject.is_elective ? 'Elective' : 'Core'}</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="app.editSubject(${subject.subject_id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteSubject(${subject.subject_id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }

            // Update dropdowns
            this.updateSubjectDropdowns(subjects);
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    }

    updateStudentDropdowns(students) {
        const dropdowns = ['gradesStudentSelect'];
        dropdowns.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Select Student</option>' +
                    students.map(s => `<option value="${s.student_id}">${s.first_name} ${s.last_name}</option>`).join('');
            }
        });
    }

    updateClassDropdowns(classes) {
        const dropdowns = ['attendanceClassSelect', 'attendanceModalClass'];
        dropdowns.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Select Class</option>' +
                    classes.map(c => `<option value="${c.class_id}">${c.class_name}</option>`).join('');
            }
        });
    }

    updateSubjectDropdowns(subjects) {
        const dropdowns = ['attendanceModalSubject', 'gradesSubjectSelect'];
        dropdowns.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Select Subject</option>' +
                    subjects.map(s => `<option value="${s.subject_id}">${s.subject_name}</option>`).join('');
            }
        });
    }

    async loadAttendanceData() {
        // This will be implemented when attendance is requested
        console.log('Loading attendance data...');
    }

    async loadGradesData() {
        // This will be implemented when grades are requested
        console.log('Loading grades data...');
    }

    // Modal functions
    showAddStudentModal() {
        this.openModal('addStudentModal');
    }

    showAttendanceModal() {
        this.openModal('attendanceModal');
        this.loadAttendanceStudents();
    }

    showGradeModal() {
        this.openModal('gradeModal');
    }

    openModal(modalId) {
        document.getElementById('modalOverlay').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        this.checkAndCloseOverlay();
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.getElementById('modalOverlay').classList.add('hidden');
    }

    checkAndCloseOverlay() {
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        if (modals.length === 0) {
            document.getElementById('modalOverlay').classList.add('hidden');
        }
    }

    // Form submissions
    async addStudent() {
        const form = document.getElementById('addStudentForm');
        const formData = new FormData(form);
        
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            dateOfBirth: formData.get('dateOfBirth'),
            gender: formData.get('gender'),
            gradeLevel: formData.get('gradeLevel'),
            parentName: formData.get('parentName'),
            parentPhone: formData.get('parentPhone'),
            parentEmail: formData.get('parentEmail')
        };

        this.showLoading(true);

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.closeModal('addStudentModal');
                form.reset();
                this.showToast('Student added successfully!');
                if (this.currentPage === 'students') {
                    await this.loadStudents();
                }
                await this.loadDashboardStats();
            } else {
                this.showToast(result.error || 'Failed to add student', 'error');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            this.showToast('Server error. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadAttendanceStudents() {
        const classSelect = document.getElementById('attendanceModalClass');
        const classId = classSelect.value;

        if (!classId) return;

        try {
            // This would need an API endpoint to get students in a class
            // For now, we'll use the general students list
            const response = await fetch('/api/students');
            const students = await response.json();

            const attendanceList = document.getElementById('attendanceList');
            attendanceList.innerHTML = students.map(student => `
                <div class="attendance-item">
                    <div class="student-info">${student.first_name} ${student.last_name}</div>
                    <select class="status-select" data-student-id="${student.student_id}">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                    </select>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading attendance students:', error);
        }
    }

    async saveAttendance() {
        const classId = document.getElementById('attendanceModalClass').value;
        const subjectId = document.getElementById('attendanceModalSubject').value;
        const date = document.getElementById('attendanceModalDate').value;
        
        if (!classId || !subjectId || !date) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        const attendance = [];
        document.querySelectorAll('.attendance-item').forEach(item => {
            const studentId = item.querySelector('.status-select').dataset.studentId;
            const status = item.querySelector('.status-select').value;
            attendance.push({ studentId, status });
        });

        this.showLoading(true);

        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classId,
                    subjectId,
                    teacherId: this.currentUser.role_id || 1, // Default to teacher ID 1
                    date,
                    attendance
                })
            });

            const result = await response.json();

            if (result.success) {
                this.closeModal('attendanceModal');
                this.showToast('Attendance saved successfully!');
                if (this.currentPage === 'attendance') {
                    await this.loadAttendanceData();
                }
            } else {
                this.showToast(result.error || 'Failed to save attendance', 'error');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            this.showToast('Server error. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async addGrade() {
        const form = document.getElementById('gradeForm');
        const formData = new FormData(form);
        
        const data = {
            studentId: formData.get('studentId'),
            subjectId: formData.get('subjectId'),
            classId: formData.get('classId'),
            examType: formData.get('examType'),
            examDate: formData.get('examDate'),
            marksObtained: parseFloat(formData.get('marksObtained')),
            totalMarks: parseFloat(formData.get('totalMarks')),
            academicYear: formData.get('academicYear'),
            remarks: formData.get('remarks'),
            teacherId: this.currentUser.role_id || 1 // Default to teacher ID 1
        };

        this.showLoading(true);

        try {
            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.closeModal('gradeModal');
                form.reset();
                this.showToast('Grade added successfully!');
                if (this.currentPage === 'grades') {
                    await this.loadGradesData();
                }
            } else {
                this.showToast(result.error || 'Failed to add grade', 'error');
            }
        } catch (error) {
            console.error('Error adding grade:', error);
            this.showToast('Server error. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Utility functions
    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const icon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
        // Update icon based on type
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
        icon.style.color = type === 'error' ? 'var(--danger-color)' : 'var(--success-color)';
        
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    checkAuthStatus() {
        // Check if user is already logged in (could use localStorage/sessionStorage)
        // For now, we'll always show login screen
        this.showLoginScreen();
    }

    // Placeholder functions for CRUD operations
    editStudent(id) {
        this.showToast(`Edit student ${id} - Functionality to be implemented`);
    }

    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.showToast(`Delete student ${id} - Functionality to be implemented`);
        }
    }

    editTeacher(id) {
        this.showToast(`Edit teacher ${id} - Functionality to be implemented`);
    }

    deleteTeacher(id) {
        if (confirm('Are you sure you want to delete this teacher?')) {
            this.showToast(`Delete teacher ${id} - Functionality to be implemented`);
        }
    }

    editClass(id) {
        this.showToast(`Edit class ${id} - Functionality to be implemented`);
    }

    deleteClass(id) {
        if (confirm('Are you sure you want to delete this class?')) {
            this.showToast(`Delete class ${id} - Functionality to be implemented`);
        }
    }

    editSubject(id) {
        this.showToast(`Edit subject ${id} - Functionality to be implemented`);
    }

    deleteSubject(id) {
        if (confirm('Are you sure you want to delete this subject?')) {
            this.showToast(`Delete subject ${id} - Functionality to be implemented`);
        }
    }

    generateReport() {
        this.showToast('Report generation - Functionality to be implemented');
    }

    async loadAttendance() {
        const classId = document.getElementById('attendanceClassSelect').value;
        const date = document.getElementById('attendanceDate').value;

        if (!classId || !date) {
            this.showToast('Please select class and date', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/attendance/${classId}/${date}`);
            const attendance = await response.json();

            const tbody = document.getElementById('attendanceTableBody');
            tbody.innerHTML = attendance.map(record => `
                <tr>
                    <td>${record.student_name}</td>
                    <td><span class="status-badge ${record.status.toLowerCase()}">${record.status}</span></td>
                    <td>${record.check_in_time || 'N/A'}</td>
                    <td>${record.check_out_time || 'N/A'}</td>
                    <td>${record.remarks || 'N/A'}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading attendance:', error);
            this.showToast('Error loading attendance data', 'error');
        }
    }

    async loadGrades() {
        const studentId = document.getElementById('gradesStudentSelect').value;

        if (!studentId) {
            this.showToast('Please select a student', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/grades/${studentId}`);
            const grades = await response.json();

            const tbody = document.getElementById('gradesTableBody');
            tbody.innerHTML = grades.map(grade => `
                <tr>
                    <td>${grade.subject_name}</td>
                    <td>${grade.exam_type}</td>
                    <td>${new Date(grade.exam_date).toLocaleDateString()}</td>
                    <td>${grade.marks_obtained}</td>
                    <td>${grade.total_marks}</td>
                    <td>${grade.percentage.toFixed(2)}%</td>
                    <td><span class="grade-${grade.grade.toLowerCase()}">${grade.grade}</span></td>
                    <td>${grade.remarks || 'N/A'}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading grades:', error);
            this.showToast('Error loading grades data', 'error');
        }
    }
}

// Global functions for onclick handlers
window.showAddStudentModal = () => app.showAddStudentModal();
window.showAttendanceModal = () => app.showAttendanceModal();
window.showGradeModal = () => app.showGradeModal();
window.addStudent = () => app.addStudent();
window.saveAttendance = () => app.saveAttendance();
window.addGrade = () => app.addGrade();
window.closeModal = (modalId) => app.closeModal(modalId);
window.generateReport = () => app.generateReport();
window.loadAttendance = () => app.loadAttendance();
window.loadGrades = () => app.loadGrades();

// Initialize the application
const app = new SchoolManagementSystem();

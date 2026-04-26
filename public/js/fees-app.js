// Student Fees Management System - Frontend JavaScript
class StudentFeesManagementSystem {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.students = [];
        this.classes = [];
        this.feeStructures = [];
        this.paymentMethods = [];
        this.academicYears = [];
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

        // Student selection for fee collection
        document.getElementById('studentSelect')?.addEventListener('change', (e) => {
            this.loadStudentFeeDetails(e.target.value);
        });

        // Set today's date for payment
        const today = new Date().toISOString().split('T')[0];
        const paymentDateInput = document.getElementById('paymentDate');
        if (paymentDateInput) {
            paymentDateInput.value = today;
        }
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
        document.getElementById('userName').textContent = this.currentUser.full_name || this.currentUser.username;
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
            'fee-collection': 'Fee Collection',
            'fee-receipts': 'Fee Receipts',
            'fee-structures': 'Fee Structures',
            reports: 'Reports & Analytics',
            reminders: 'Fee Reminders'
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
            case 'fee-collection':
                await this.loadFeeCollectionData();
                break;
            case 'fee-receipts':
                await this.loadFeeReceipts();
                break;
            case 'fee-structures':
                await this.loadFeeStructures();
                break;
            case 'reports':
                await this.loadReports();
                break;
            case 'reminders':
                await this.loadReminders();
                break;
        }
    }

    async loadDashboardStats() {
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();
            
            document.getElementById('totalStudents').textContent = data.totalStudents || 0;
            document.getElementById('totalFees').textContent = this.formatCurrency(data.totalFees || 0);
            document.getElementById('collectedFees').textContent = this.formatCurrency(data.collectedFees || 0);
            document.getElementById('pendingFees').textContent = this.formatCurrency(data.pendingFees || 0);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async loadInitialData() {
        // Load data for dropdowns
        await Promise.all([
            this.loadStudents(),
            this.loadClasses(),
            this.loadPaymentMethods(),
            this.loadAcademicYears()
        ]);
    }

    async loadStudents() {
        try {
            const response = await fetch('/api/students');
            const students = await response.json();
            this.students = students;
            
            const tbody = document.getElementById('studentsTableBody');
            if (tbody) {
                tbody.innerHTML = students.map(student => `
                    <tr>
                        <td>${student.admission_number}</td>
                        <td>${student.first_name} ${student.last_name}</td>
                        <td>${student.class_name || 'N/A'}</td>
                        <td class="fee-amount">${this.formatCurrency(student.total_fee)}</td>
                        <td class="fee-amount positive">${this.formatCurrency(student.total_paid || 0)}</td>
                        <td class="fee-amount ${student.balance_amount > 0 ? 'negative' : 'positive'}">${this.formatCurrency(student.balance_amount)}</td>
                        <td><span class="status-badge ${student.status.toLowerCase()}">${student.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="app.collectFee(${student.student_id})">
                                <i class="fas fa-hand-holding-usd"></i>
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.viewStudentDetails(${student.student_id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }

            // Update dropdowns
            this.updateStudentDropdowns();
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    async loadClasses() {
        try {
            const response = await fetch('/api/classes');
            const classes = await response.json();
            this.classes = classes;
            
            // Update dropdowns
            this.updateClassDropdowns();
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    }

    async loadPaymentMethods() {
        try {
            const response = await fetch('/api/payment-methods');
            const methods = await response.json();
            this.paymentMethods = methods;
            
            // Update dropdowns
            this.updatePaymentMethodDropdowns();
        } catch (error) {
            console.error('Error loading payment methods:', error);
        }
    }

    async loadAcademicYears() {
        try {
            const response = await fetch('/api/academic-years');
            const years = await response.json();
            this.academicYears = years;
            
            // Update dropdowns
            this.updateAcademicYearDropdowns();
        } catch (error) {
            console.error('Error loading academic years:', error);
        }
    }

    updateStudentDropdowns() {
        const dropdowns = ['studentSelect'];
        dropdowns.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Select Student</option>' +
                    this.students.map(s => `<option value="${s.student_id}">${s.admission_number} - ${s.first_name} ${s.last_name}</option>`).join('');
            }
        });
    }

    updateClassDropdowns() {
        const dropdowns = ['classFilter'];
        dropdowns.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">All Classes</option>' +
                    this.classes.map(c => `<option value="${c.class_id}">${c.class_name}</option>`).join('');
            }
        });
    }

    updatePaymentMethodDropdowns() {
        const dropdowns = ['paymentMethod'];
        dropdowns.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Select Method</option>' +
                    this.paymentMethods.map(m => `<option value="${m.method_id}">${m.method_name}</option>`).join('');
            }
        });
    }

    updateAcademicYearDropdowns() {
        const dropdowns = ['academicYearSelect'];
        dropdowns.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Select Year</option>' +
                    this.academicYears.map(y => `<option value="${y.year_id}">${y.year_name}</option>`).join('');
            }
        });
    }

    async loadFeeCollectionData() {
        // Load students for fee collection
        await this.loadStudents();
        await this.loadAcademicYears();
        await this.loadPaymentMethods();
    }

    async loadFeeReceipts() {
        try {
            const response = await fetch('/api/fee-receipts');
            const receipts = await response.json();
            
            const tbody = document.getElementById('receiptsTableBody');
            if (tbody) {
                tbody.innerHTML = receipts.map(receipt => `
                    <tr>
                        <td>${receipt.receipt_number}</td>
                        <td>${new Date(receipt.payment_date).toLocaleDateString()}</td>
                        <td>${receipt.first_name} ${receipt.last_name}</td>
                        <td>${receipt.class_name || 'N/A'}</td>
                        <td class="fee-amount">${this.formatCurrency(receipt.paid_amount)}</td>
                        <td>${receipt.method_name || 'N/A'}</td>
                        <td><span class="status-badge ${receipt.status.toLowerCase()}">${receipt.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="app.viewReceipt(${receipt.receipt_id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.printReceipt(${receipt.receipt_id})">
                                <i class="fas fa-print"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading fee receipts:', error);
        }
    }

    async loadFeeStructures() {
        try {
            const response = await fetch('/api/fee-structures');
            const structures = await response.json();
            this.feeStructures = structures;
            
            const container = document.querySelector('.fee-structures-grid');
            if (container) {
                container.innerHTML = structures.map(structure => `
                    <div class="fee-structure-card">
                        <div class="structure-header">
                            <h3>${structure.structure_name}</h3>
                            <span class="class-badge">${structure.class_name}</span>
                        </div>
                        <div class="structure-details">
                            <div class="detail-row">
                                <span>Academic Year:</span>
                                <span>${structure.year_name}</span>
                            </div>
                            <div class="detail-row">
                                <span>Total Annual Fee:</span>
                                <span class="fee-amount">${this.formatCurrency(structure.total_annual_fee)}</span>
                            </div>
                        </div>
                        <div class="structure-actions">
                            <button class="btn btn-sm btn-primary" onclick="app.editFeeStructure(${structure.structure_id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.viewFeeStructure(${structure.structure_id})">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading fee structures:', error);
        }
    }

    async loadReports() {
        await Promise.all([
            this.loadCollectionSummary(),
            this.loadMonthlyCollection(),
            this.loadOverdueStudents()
        ]);
    }

    async loadCollectionSummary() {
        try {
            const response = await fetch('/api/reports/collection-summary');
            const data = await response.json();
            
            // Update collection summary chart or table
            console.log('Collection Summary:', data);
        } catch (error) {
            console.error('Error loading collection summary:', error);
        }
    }

    async loadMonthlyCollection() {
        try {
            const response = await fetch('/api/reports/monthly-collection');
            const data = await response.json();
            
            // Update monthly collection chart
            console.log('Monthly Collection:', data);
        } catch (error) {
            console.error('Error loading monthly collection:', error);
        }
    }

    async loadOverdueStudents() {
        try {
            const response = await fetch('/api/reports/overdue-students');
            const students = await response.json();
            
            const tbody = document.getElementById('overdueTableBody');
            if (tbody) {
                tbody.innerHTML = students.map(student => `
                    <tr>
                        <td>${student.admission_number}</td>
                        <td>${student.first_name} ${student.last_name}</td>
                        <td>${student.class_name}</td>
                        <td class="fee-amount">${this.formatCurrency(student.total_fee)}</td>
                        <td class="fee-amount positive">${this.formatCurrency(student.paid_amount)}</td>
                        <td class="fee-amount negative">${this.formatCurrency(student.balance_amount)}</td>
                        <td>${student.parent_name}<br>${student.parent_phone}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="app.collectFee(${student.student_id})">
                                <i class="fas fa-hand-holding-usd"></i>
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="app.sendReminder(${student.student_id})">
                                <i class="fas fa-bell"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading overdue students:', error);
        }
    }

    async loadReminders() {
        try {
            const response = await fetch('/api/fee-reminders');
            const reminders = await response.json();
            
            const container = document.querySelector('.reminders-list');
            if (container) {
                container.innerHTML = reminders.map(reminder => `
                    <div class="reminder-item">
                        <div class="reminder-header">
                            <h4>${reminder.first_name} ${reminder.last_name}</h4>
                            <span class="reminder-date">Due: ${new Date(reminder.due_date).toLocaleDateString()}</span>
                        </div>
                        <div class="reminder-details">
                            <p>Class: ${reminder.class_name}</p>
                            <p>Amount: ${this.formatCurrency(reminder.due_amount)}</p>
                            <p>Category: ${reminder.category_name || 'General'}</p>
                        </div>
                        <div class="reminder-actions">
                            <button class="btn btn-sm btn-primary" onclick="app.collectFee(${reminder.student_id})">
                                <i class="fas fa-hand-holding-usd"></i> Collect Now
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.sendReminder(${reminder.student_id})">
                                <i class="fas fa-paper-plane"></i> Send Reminder
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    }

    async loadStudentFeeDetails(studentId) {
        if (!studentId) {
            document.getElementById('studentFeeDetails').classList.add('hidden');
            return;
        }

        const student = this.students.find(s => s.student_id == studentId);
        if (student) {
            document.getElementById('totalFeeAmount').textContent = this.formatCurrency(student.total_fee);
            document.getElementById('paidFeeAmount').textContent = this.formatCurrency(student.total_paid || 0);
            document.getElementById('balanceFeeAmount').textContent = this.formatCurrency(student.balance_amount);
            document.getElementById('amountToPay').value = student.balance_amount;
            document.getElementById('studentFeeDetails').classList.remove('hidden');
        }
    }

    // Modal functions
    showAddStudentModal() {
        this.openModal('addStudentModal');
    }

    showFeeCollectionModal() {
        this.openModal('feeCollectionModal');
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
            fullName: formData.get('fullName'),
            admissionNumber: formData.get('admissionNumber'),
            rollNumber: formData.get('rollNumber'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            dateOfBirth: formData.get('dateOfBirth'),
            gender: formData.get('gender'),
            classId: formData.get('classId'),
            academicYearId: formData.get('academicYearId'),
            totalFee: formData.get('totalFee'),
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

    async processPayment() {
        const studentId = document.getElementById('studentSelect').value;
        const academicYearId = document.getElementById('academicYearSelect').value;
        const paymentDate = document.getElementById('paymentDate').value;
        const amountToPay = parseFloat(document.getElementById('amountToPay').value);
        const paymentMethodId = document.getElementById('paymentMethod').value;
        const discountAmount = parseFloat(document.getElementById('discountAmount').value) || 0;
        const transactionId = document.getElementById('transactionId').value;
        const chequeNumber = document.getElementById('chequeNumber').value;
        const bankName = document.getElementById('bankName').value;
        const remarks = document.getElementById('paymentRemarks').value;

        if (!studentId || !academicYearId || !paymentDate || !amountToPay || !paymentMethodId) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        const student = this.students.find(s => s.student_id == studentId);
        if (!student) {
            this.showToast('Student not found', 'error');
            return;
        }

        const paymentBreakdown = [{
            assignmentId: 1, // This would come from fee structure
            categoryId: 1,  // This would come from fee structure
            amount: student.total_fee,
            paidAmount: amountToPay,
            discountAmount: discountAmount,
            forMonth: new Date().toLocaleString('default', { month: 'long' })
        }];

        this.showLoading(true);

        try {
            const response = await fetch('/api/fee-receipts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    academicYearId,
                    totalAmount: student.total_fee,
                    paidAmount: amountToPay,
                    discountAmount,
                    fineAmount: 0,
                    paymentDate,
                    paymentMethodId,
                    transactionId,
                    chequeNumber,
                    bankName,
                    remarks,
                    paymentBreakdown
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showToast(`Payment processed successfully! Receipt: ${result.receiptNumber}`);
                
                // Reset form
                document.getElementById('studentSelect').value = '';
                document.getElementById('amountToPay').value = '';
                document.getElementById('discountAmount').value = '';
                document.getElementById('transactionId').value = '';
                document.getElementById('chequeNumber').value = '';
                document.getElementById('bankName').value = '';
                document.getElementById('paymentRemarks').value = '';
                document.getElementById('studentFeeDetails').classList.add('hidden');
                
                // Reload data
                await this.loadStudents();
                await this.loadDashboardStats();
                
                // Show receipt
                this.viewReceipt(result.receiptId);
            } else {
                this.showToast(result.error || 'Failed to process payment', 'error');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            this.showToast('Server error. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Utility functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    }

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
        // Check if user is already logged in
        this.showLoginScreen();
    }

    // Placeholder functions for actions
    collectFee(studentId) {
        this.navigateToPage('fee-collection');
        setTimeout(() => {
            document.getElementById('studentSelect').value = studentId;
            this.loadStudentFeeDetails(studentId);
        }, 100);
    }

    viewStudentDetails(studentId) {
        const student = this.students.find(s => s.student_id == studentId);
        if (student) {
            this.showToast(`Viewing details for ${student.first_name} ${student.last_name}`);
        }
    }

    viewReceipt(receiptId) {
        this.showToast(`Viewing receipt ${receiptId}`);
    }

    printReceipt(receiptId) {
        this.showToast(`Printing receipt ${receiptId}`);
    }

    editFeeStructure(structureId) {
        this.showToast(`Edit fee structure ${structureId}`);
    }

    viewFeeStructure(structureId) {
        this.showToast(`View fee structure ${structureId}`);
    }

    sendReminder(studentId) {
        this.showToast(`Sending reminder to student ${studentId}`);
    }

    generateReceipt() {
        this.showToast('Generate receipt - Functionality to be implemented');
    }

    viewReports() {
        this.navigateToPage('reports');
    }

    filterStudents() {
        this.showToast('Filter students - Functionality to be implemented');
    }

    filterReceipts() {
        this.showToast('Filter receipts - Functionality to be implemented');
    }

    sendReminders() {
        this.showToast('Send reminders to all students');
    }

    exportOverdueList() {
        this.showToast('Export overdue list - Functionality to be implemented');
    }
}

// Global functions for onclick handlers
window.showAddStudentModal = () => app.showAddStudentModal();
window.showFeeCollectionModal = () => app.showFeeCollectionModal();
window.addStudent = () => app.addStudent();
window.processPayment = () => app.processPayment();
window.closeModal = (modalId) => app.closeModal(modalId);
window.generateReceipt = () => app.generateReceipt();
window.viewReports = () => app.viewReports();
window.filterStudents = () => app.filterStudents();
window.filterReceipts = () => app.filterReceipts();
window.sendReminders = () => app.sendReminders();
window.exportOverdueList = () => app.exportOverdueList();

// Initialize the application
const app = new StudentFeesManagementSystem();

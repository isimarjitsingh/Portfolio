// Student Fees Management System - Frontend JavaScript (Fixed Version)
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
        try {
            // Login form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }

            // Navigation
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = item.dataset.page;
                    if (page) {
                        this.navigateToPage(page);
                    }
                });
            });

            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.handleLogout();
                });
            }

            // Menu toggle
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    const sidebar = document.querySelector('.sidebar');
                    if (sidebar) {
                        sidebar.classList.toggle('active');
                    }
                });
            }

            // Modal overlay click
            const modalOverlay = document.getElementById('modalOverlay');
            if (modalOverlay) {
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === e.currentTarget) {
                        this.closeAllModals();
                    }
                });
            }

            // Student selection for fee collection
            const studentSelect = document.getElementById('studentSelect');
            if (studentSelect) {
                studentSelect.addEventListener('change', (e) => {
                    this.loadStudentFeeDetails(e.target.value);
                });
            }

            // Set today's date for payment
            const paymentDateInput = document.getElementById('paymentDate');
            if (paymentDateInput) {
                paymentDateInput.value = new Date().toISOString().split('T')[0];
            }
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    async handleLogin() {
        try {
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;

            if (!username || !password) {
                this.showToast('Please enter both username and password', 'error');
                return;
            }

            this.showLoading(true);

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
        const loginScreen = document.getElementById('loginScreen');
        const dashboardScreen = document.getElementById('dashboardScreen');
        
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (dashboardScreen) dashboardScreen.classList.add('hidden');
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }

    showDashboard() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboardScreen = document.getElementById('dashboardScreen');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (dashboardScreen) dashboardScreen.classList.remove('hidden');
        
        // Update user info
        const userNameElement = document.getElementById('userName');
        const userRoleElement = document.getElementById('userRole');
        
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.full_name || this.currentUser.username;
        }
        if (userRoleElement) {
            userRoleElement.textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
        }
        
        // Load dashboard data
        this.loadDashboardStats();
        this.loadInitialData();
    }

    navigateToPage(page) {
        try {
            // Update navigation
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
            });
            
            const activeNavItem = document.querySelector(`[data-page="${page}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }

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
            
            const pageTitleElement = document.getElementById('pageTitle');
            if (pageTitleElement) {
                pageTitleElement.textContent = titles[page] || 'Dashboard';
            }

            // Show/hide pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(p => {
                p.classList.remove('active');
            });
            
            const targetPage = document.getElementById(`${page}Page`);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            this.currentPage = page;

            // Load page-specific data
            this.loadPageData(page);
        } catch (error) {
            console.error('Error navigating to page:', error);
        }
    }

    async loadPageData(page) {
        try {
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
        } catch (error) {
            console.error(`Error loading page data for ${page}:`, error);
        }
    }

    async loadDashboardStats() {
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();
            
            const totalStudentsElement = document.getElementById('totalStudents');
            const totalFeesElement = document.getElementById('totalFees');
            const collectedFeesElement = document.getElementById('collectedFees');
            const pendingFeesElement = document.getElementById('pendingFees');
            
            if (totalStudentsElement) totalStudentsElement.textContent = data.totalStudents || 0;
            if (totalFeesElement) totalFeesElement.textContent = this.formatCurrency(data.totalFees || 0);
            if (collectedFeesElement) collectedFeesElement.textContent = this.formatCurrency(data.collectedFees || 0);
            if (pendingFeesElement) pendingFeesElement.textContent = this.formatCurrency(data.pendingFees || 0);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async loadInitialData() {
        try {
            // Load data for dropdowns
            await Promise.all([
                this.loadStudents(),
                this.loadClasses(),
                this.loadPaymentMethods(),
                this.loadAcademicYears()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
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
                        <td>${student.admission_number || 'N/A'}</td>
                        <td>${student.first_name || ''} ${student.last_name || ''}</td>
                        <td>${student.class_name || 'N/A'}</td>
                        <td class="fee-amount">${this.formatCurrency(student.total_fee || 0)}</td>
                        <td class="fee-amount positive">${this.formatCurrency(student.total_paid || 0)}</td>
                        <td class="fee-amount ${student.balance_amount > 0 ? 'negative' : 'positive'}">${this.formatCurrency(student.balance_amount || 0)}</td>
                        <td><span class="status-badge ${student.status?.toLowerCase() || 'active'}">${student.status || 'Active'}</span></td>
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
                    this.students.map(s => `<option value="${s.student_id}">${s.admission_number || 'N/A'} - ${s.first_name || ''} ${s.last_name || ''}</option>`).join('');
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
        try {
            // Load students for fee collection
            await this.loadStudents();
            await this.loadAcademicYears();
            await this.loadPaymentMethods();
        } catch (error) {
            console.error('Error loading fee collection data:', error);
        }
    }

    async loadFeeReceipts() {
        try {
            const response = await fetch('/api/fee-receipts');
            const receipts = await response.json();
            
            const tbody = document.getElementById('receiptsTableBody');
            if (tbody) {
                tbody.innerHTML = receipts.map(receipt => `
                    <tr>
                        <td>${receipt.receipt_number || 'N/A'}</td>
                        <td>${receipt.payment_date ? new Date(receipt.payment_date).toLocaleDateString() : 'N/A'}</td>
                        <td>${receipt.first_name || ''} ${receipt.last_name || ''}</td>
                        <td>${receipt.class_name || 'N/A'}</td>
                        <td class="fee-amount">${this.formatCurrency(receipt.paid_amount || 0)}</td>
                        <td>${receipt.method_name || 'N/A'}</td>
                        <td><span class="status-badge ${receipt.status?.toLowerCase() || 'paid'}">${receipt.status || 'Paid'}</span></td>
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
                            <h3>${structure.structure_name || 'N/A'}</h3>
                            <span class="class-badge">${structure.class_name || 'N/A'}</span>
                        </div>
                        <div class="structure-details">
                            <div class="detail-row">
                                <span>Academic Year:</span>
                                <span>${structure.year_name || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span>Total Annual Fee:</span>
                                <span class="fee-amount">${this.formatCurrency(structure.total_annual_fee || 0)}</span>
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
        try {
            await Promise.all([
                this.loadCollectionSummary(),
                this.loadMonthlyCollection(),
                this.loadOverdueStudents()
            ]);
        } catch (error) {
            console.error('Error loading reports:', error);
        }
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
                        <td>${student.admission_number || 'N/A'}</td>
                        <td>${student.first_name || ''} ${student.last_name || ''}</td>
                        <td>${student.class_name || 'N/A'}</td>
                        <td class="fee-amount">${this.formatCurrency(student.total_fee || 0)}</td>
                        <td class="fee-amount positive">${this.formatCurrency(student.paid_amount || 0)}</td>
                        <td class="fee-amount negative">${this.formatCurrency(student.balance_amount || 0)}</td>
                        <td>${student.parent_name || 'N/A'}<br>${student.parent_phone || 'N/A'}</td>
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
                            <h4>${reminder.first_name || ''} ${reminder.last_name || ''}</h4>
                            <span class="reminder-date">Due: ${reminder.due_date ? new Date(reminder.due_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div class="reminder-details">
                            <p>Class: ${reminder.class_name || 'N/A'}</p>
                            <p>Amount: ${this.formatCurrency(reminder.due_amount || 0)}</p>
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
            const studentFeeDetails = document.getElementById('studentFeeDetails');
            if (studentFeeDetails) studentFeeDetails.classList.add('hidden');
            return;
        }

        const student = this.students.find(s => s.student_id == studentId);
        if (student) {
            const totalFeeAmountElement = document.getElementById('totalFeeAmount');
            const paidFeeAmountElement = document.getElementById('paidFeeAmount');
            const balanceFeeAmountElement = document.getElementById('balanceFeeAmount');
            const amountToPayElement = document.getElementById('amountToPay');
            const studentFeeDetailsElement = document.getElementById('studentFeeDetails');
            
            if (totalFeeAmountElement) totalFeeAmountElement.textContent = this.formatCurrency(student.total_fee || 0);
            if (paidFeeAmountElement) paidFeeAmountElement.textContent = this.formatCurrency(student.total_paid || 0);
            if (balanceFeeAmountElement) balanceFeeAmountElement.textContent = this.formatCurrency(student.balance_amount || 0);
            if (amountToPayElement) amountToPayElement.value = student.balance_amount || 0;
            if (studentFeeDetailsElement) studentFeeDetailsElement.classList.remove('hidden');
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
        const modalOverlay = document.getElementById('modalOverlay');
        const modal = document.getElementById(modalId);
        
        if (modalOverlay) modalOverlay.classList.remove('hidden');
        if (modal) modal.classList.remove('hidden');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
        this.checkAndCloseOverlay();
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.add('hidden');
    }

    checkAndCloseOverlay() {
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modals.length === 0 && modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    }

    // Form submissions
    async addStudent() {
        try {
            const form = document.getElementById('addStudentForm');
            if (!form) {
                this.showToast('Form not found', 'error');
                return;
            }
            
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
        try {
            const studentId = document.getElementById('studentSelect')?.value;
            const academicYearId = document.getElementById('academicYearSelect')?.value;
            const paymentDate = document.getElementById('paymentDate')?.value;
            const amountToPay = parseFloat(document.getElementById('amountToPay')?.value || 0);
            const paymentMethodId = document.getElementById('paymentMethod')?.value;
            const discountAmount = parseFloat(document.getElementById('discountAmount')?.value || 0);
            const transactionId = document.getElementById('transactionId')?.value;
            const chequeNumber = document.getElementById('chequeNumber')?.value;
            const bankName = document.getElementById('bankName')?.value;
            const remarks = document.getElementById('paymentRemarks')?.value;

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
                amount: student.total_fee || 0,
                paidAmount: amountToPay,
                discountAmount: discountAmount,
                forMonth: new Date().toLocaleString('default', { month: 'long' })
            }];

            this.showLoading(true);

            const response = await fetch('/api/fee-receipts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    academicYearId,
                    totalAmount: student.total_fee || 0,
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
                const studentSelect = document.getElementById('studentSelect');
                const amountToPayInput = document.getElementById('amountToPay');
                const discountAmountInput = document.getElementById('discountAmount');
                const transactionIdInput = document.getElementById('transactionId');
                const chequeNumberInput = document.getElementById('chequeNumber');
                const bankNameInput = document.getElementById('bankName');
                const paymentRemarksInput = document.getElementById('paymentRemarks');
                const studentFeeDetails = document.getElementById('studentFeeDetails');
                
                if (studentSelect) studentSelect.value = '';
                if (amountToPayInput) amountToPayInput.value = '';
                if (discountAmountInput) discountAmountInput.value = '';
                if (transactionIdInput) transactionIdInput.value = '';
                if (chequeNumberInput) chequeNumberInput.value = '';
                if (bankNameInput) bankNameInput.value = '';
                if (paymentRemarksInput) paymentRemarksInput.value = '';
                if (studentFeeDetails) studentFeeDetails.classList.add('hidden');
                
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
        try {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2
            }).format(amount || 0);
        } catch (error) {
            console.error('Error formatting currency:', error);
            return `₹${(amount || 0).toFixed(2)}`;
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            if (show) {
                spinner.classList.remove('hidden');
            } else {
                spinner.classList.add('hidden');
            }
        }
    }

    showToast(message, type = 'success') {
        try {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            const icon = toast?.querySelector('i');
            
            if (toast && toastMessage) {
                toastMessage.textContent = message;
                
                // Update icon based on type
                if (icon) {
                    icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
                    icon.style.color = type === 'error' ? 'var(--danger-color)' : 'var(--success-color)';
                }
                
                toast.classList.remove('hidden');
                
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 3000);
            }
        } catch (error) {
            console.error('Error showing toast:', error);
            alert(message); // Fallback
        }
    }

    checkAuthStatus() {
        // Check if user is already logged in
        this.showLoginScreen();
    }

    // Placeholder functions for actions
    collectFee(studentId) {
        this.navigateToPage('fee-collection');
        setTimeout(() => {
            const studentSelect = document.getElementById('studentSelect');
            if (studentSelect) {
                studentSelect.value = studentId;
                this.loadStudentFeeDetails(studentId);
            }
        }, 100);
    }

    viewStudentDetails(studentId) {
        const student = this.students.find(s => s.student_id == studentId);
        if (student) {
            this.showToast(`Viewing details for ${student.first_name || ''} ${student.last_name || ''}`);
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
window.showAddStudentModal = () => app?.showAddStudentModal();
window.showFeeCollectionModal = () => app?.showFeeCollectionModal();
window.addStudent = () => app?.addStudent();
window.processPayment = () => app?.processPayment();
window.closeModal = (modalId) => app?.closeModal(modalId);
window.generateReceipt = () => app?.generateReceipt();
window.viewReports = () => app?.viewReports();
window.filterStudents = () => app?.filterStudents();
window.filterReceipts = () => app?.filterReceipts();
window.sendReminders = () => app?.sendReminders();
window.exportOverdueList = () => app?.exportOverdueList();

// Initialize the application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    try {
        app = new StudentFeesManagementSystem();
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading
} else {
    // DOM is already loaded
    if (!app) {
        try {
            app = new StudentFeesManagementSystem();
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }
}

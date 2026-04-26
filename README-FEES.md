# Student Fees Management System

A professional and modern Student Fees Management System built with Node.js, Express, Oracle SQL Plus backend, and a responsive HTML/CSS/JavaScript frontend specifically designed for educational institutions to manage student fee collection and financial operations.

## Features

- **User Authentication**: Secure login system for Admin, Accountant, Students, and Parents
- **Student Management**: Complete student registration and fee assignment
- **Fee Collection**: Efficient fee collection with multiple payment methods
- **Receipt Generation**: Automatic receipt generation with unique numbers
- **Fee Structures**: Flexible fee structure management for different classes
- **Payment Tracking**: Comprehensive payment history and tracking
- **Reporting & Analytics**: Detailed financial reports and dashboards
- **Fee Reminders**: Automated reminder system for overdue payments
- **Concession Management**: Student fee concessions and scholarships
- **Multi-Payment Methods**: Support for cash, cheque, bank transfer, online payments
- **Academic Year Management**: Year-wise fee management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Oracle SQL Plus** - Database
- **oracledb** - Oracle driver for Node.js
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Google Fonts (Inter)** - Typography

### Database
- **Oracle Database** - Relational database management
- **SQL Plus** - Database interface

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- Oracle Database (11g or higher)
- Oracle SQL Plus client
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd student-fees-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### a. Configure Oracle Connection
Copy the environment file and update with your Oracle credentials:
```bash
cp .env.example .env
```

Edit `.env` file with your Oracle database details:
```env
# Oracle Database Connection Configuration
ORACLE_CONNECTION_STRING=localhost:1521/XE
ORACLE_USER=your_username
ORACLE_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### b. Initialize Database
1. Connect to your Oracle database using SQL Plus:
```bash
sqlplus your_username/your_password@your_connection_string
```

2. Run the setup script:
```sql
@database/fees-setup.sql
```

This will create all necessary tables, sequences, triggers, views, stored procedures, and sample data for the fees management system.

### 4. Start the Application
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:3000/fees-index.html
```

## Demo Credentials

The system comes with pre-configured demo accounts:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Accountant | accountant | acc123 |
| Student | student1 | stud123 |
| Parent | parent1 | par123 |

## Database Schema

The system includes the following main tables for fee management:

- **users** - Authentication and user management
- **academic_years** - Academic year management
- **classes** - Class information with fee structures
- **students** - Student information and fee records
- **fee_categories** - Fee categories (Tuition, Transport, Lab, etc.)
- **fee_structures** - Complete fee structures for classes
- **fee_assignments** - Fee structure to category assignments
- **fee_concessions** - Student concessions and scholarships
- **payment_methods** - Available payment methods
- **fee_receipts** - Payment receipts and transactions
- **fee_payments** - Detailed payment breakdown
- **payment_history** - Audit trail for all payment operations
- **fee_reminders** - Automated fee reminders

### Key Features
- Auto-incrementing IDs using sequences and triggers
- Foreign key constraints for data integrity
- Views for common queries and reporting
- Stored procedures for complex fee operations
- Indexes for performance optimization
- Triggers for automatic balance updates

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student

### Classes
- `GET /api/classes` - Get all classes

### Fee Management
- `GET /api/fee-categories` - Get fee categories
- `GET /api/fee-structures` - Get fee structures
- `GET /api/payment-methods` - Get payment methods

### Fee Receipts
- `GET /api/fee-receipts` - Get fee receipts
- `POST /api/fee-receipts` - Create new fee receipt

### Reports
- `GET /api/reports/collection-summary` - Collection summary by class
- `GET /api/reports/monthly-collection` - Monthly collection reports
- `GET /api/reports/overdue-students` - Overdue students list

### Academic Years
- `GET /api/academic-years` - Get academic years

### Reminders
- `GET /api/fee-reminders` - Get fee reminders

## Frontend Structure

### Pages
- **Dashboard** - Overview with financial statistics and quick actions
- **Students** - Student management with fee tracking
- **Fee Collection** - Fee collection interface with payment processing
- **Fee Receipts** - Receipt history and management
- **Fee Structures** - Fee structure management
- **Reports** - Financial reports and analytics
- **Reminders** - Fee reminder management

### Components
- **Responsive Sidebar Navigation**
- **Modal Forms** - For adding students and processing payments
- **Data Tables** - With sorting and filtering
- **Dashboard Cards** - Financial statistics and metrics
- **Toast Notifications** - User feedback
- **Loading Spinners** - Loading states

## Styling and Design

The application features:
- **Modern, Professional Design** - Clean and intuitive interface
- **Responsive Layout** - Works on all device sizes
- **Color Scheme** - Professional blue theme with financial focus
- **Animations** - Smooth transitions and hover effects
- **Typography** - Clear, readable fonts
- **Icons** - Font Awesome icons throughout
- **Cards** - Material Design-inspired cards
- **Forms** - Styled input fields and buttons

## Fee Management Features

### Fee Collection
- **Multiple Payment Methods**: Cash, Cheque, Bank Transfer, Online Payment, UPI
- **Automatic Receipt Generation**: Unique receipt numbers with date stamps
- **Discount Management**: Apply discounts during payment
- **Fine Calculation**: Automatic fine calculation for late payments
- **Payment Breakdown**: Detailed payment breakdown by fee category

### Fee Structures
- **Class-wise Fee Structures**: Different fee structures for different classes
- **Fee Categories**: Tuition, Transport, Lab, Library, Sports, Examination fees
- **Flexible Payment Frequencies**: Monthly, Quarterly, Half-Yearly, Yearly, One-Time
- **Concession Management**: Scholarships and fee concessions

### Reporting
- **Collection Summary**: Class-wise collection reports
- **Monthly Collections**: Month-wise collection trends
- **Overdue Students**: List of students with pending fees
- **Payment History**: Complete audit trail of all transactions
- **Financial Analytics**: Visual charts and graphs

## Configuration

### Environment Variables
- `ORACLE_CONNECTION_STRING` - Oracle database connection string
- `ORACLE_USER` - Database username
- `ORACLE_PASSWORD` - Database password
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Oracle Connection String Format
```
hostname:port/service_name
```
Example: `localhost:1521/XE`

## Security Features

- Password hashing (implement in production)
- Role-based access control
- Input validation
- SQL injection prevention
- CORS protection
- Session management (implement in production)
- Audit trail for all financial transactions

## Development

### Project Structure
```
student-fees-management-system/
├── database/
│   ├── fees-schema.sql           # Database schema
│   └── fees-setup.sql            # Setup script
├── public/
│   ├── css/
│   │   └── fees-style.css        # Stylesheets
│   ├── js/
│   │   └── fees-app.js           # Frontend JavaScript
│   └── fees-index.html          # Main HTML file
├── fees-server.js                # Express server
├── fees-package.json             # Dependencies
├── .env.example                  # Environment template
└── README-FEES.md               # This file
```

### Adding New Features
1. Update database schema if needed
2. Add API endpoints in `fees-server.js`
3. Update frontend in `public/` directory
4. Test thoroughly

## Production Deployment

### Security Considerations
- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting
- Use connection pooling for database

### Performance Optimization
- Enable database connection pooling
- Implement caching strategies
- Optimize database queries
- Use CDN for static assets
- Enable GZIP compression

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify Oracle database is running
- Check connection string format
- Ensure correct credentials in `.env`
- Verify network connectivity

#### Oracle Client Issues
- Install Oracle Instant Client
- Set proper environment variables
- Verify Oracle client libraries

#### Payment Processing Issues
- Check fee structure assignments
- Verify student balance calculations
- Ensure proper receipt number generation

### Getting Help
1. Check the console for error messages
2. Verify database connection
3. Check Oracle SQL Plus connectivity
4. Review environment variables

## Advanced Features

### Stored Procedures
- `add_student_fee()` - Process fee payments
- `generate_fee_reminder()` - Create fee reminders
- `calculate_student_balance()` - Update student balances
- `cancel_fee_receipt()` - Cancel and refund payments

### Database Views
- `student_fee_summary` - Complete student fee overview
- `fee_receipt_details` - Detailed receipt information
- `class_fee_collection` - Class-wise collection statistics
- `monthly_fee_collection` - Monthly collection trends
- `overdue_students` - Students with pending fees

### Triggers
- Automatic receipt number generation
- Student balance updates on payment
- Payment history audit trail

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Note**: This is a comprehensive demonstration system. For production use, implement additional security measures, error handling, and testing.

# School Management System

A professional and modern School Management System built with Node.js, Express, Oracle SQL Plus backend, and a responsive HTML/CSS/JavaScript frontend.

## Features

- **User Authentication**: Secure login system for Admin, Teachers, and Students
- **Student Management**: Add, edit, and manage student records
- **Teacher Management**: Manage teacher information and assignments
- **Class Management**: Organize classes and schedules
- **Subject Management**: Manage curriculum and subjects
- **Attendance System**: Track and manage student attendance
- **Grade Management**: Record and analyze student performance
- **Dashboard**: Real-time statistics and overview
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
cd school-management-system
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
@database/setup.sql
```

This will create all necessary tables, sequences, triggers, views, and sample data.

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
http://localhost:3000
```

## Demo Credentials

The system comes with pre-configured demo accounts:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Teacher | john_teacher | teacher123 |
| Student | student1 | student123 |

## Database Schema

The system includes the following main tables:

- **users** - Authentication and user management
- **students** - Student information and records
- **teachers** - Teacher profiles and details
- **departments** - Academic departments
- **classes** - Class information and assignments
- **subjects** - Subject and curriculum data
- **attendance** - Student attendance records
- **grades** - Student grades and performance
- **enrollments** - Student-class relationships

### Key Features
- Auto-incrementing IDs using sequences and triggers
- Foreign key constraints for data integrity
- Views for common queries
- Stored procedures for complex operations
- Indexes for performance optimization

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student

### Teachers
- `GET /api/teachers` - Get all teachers

### Classes
- `GET /api/classes` - Get all classes

### Subjects
- `GET /api/subjects` - Get all subjects

### Attendance
- `GET /api/attendance/:classId/:date` - Get attendance for class/date
- `POST /api/attendance` - Mark attendance

### Grades
- `GET /api/grades/:studentId` - Get student grades
- `POST /api/grades` - Add grade

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Frontend Structure

### Pages
- **Dashboard** - Overview with statistics and quick actions
- **Students** - Student management interface
- **Teachers** - Teacher management interface
- **Classes** - Class management interface
- **Subjects** - Subject management interface
- **Attendance** - Attendance tracking interface
- **Grades** - Grade management interface

### Components
- **Responsive Sidebar Navigation**
- **Modal Forms** - For adding/editing records
- **Data Tables** - With sorting and filtering
- **Dashboard Cards** - Statistics and metrics
- **Toast Notifications** - User feedback
- **Loading Spinners** - Loading states

## Styling and Design

The application features:
- **Modern, Professional Design** - Clean and intuitive interface
- **Responsive Layout** - Works on all device sizes
- **Color Scheme** - Professional blue/indigo theme
- **Animations** - Smooth transitions and hover effects
- **Typography** - Clear, readable fonts
- **Icons** - Font Awesome icons throughout
- **Cards** - Material Design-inspired cards
- **Forms** - Styled input fields and buttons

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

## Development

### Project Structure
```
school-management-system/
├── database/
│   ├── schema.sql          # Database schema
│   └── setup.sql           # Setup script
├── public/
│   ├── css/
│   │   └── style.css       # Stylesheets
│   ├── js/
│   │   └── app.js          # Frontend JavaScript
│   └── index.html          # Main HTML file
├── server.js               # Express server
├── package.json            # Dependencies
├── .env.example            # Environment template
└── README.md               # This file
```

### Adding New Features
1. Update database schema if needed
2. Add API endpoints in `server.js`
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

#### Port Issues
- Check if port 3000 is available
- Modify PORT in `.env` if needed
- Check firewall settings

### Getting Help
1. Check the console for error messages
2. Verify database connection
3. Check Oracle SQL Plus connectivity
4. Review environment variables

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

**Note**: This is a demonstration system. For production use, implement additional security measures, error handling, and testing.

# Student Social Platform

A MERN stack social platform designed for students to share their study progress, write blogs, and share photos. Similar to Instagram but focused on academic life and learning journeys.

## Features

- **User Authentication**: Register, login, and profile management
- **Study Progress Sharing**: Track and share academic progress with categories like courses, projects, research, and skills
- **Blog System**: Write and share educational content with categories like study tips, technical tutorials, and career advice
- **Photo Sharing**: Upload and share study-related photos with categories like study setups, campus life, notes, and achievements
- **Social Features**: Like posts, add comments, follow other students
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Express Validator for input validation

## Project Structure

```
student-social-platform/
  frontend/
    src/
      components/      # Reusable components
      pages/          # Page components
      public/         # Static files
    package.json
    tailwind.config.js
  backend/
    models/          # MongoDB schemas
    routes/          # API routes
    middleware/      # Custom middleware
    uploads/         # File upload directory
    server.js        # Main server file
    package.json
    .env
  README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd student-social-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-social-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

#### Start MongoDB
If using local MongoDB:
```bash
mongod
```

#### Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Study Progress
- `GET /api/progress` - Get all public progress posts
- `GET /api/progress/user` - Get current user's progress posts
- `POST /api/progress` - Create new progress post
- `PUT /api/progress/:id` - Update progress post
- `DELETE /api/progress/:id` - Delete progress post
- `POST /api/progress/:id/like` - Like/unlike progress post
- `POST /api/progress/:id/comment` - Add comment to progress post

### Blogs
- `GET /api/blogs` - Get all published blog posts
- `GET /api/blogs/:id` - Get single blog post
- `GET /api/blogs/user` - Get current user's blog posts
- `POST /api/blogs` - Create new blog post
- `PUT /api/blogs/:id` - Update blog post
- `DELETE /api/blogs/:id` - Delete blog post
- `POST /api/blogs/:id/like` - Like/unlike blog post
- `POST /api/blogs/:id/comment` - Add comment to blog post

### Photos
- `GET /api/photos` - Get all public photos
- `GET /api/photos/user` - Get current user's photos
- `POST /api/photos` - Upload new photo
- `PUT /api/photos/:id` - Update photo details
- `DELETE /api/photos/:id` - Delete photo
- `POST /api/photos/:id/like` - Like/unlike photo
- `POST /api/photos/:id/comment` - Add comment to photo

### Users
- `GET /api/users` - Get all users (search/discovery)
- `GET /api/users/:id` - Get user profile by ID
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/:id/followers` - Get user's followers
- `GET /api/users/:id/following` - Get user's following

## Data Models

### User
- name, email, password
- university, major, bio
- followers, following arrays
- profile avatar

### StudyProgress
- user, title, description
- category (course, project, research, skill, exam, assignment)
- progress percentage
- likes and comments arrays

### Blog
- user, title, content, excerpt
- category (study-tips, technical, lifestyle, career, research, tutorials)
- tags, read time
- likes and comments arrays

### Photo
- user, caption, imageUrl
- category (study-setup, campus-life, notes, group-study, achievements, events)
- likes and comments arrays

## Usage

1. **Register**: Create an account with your email, name, university, and major
2. **Share Progress**: Post your study achievements, course completions, or project milestones
3. **Write Blogs**: Share your knowledge and experiences through detailed blog posts
4. **Upload Photos**: Share study setups, campus moments, notes, and achievements
5. **Interact**: Like posts, leave comments, and follow other students
6. **Discover**: Browse content by categories and search for specific topics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Future Enhancements

- Real-time notifications
- Direct messaging between users
- Study groups and collaboration features
- Integration with learning management systems
- Mobile app development
- Advanced analytics and insights
- Study streaks and gamification

## Support

For any questions or issues, please open an issue on the GitHub repository or contact the development team.

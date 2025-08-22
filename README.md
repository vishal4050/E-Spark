# E-Spark ✨

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

## 📖 About

E-Spark is a modern e-learning platform designed to revolutionize online education. Built with cutting-edge technologies, it provides an intuitive and engaging learning experience for students, educators, and institutions.

## ✨ Features

- **Interactive Learning**: Engaging multimedia content with interactive exercises
- **User Management**: Comprehensive user profiles for students and instructors
- **Course Management**: Create, organize, and manage courses with ease
- **Progress Tracking**: Real-time progress monitoring and analytics
- **Discussion Forums**: Collaborative learning through community discussions
- **Mobile Responsive**: Seamless experience across all devices
- **Assessment Tools**: Quizzes, assignments, and automated grading
- **Certification**: Digital certificates upon course completion

## 🚀 Demo

[**Live Application**](https://e-learning-frontend-9zzn.vercel.app/) | [Screenshots](#screenshots)

> **Backend API**: Deployed on Render  
> **Frontend**: Deployed on Vercel

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js / Next.js
- **Styling**: CSS3 / Tailwind CSS / Material-UI
- **State Management**: Redux / Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB / PostgreSQL
- **Authentication**: JWT / OAuth

### File Storage
- **Media Storage**: Local file system (uploads folder)
- **Supported Formats**: Images (JPEG, PNG, GIF) & Videos (MP4, AVI, MOV)

### Additional Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Deployment**: Render (Backend) / Vercel (Frontend)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.0 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) or [PostgreSQL](https://www.postgresql.org/)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishal4050/E-Spark.git
   cd E-Spark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
     PORT=5000
     DB=
     JWT_SECRET=
     PASSWORD=
     GMAIL=
     KEY_ID=
     KEY_SECRET=
     FORGOT_PASSWORD=super_secret_key_here
     frontendurl=http://localhost:5173
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   # or
   npm run migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
E-Spark/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS/SCSS files
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Backend application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Helper functions
│   ├── uploads/           # File storage directory
│   │   ├── images/        # Uploaded images
│   │   └── videos/        # Uploaded videos
│   ├── config/            # Configuration files
│   └── package.json
│
├── docs/                  # Documentation
├── tests/                 # Test files
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/:id` - Get specific course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### File Upload
- `POST /api/upload/image` - Upload course images
- `POST /api/upload/video` - Upload course videos
- `GET /api/uploads/:filename` - Serve uploaded files
- `DELETE /api/upload/:filename` - Delete uploaded file

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 📱 Screenshots

### Dashboard
![Dashboard](path/to/dashboard-screenshot.png)

### Course View
![Course View](path/to/course-screenshot.png)

### Mobile View
![Mobile View](path/to/mobile-screenshot.png)

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Configure build settings**:
   ```
   Build Command: npm install
   Start Command: npm start
   ```
4. **Set environment variables** in Render dashboard
5. **Deploy** - Render will automatically deploy on git push

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```
2. **Connect GitHub repository** to Vercel
3. **Configure project settings**:
   - Framework: React/Next.js
   - Root Directory: client (if applicable)
   - Build Command: npm run build
   - Output Directory: build/dist
4. **Set environment variables** in Vercel dashboard
5. **Deploy** - Auto-deployment on git push

### Environment Variables for Production

Make sure to set these in your deployment platforms:

**Render (Backend)**:
```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://e-learning-frontend-9zzn.vercel.app
```

**Vercel (Frontend)**:
```env
REACT_APP_API_URL=https://your-espark-api.onrender.com
REACT_APP_ENVIRONMENT=production
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Vishal** - *Initial work* - [@vishal4050](https://github.com/vishal4050)

See also the list of [contributors](https://github.com/vishal4050/E-Spark/contributors) who participated in this project.

## 🙏 Acknowledgments

- Thanks to all contributors who helped shape this project
- Inspiration from modern e-learning platforms
- Open source community for amazing tools and libraries

## 📞 Support

If you have any questions or need help, please:

- 📧 Email: [vishal.developer@example.com](mailto:vishal.developer@example.com)
- 🐛 Report issues: [GitHub Issues](https://github.com/vishal4050/E-Spark/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/vishal4050/E-Spark/discussions)
- 🌐 Live App: [E-Spark Learning Platform](https://e-learning-frontend-9zzn.vercel.app/)

## 🔄 Changelog

### [1.0.0] - 2025-01-XX
- Initial release
- Basic course management
- User authentication
- Dashboard implementation

For a detailed changelog, see [CHANGELOG.md](CHANGELOG.md)

---

⭐ **Star this repository if you found it helpful!** ⭐

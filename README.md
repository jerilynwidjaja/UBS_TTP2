# AI-Powered E-Learning Platform

A comprehensive e-learning platform with AI-powered course recommendations, personalized learning paths, and intelligent progress feedback. Built with modern web technologies and OpenAI integration.

## 🚀 Features

### Core Learning Features
- **Interactive Code Editor**: Monaco Editor with multi-language support
- **Real-time Code Execution**: Execute and test code with immediate feedback
- **Progress Tracking**: Detailed analytics on learning progress and performance
- **Multi-difficulty Courses**: Beginner, intermediate, and advanced level content

### AI-Powered Features
- **Intelligent Course Recommendations**: OpenAI GPT-3.5 powered course suggestions
- **Personalized Learning Paths**: AI-generated structured learning journeys
- **Progress Feedback**: Detailed AI analysis of learning patterns and suggestions
- **Adaptive Content**: Recommendations based on user performance and preferences

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **User Preferences**: Customizable learning goals and skill tracking
- **Progress Dashboard**: Comprehensive analytics and insights
- **Authentication**: Secure JWT-based authentication system

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Monaco Editor** - VS Code-powered code editor
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - SQL ORM for database operations
- **SQLite** - Lightweight database for development
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI-powered recommendations and feedback
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── Login.tsx            # Authentication login
│   │   ├── Register.tsx         # User registration
│   │   ├── Profile.tsx          # Main dashboard
│   │   ├── CourseDetail.tsx     # Course overview
│   │   ├── QuestionView.tsx     # Code editor and execution
│   │   ├── ProgressDashboard.tsx # AI analytics dashboard
│   │   └── UserPreferencesModal.tsx # User settings
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication state management
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── server/                       # Backend source code
│   ├── models/                  # Database models
│   │   ├── User.js              # User model
│   │   ├── Course.js            # Course model
│   │   ├── Question.js          # Question model
│   │   ├── UserProgress.js      # Progress tracking model
│   │   └── index.js             # Model associations
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── courses.js           # Course management
│   │   ├── questions.js         # Question handling
│   │   └── progress.js          # Progress analytics
│   ├── services/                # Business logic
│   │   └── aiRecommendationService.js # AI integration
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # JWT authentication
│   ├── seedData.js              # Database seeding
│   └── server.js                # Express server setup
├── package.json                 # Frontend dependencies
├── server/package.json          # Backend dependencies
├── tailwind.config.js           # Tailwind configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elearning-platform
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   # Database
   DATABASE_URL=sqlite:./database.sqlite

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # OpenAI API Configuration
   OPENAI_API_KEY=your-openai-api-key-here

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

5. **Database Setup**
   ```bash
   # From the server directory
   node seedData.js
   ```

6. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🎯 Usage

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Set up your preferences** including skill level, learning goals, and time availability
3. **Explore AI recommendations** tailored to your profile
4. **Start coding** with interactive challenges
5. **Track your progress** with detailed analytics

### Key Features

#### AI Recommendations
- Personalized course suggestions based on your profile
- Intelligent scoring system considering multiple factors
- Adaptive recommendations that evolve with your progress

#### Learning Paths
- Structured, phase-based learning journeys
- Prerequisites and learning objectives for each phase
- Estimated duration and priority levels

#### Progress Analytics
- Completion rates by category and difficulty
- Learning streak tracking
- Recent activity monitoring
- Detailed performance insights

#### Code Challenges
- Multi-language support (JavaScript, Python, Java, C++, etc.)
- Real-time code execution and testing
- Immediate feedback on solutions
- Progress tracking per question

## 🔧 Configuration

### OpenAI Integration
The platform uses OpenAI GPT-3.5 Turbo for:
- Course recommendations
- Learning path generation
- Progress feedback and insights

### Supported Programming Languages
- JavaScript (Node.js)
- Python
- Java
- C++
- C
- C#
- Kotlin
- Ruby
- Rust
- PHP
- Go
- TypeScript
- SQL
- Swift

### Database Schema
- **Users**: Authentication and profile data
- **Courses**: Course metadata and structure
- **Questions**: Coding challenges and test cases
- **UserProgress**: Tracking completion and attempts

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy with your preferred platform
```

### Environment Variables
Ensure all required environment variables are set in production:
- `OPENAI_API_KEY`
- `JWT_SECRET`
- `DATABASE_URL`
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/preferences` - Update user preferences
- `GET /api/auth/profile` - Get user profile

### Course Endpoints
- `GET /api/courses` - Get all courses with progress
- `GET /api/courses/recommended` - Get AI recommendations
- `GET /api/courses/:id` - Get course details

### Question Endpoints
- `GET /api/questions/:id` - Get question details
- `POST /api/questions/:id/submit` - Submit code solution

### Progress Endpoints
- `GET /api/progress/feedback` - Get AI progress feedback
- `GET /api/progress/learning-path` - Get personalized learning path
- `GET /api/progress/analytics` - Get detailed analytics

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 Performance

- Optimized React components with proper memoization
- Efficient database queries with Sequelize
- Code splitting and lazy loading
- Responsive design for all devices

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   - Ensure your OpenAI API key is valid and has sufficient credits
   - Check the `.env` file configuration

2. **Database Connection Issues**
   - Verify SQLite database file permissions
   - Run the seed script to initialize data

3. **CORS Errors**
   - Check that the backend server is running on the correct port
   - Verify CORS configuration in server.js

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-3.5 API
- Monaco Editor team for the excellent code editor
- React and Node.js communities
- All contributors and testers

---

Built with ❤️ using modern web technologies and AI
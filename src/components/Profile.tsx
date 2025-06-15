import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Clock, Target, Star, ChevronRight, Trophy, TrendingUp, Brain, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import UserPreferencesModal from './UserPreferencesModal';
import toast from 'react-hot-toast';

interface CourseProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface RecommendationData {
  score: number;
  reasoning: string;
  factors: Array<{
    name: string;
    score: number;
    weight: number;
  }>;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  category: string;
  estimatedHours: number;
  questions: Array<{ id: number; title: string; difficulty: string }>;
  progress: CourseProgress;
  recommendation?: RecommendationData;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRecommendationDetails, setShowRecommendationDetails] = useState<number | null>(null);

  useEffect(() => {
    if (user && !user.hasPreferences) {
      setShowPreferencesModal(true);
    }
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const [coursesResponse, recommendedResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/courses'),
        axios.get('http://localhost:8000/api/courses/recommended')
      ]);
      
      setCourses(coursesResponse.data.courses);
      setRecommendedCourses(recommendedResponse.data.courses);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  const ProgressBar: React.FC<{ percentage: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
    percentage, 
    size = 'md' 
  }) => {
    const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3';
    
    return (
      <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${heightClass} ${getProgressColor(percentage)} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const RecommendationTooltip: React.FC<{ course: Course }> = ({ course }) => {
    if (!course.recommendation) return null;

    return (
      <div className="absolute z-10 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg top-full left-0 mt-2">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">AI Recommendation Score</span>
            <span className="text-lg font-bold text-blue-600">{course.recommendation.score}/100</span>
          </div>
          <p className="text-sm text-gray-600">{course.recommendation.reasoning}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">Scoring Factors:</h4>
          {course.recommendation.factors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{factor.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <span className="text-gray-800 font-medium w-8">{factor.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CourseCard: React.FC<{ course: Course; isRecommended?: boolean }> = ({ 
    course, 
    isRecommended = false 
  }) => (
    <div className="relative">
      <div
        onClick={() => navigate(`/course/${course.id}`)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <div className="flex items-center gap-2">
            {isRecommended && (
              <>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                {course.recommendation && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRecommendationDetails(
                        showRecommendationDetails === course.id ? null : course.id
                      );
                    }}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Brain className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
            {course.progress.percentage === 100 && (
              <div className="flex items-center text-green-500">
                <Trophy className="h-4 w-4 fill-current" />
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        {/* AI Recommendation Score for recommended courses */}
        {isRecommended && course.recommendation && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Brain className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm font-medium text-blue-800">AI Match Score</span>
              </div>
              <span className="text-sm font-bold text-blue-900">{course.recommendation.score}/100</span>
            </div>
            <p className="text-xs text-blue-700">{course.recommendation.reasoning}</p>
          </div>
        )}
        
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-gray-900">
              {course.progress.completed}/{course.progress.total} ({course.progress.percentage}%)
            </span>
          </div>
          <ProgressBar percentage={course.progress.percentage} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {course.estimatedHours}h
            </div>
          </div>
          
          <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
            <span className="text-sm mr-1">{course.questions.length} questions</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      {/* Recommendation Details Tooltip */}
      {isRecommended && showRecommendationDetails === course.id && (
        <RecommendationTooltip course={course} />
      )}
    </div>
  );

  // Calculate overall stats
  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.progress.percentage === 100).length;
  const totalQuestions = courses.reduce((sum, course) => sum + course.progress.total, 0);
  const completedQuestions = courses.reduce((sum, course) => sum + course.progress.completed, 0);
  const overallProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">LearnCode</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreferencesModal(true)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="h-5 w-5 mr-1" />
                Preferences
              </button>
              
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Learner'}! 👋
          </h2>
          <p className="text-blue-100 text-lg mb-6">
            Ready to continue your coding journey? Let's dive into some new challenges!
          </p>
          
          {/* Overall Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Overall Progress</span>
                <TrendingUp className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-2xl font-bold mb-2">{overallProgress}%</div>
              <ProgressBar percentage={overallProgress} size="sm" />
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Courses Completed</span>
                <Trophy className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">{completedCourses}/{totalCourses}</div>
              <div className="text-sm text-blue-200">
                {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}% complete
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Questions Solved</span>
                <BookOpen className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">{completedQuestions}/{totalQuestions}</div>
              <div className="text-sm text-blue-200">Keep it up!</div>
            </div>
          </div>
        </div>

        {/* AI Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-purple-500 mr-2" />
                <h3 className="text-2xl font-bold text-gray-900">AI Recommendations</h3>
                <div className="ml-3 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  Powered by AI
                </div>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <Info className="h-4 w-4 mr-1" />
                Based on your goals, skills, and progress
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <CourseCard key={course.id} course={course} isRecommended={true} />
              ))}
            </div>
          </section>
        )}

        {/* All Courses */}
        <section>
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-2xl font-bold text-gray-900">All Courses</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>

      <UserPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />
    </div>
  );
};

export default Profile;
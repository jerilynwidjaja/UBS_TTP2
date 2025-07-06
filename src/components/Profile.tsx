import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, TrendingUp, Trophy, Sparkles, Info, Brain, Settings, Moon, Sun, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { CourseService, Course, RecommendationResponse } from '../services/courseService';
import UserPreferencesModal from './UserPreferencesModal';
import UserSettings from './UserSettings';
import ProgressDashboard from './ProgressDashboard';
import CourseCard from './common/CourseCard';
import ProgressBar from './common/ProgressBar';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRecommendationDetails, setShowRecommendationDetails] = useState<number | null>(null);
  const [recommendationStrategy, setRecommendationStrategy] = useState<string>('');
  const [recommendationMetadata, setRecommendationMetadata] = useState<RecommendationResponse['metadata'] | null>(null);
  const [activeView, setActiveView] = useState<'courses' | 'progress'>('courses');

  useEffect(() => {
    if (user && !user.hasPreferences) {
      setShowPreferencesModal(true);
    }
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const [coursesData, recommendedData] = await Promise.all([
        CourseService.getAllCourses(),
        CourseService.getRecommendedCourses()
      ]);
      
      setCourses(coursesData);
      setRecommendedCourses(recommendedData.courses);
      setRecommendationStrategy(recommendedData.strategy || '');
      setRecommendationMetadata(recommendedData.metadata || null);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleShowRecommendationDetails = (courseId: number) => {
    setShowRecommendationDetails(
      showRecommendationDetails === courseId ? null : courseId
    );
  };

  // Calculate overall stats from recommended courses only
  const totalCourses = recommendedCourses.length;
  const completedCourses = recommendedCourses.filter(c => c.progress.percentage === 100).length;
  const totalQuestions = recommendedCourses.reduce((sum, course) => sum + course.progress.total, 0);
  const completedQuestions = recommendedCourses.reduce((sum, course) => sum + course.progress.completed, 0);
  const overallProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">LearnCode</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('courses')}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  activeView === 'courses'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BookOpen className="h-5 w-5 mr-1" />
                Courses
              </button>
              
              <button
                onClick={() => setActiveView('progress')}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  activeView === 'progress'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-1" />
                Progress
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setShowPreferencesModal(true)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="h-5 w-5 mr-1" />
                Preferences
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="h-5 w-5 mr-1" />
                Settings
              </button>
              
              <button
                onClick={logout}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {activeView === 'progress' ? (
        <ProgressDashboard />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Learner'}! 👋
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Ready to continue your coding journey? Let's dive into some new challenges!
              </p>
              
              {/* Overall Progress Stats - Based on Recommended Courses */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100">Recommended Progress</span>
                    <TrendingUp className="h-5 w-5 text-blue-200" />
                  </div>
                  <div className="text-2xl font-bold mb-2">{overallProgress}%</div>
                  <ProgressBar percentage={overallProgress} size="sm" />
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100">Recommended Courses</span>
                    <Trophy className="h-5 w-5 text-blue-200" />
                  </div>
                  <div className="text-2xl font-bold">{completedCourses}/{totalCourses}</div>
                  <div className="text-sm text-blue-200">
                    {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}% complete
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100">Questions Solved</span>
                    <BookOpen className="h-5 w-5 text-blue-200" />
                  </div>
                  <div className="text-2xl font-bold">{completedQuestions}/{totalQuestions}</div>
                  <div className="text-sm text-blue-200">Keep it up!</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI Recommendations</h3>
                  <div className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-200 dark:border-purple-700">
                    {recommendationMetadata?.model || 'Powered by AI'}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Info className="h-4 w-4 mr-1" />
                  Personalized for your learning journey
                </div>
              </div>
              
              {recommendationStrategy && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    Your Learning Strategy:
                  </h4>
                  <p className="text-blue-800 dark:text-blue-400 text-sm">{recommendationStrategy}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isRecommended={true}
                    onShowRecommendationDetails={handleShowRecommendationDetails}
                    showRecommendationDetails={showRecommendationDetails === course.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Courses */}
          <section>
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </main>
      )}

      <UserPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />

      <UserSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default Profile;
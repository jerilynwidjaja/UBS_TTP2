import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, TrendingUp, Trophy, Sparkles, Info, Brain, Settings, Moon, Sun, BarChart3, AlertTriangle, CheckCircle, Cpu, Zap, RefreshCw, Eye, Code2, Database, Clock, Activity, Loader } from 'lucide-react';
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
  const [refreshing, setRefreshing] = useState(false);
  const [aiComputing, setAiComputing] = useState(false);
  const [showRecommendationDetails, setShowRecommendationDetails] = useState<number | null>(null);
  const [recommendationMetadata, setRecommendationMetadata] = useState<RecommendationResponse['metadata'] | null>(null);
  const [activeView, setActiveView] = useState<'courses' | 'progress'>('courses');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [rawAiResponse, setRawAiResponse] = useState<string>('');
  const [showAiDetails, setShowAiDetails] = useState(false);

  useEffect(() => {
    if (user && !user.hasPreferences) {
      setShowPreferencesModal(true);
    }
    fetchCourses();
  }, [user]);

  // Helper function to retry API calls
const retryApiCall = async (apiCall, maxRetries = 2, delay = 1000) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

const fetchCourses = async () => {
  setLoading(true);
  setAiComputing(true);
  
  // Load courses and recommendations independently
  const loadAllCourses = async () => {
    try {
      const coursesData = await retryApiCall(() => CourseService.getAllCourses());
      setCourses(coursesData);
      return true;
    } catch (error) {
      console.error('Failed to load all courses after retries:', error);
      toast.error('Some courses may not be available');
      setCourses([]); // Set empty array as fallback
      return false;
    }
  };

  const loadRecommendations = async () => {
    try {
      const recommendedData = await retryApiCall(() => CourseService.getRecommendedCourses());
      setRecommendedCourses(recommendedData.courses);
      setRecommendationMetadata(recommendedData.metadata || null);
      setAiResponse(recommendedData.aiResponse || null);
      setRawAiResponse(recommendedData.rawAiResponse || '');
      return true;
    } catch (error) {
      setRecommendedCourses([]);
      setRecommendationMetadata(null);
      setAiResponse(null);
      setRawAiResponse('');
      return false;
    }
  };

  // Load both concurrently but handle failures independently
  const [coursesSuccess, recommendationsSuccess] = await Promise.all([
    loadAllCourses(),
    loadRecommendations()
  ]);

  setLoading(false);
  setAiComputing(false);
};



  const handleShowRecommendationDetails = (courseId: number) => {
    setShowRecommendationDetails(
      showRecommendationDetails === courseId ? null : courseId
    );
  };

  const handleRefreshRecommendations = async () => {
    setRefreshing(true);
    setAiComputing(true);
    
    try {
      const recommendedData = await CourseService.getRecommendedCourses(true);
      setRecommendedCourses(recommendedData.courses);
      setRecommendationMetadata(recommendedData.metadata || null);
      setAiResponse(recommendedData.aiResponse || null);
      setRawAiResponse(recommendedData.rawAiResponse || '');
      toast.success('Recommendations refreshed!');
    } catch (error) {
      toast.error('Failed to refresh recommendations');
    } finally {
      setRefreshing(false);
      setAiComputing(false);
    }
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

          {/* AI Computing Status */}
          {aiComputing && (
            <div className="mb-8">
              <div className="p-6 rounded-xl border-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-300 dark:border-purple-600">
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <Loader className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3 animate-spin" />
                    <div className="bg-purple-100 dark:bg-purple-800 px-4 py-2 rounded-full">
                      <span className="text-purple-800 dark:text-purple-200 font-semibold text-sm">
                        🤖 AI is computing your personalized recommendations...
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-purple-700 dark:text-purple-400 text-sm">
                    Our advanced AI is analyzing your learning patterns and preferences
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced AI Recommendation Status with Quota Information */}
          {recommendationMetadata && !aiComputing && (
            <div className="mb-8">
              <div className={`p-6 rounded-xl border-2 ${
                recommendationMetadata.aiUsed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-600'
                  : 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-600'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {recommendationMetadata.aiUsed ? (
                      <div className="flex items-center">
                        <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                        <div className="bg-green-100 dark:bg-green-800 px-3 py-1 rounded-full">
                          <span className="text-green-800 dark:text-green-200 font-semibold text-sm">🤖 AI POWERED</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Cpu className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
                        <div className="bg-yellow-100 dark:bg-yellow-800 px-3 py-1 rounded-full">
                          <span className="text-yellow-800 dark:text-yellow-200 font-semibold text-sm">🧮 MATHEMATICAL ALGORITHM</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {recommendationMetadata.aiUsed && (
                      <button
                        onClick={() => setShowAiDetails(!showAiDetails)}
                        className="flex items-center px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {showAiDetails ? 'Hide' : 'Show'} AI Details
                      </button>
                    )}
                    <button
                      onClick={handleRefreshRecommendations}
                      disabled={refreshing}
                      className="flex items-center px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className={`font-semibold text-lg mb-2 ${
                      recommendationMetadata.aiUsed 
                        ? 'text-green-800 dark:text-green-300'
                        : 'text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {recommendationMetadata.aiUsed ? '🤖 OpenAI GPT-3.5 Turbo Analysis' : '🧮 Mathematical Scoring Algorithm'}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      recommendationMetadata.aiUsed 
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {recommendationMetadata.aiUsed 
                        ? 'Advanced AI analysis of your learning patterns, goals, and preferences to provide personalized course recommendations using neural networks and machine learning.'
                        : `Mathematical algorithm analyzing your profile and progress patterns using statistical models and algorithmic optimization.${recommendationMetadata.fallbackReason ? ` Reason: ${recommendationMetadata.fallbackReason}` : ''}`
                      }
                    </p>
                    
                    {recommendationMetadata.quotaExceeded && (
                      <div className="flex items-center text-red-600 dark:text-red-400 text-sm mb-2">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        ⚠️ OpenAI quota exceeded - using mathematical fallback
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={recommendationMetadata.aiUsed ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}>
                        <Clock className="h-3 w-3 inline mr-1" />
                        Generated At:
                      </span>
                      <span className={recommendationMetadata.aiUsed ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}>
                        {new Date(recommendationMetadata.generatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {recommendationMetadata.processingTime && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={recommendationMetadata.aiUsed ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}>
                          <Activity className="h-3 w-3 inline mr-1" />
                          Processing Time:
                        </span>
                        <span className={recommendationMetadata.aiUsed ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}>
                          {recommendationMetadata.processingTime}ms
                        </span>
                      </div>
                    )}
                    
                    {recommendationMetadata.tokensUsed && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700 dark:text-green-400">
                          <Zap className="h-3 w-3 inline mr-1" />
                          Tokens Used:
                        </span>
                        <span className="text-green-800 dark:text-green-300 font-mono">
                          {recommendationMetadata.tokensUsed.toLocaleString()}
                          {recommendationMetadata.remainingTokens && ` / ${recommendationMetadata.remainingTokens.toLocaleString()} remaining`}
                        </span>
                      </div>
                    )}
                    
                    {recommendationMetadata.clicksBeforeQuota && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700 dark:text-green-400">
                          <Info className="h-3 w-3 inline mr-1" />
                          Est. Clicks Before Quota:
                        </span>
                        <span className="text-green-800 dark:text-green-300 font-semibold">
                          ~{recommendationMetadata.clicksBeforeQuota.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {recommendationMetadata.requestId && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={recommendationMetadata.aiUsed ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}>
                          Request ID:
                        </span>
                        <span className={`font-mono text-xs ${recommendationMetadata.aiUsed ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}`}>
                          {recommendationMetadata.requestId.substring(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Response Details */}
          {showAiDetails && aiResponse && recommendationMetadata?.aiUsed && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  🤖 AI Analysis Deep Dive - How OpenAI Works
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* How AI Works Explanation */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                    🧠 How Our AI Recommendation System Works
                  </h4>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                    <div className="space-y-3 text-sm text-purple-800 dark:text-purple-300">
                      <p><strong>1. Profile Analysis:</strong> AI analyzes your learning level, career stage, current skills, goals, and time availability to create a comprehensive learner profile.</p>
                      <p><strong>2. Progress Pattern Recognition:</strong> Machine learning algorithms examine your completion rates, attempt patterns, and learning velocity to understand your learning style.</p>
                      <p><strong>3. Course Scoring:</strong> Neural networks assign scores (0-100) to each course based on goal alignment (35%), level match (25%), skill building (20%), progress optimization (15%), and time commitment (5%).</p>
                      <p><strong>4. Reasoning Generation:</strong> Natural language processing creates detailed explanations for why each course fits your learning journey.</p>
                      <p><strong>5. Learning Path Optimization:</strong> AI considers how each course fits into your overall learning progression and career goals using predictive modeling.</p>
                    </div>
                  </div>
                </div>

                {/* Processed AI Response */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                    <Code2 className="h-4 w-4 mr-2 text-blue-500" />
                    📊 Processed AI Response (JSON)
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <pre className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
                      {JSON.stringify(aiResponse, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {/* Raw AI Response */}
                {rawAiResponse && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                      <Database className="h-4 w-4 mr-2 text-green-500" />
                      🤖 Raw OpenAI GPT-3.5 Response
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                      <pre className="text-sm text-green-800 dark:text-green-300 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
                        {rawAiResponse}
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* AI Interpretation Guide */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-indigo-500" />
                    🔍 Understanding the AI Analysis
                  </h4>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4">
                    <div className="space-y-3 text-sm text-indigo-800 dark:text-indigo-300">
                      <p><strong>🎯 Recommendation Scores:</strong> Each course receives a score from 0-100 based on how well it matches your profile. Scores above 80 are excellent matches, 60-79 are good matches, and below 60 may need prerequisites.</p>
                      <p><strong>🧮 Factor Weights:</strong> Goal Alignment (35%) - how well the course matches your stated learning goals; Level Match (25%) - appropriate difficulty for your current level; Skill Building (20%) - develops skills you want to learn.</p>
                      <p><strong>📈 Learning Path:</strong> AI considers prerequisite knowledge, skill progression, and how each course prepares you for advanced topics in your chosen field.</p>
                      <p><strong>⚡ Personalization:</strong> The system adapts to your learning pace, preferred difficulty progression, and time constraints to create truly personalized recommendations.</p>
                      <p><strong>🔄 Continuous Learning:</strong> As you complete courses and update preferences, the AI refines its understanding of your learning style for even better future recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {recommendationMetadata?.aiUsed ? (
                    <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
                  ) : (
                    <Cpu className="h-6 w-6 text-yellow-500 mr-2" />
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {recommendationMetadata?.aiUsed ? '🤖 AI-Powered Recommendations' : '🧮 Smart Mathematical Recommendations'}
                  </h3>
                  <div className={`ml-3 px-3 py-1 rounded-full text-sm font-medium border ${
                    recommendationMetadata?.aiUsed 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700'
                      : 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
                  }`}>
                    {recommendationMetadata?.model || 'Mathematical Algorithm'}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Info className="h-4 w-4 mr-1" />
                  Personalized for your learning journey
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses ({courses.length} total)</h3>
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
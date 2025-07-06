import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, BarChart3, CheckCircle2, Trophy, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { CourseService, Course } from '../services/courseService';
import { QuestionService } from '../services/questionService';
import ProgressBar from './common/ProgressBar';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    if (!id) return;
    
    try {
      const courseData = await CourseService.getCourseById(id);
      setCourse(courseData);
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course not found</h2>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header with Thumbnail */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {/* Course Thumbnail */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            
            {/* Course Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                {course.progress.percentage === 100 && (
                  <div className="flex items-center text-yellow-400">
                    <Trophy className="h-6 w-6 fill-current" />
                  </div>
                )}
              </div>
              <p className="text-blue-100 text-lg mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${CourseService.getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                
                <div className="flex items-center text-blue-200">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{course.estimatedHours} hours</span>
                </div>
                
                <div className="flex items-center text-blue-200">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="text-sm">{course.questions.length} questions</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="p-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-blue-800 dark:text-blue-300 font-medium">Course Progress</span>
                </div>
                <span className="text-blue-900 dark:text-blue-200 font-bold text-lg">
                  {course.progress.completed}/{course.progress.total} ({course.progress.percentage}%)
                </span>
              </div>
              <ProgressBar percentage={course.progress.percentage} size="lg" />
              {course.progress.percentage === 100 && (
                <div className="mt-3 text-green-700 dark:text-green-400 font-medium flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Congratulations! You've completed this course!
                </div>
              )}
            </div>
            
            <div className="mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="text-gray-800 dark:text-gray-300 font-medium">Category: {course.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Coding Challenges</h2>
          
          <div className="space-y-4">
            {course.questions.map((question, index) => (
              <div
                key={question.id}
                onClick={() => navigate(`/question/${question.id}`)}
                className={`flex items-center justify-between p-6 border rounded-xl transition-all duration-200 cursor-pointer group ${
                  question.completed 
                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm mr-4 ${
                    question.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  }`}>
                    {question.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors ${
                      question.completed 
                        ? 'text-green-800 dark:text-green-300' 
                        : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}>
                      {question.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{question.description}</p>
                    {question.attempts && question.attempts > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {question.attempts} attempt{question.attempts > 1 ? 's' : ''}
                        {question.lastAttemptAt && (
                          <span> • Last attempt: {new Date(question.lastAttemptAt).toLocaleDateString()}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${QuestionService.getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  
                  <div className={`flex items-center transition-colors ${
                    question.completed 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                  }`}>
                    {question.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {course.questions.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions yet</h3>
              <p className="text-gray-600 dark:text-gray-300">Questions for this course are coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
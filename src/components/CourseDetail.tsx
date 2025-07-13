import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, BarChart3, CheckCircle2, Trophy, TrendingUp, PlayCircle, Video, Code2, BookOpen } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<'videos' | 'questions'>('videos');

  // Hardcoded video data
  const hardcodedVideos = [
    {
      id: 'video-1',
      title: 'Introduction to React Fundamentals',
      description: 'Learn the basics of React including components, JSX, and the virtual DOM. Perfect starting point for beginners.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop',
      duration: '12:45',
      order: 1
    },
    {
      id: 'video-2',
      title: 'State Management with Hooks',
      description: 'Dive deep into React hooks including useState, useEffect, and custom hooks for efficient state management.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=240&fit=crop',
      duration: '18:32',
      order: 2
    },
    {
      id: 'video-3',
      title: 'Building Interactive Components',
      description: 'Create dynamic and interactive React components with event handling, forms, and conditional rendering.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop',
      duration: '15:20',
      order: 3
    }
  ];

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

  const handleVideoClick = (videoId: string) => {
    // Handle video click - could navigate to video player or open modal
    console.log('Playing video:', videoId);
    toast.success('Video player would open here');
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
                  <Video className="h-4 w-4 mr-1" />
                  <span className="text-sm">{hardcodedVideos.length} videos</span>
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

        {/* Section Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveSection('videos')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === 'videos'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Video className="h-4 w-4 inline mr-2" />
                Course Videos ({hardcodedVideos.length})
              </button>
              <button
                onClick={() => setActiveSection('questions')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === 'questions'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Code2 className="h-4 w-4 inline mr-2" />
                Coding Challenges ({course.questions.length})
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Course Videos Section */}
            {activeSection === 'videos' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Video className="h-6 w-6 mr-2 text-purple-600" />
                  Course Videos
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hardcodedVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleVideoClick(video.id)}
                      className="group cursor-pointer bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                            <PlayCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        
                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                          {video.duration}
                        </div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                          {video.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                          {video.description}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>Lesson {video.order}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coding Challenges Section */}
            {activeSection === 'questions' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Code2 className="h-6 w-6 mr-2 text-blue-600" />
                  Coding Challenges
                </h2>
                
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
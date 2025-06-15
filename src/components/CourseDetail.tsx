import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, BarChart3, CheckCircle2, Trophy, TrendingUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface QuestionProgress {
  completed: boolean;
  attempts: number;
  lastAttemptAt: string | null;
}

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  completed?: boolean;
  attempts?: number;
  lastAttemptAt?: string | null;
}

interface CourseProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  category: string;
  estimatedHours: number;
  questions: Question[];
  progress: CourseProgress;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://52.221.205.14:8000/api/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                {course.progress.percentage === 100 && (
                  <div className="flex items-center text-green-500">
                    <Trophy className="h-6 w-6 fill-current" />
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-lg">{course.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{course.estimatedHours} hours</span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="text-sm">{course.questions.length} questions</span>
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">Course Progress</span>
              </div>
              <span className="text-blue-900 font-bold text-lg">
                {course.progress.completed}/{course.progress.total} ({course.progress.percentage}%)
              </span>
            </div>
            <ProgressBar percentage={course.progress.percentage} size="lg" />
            {course.progress.percentage === 100 && (
              <div className="mt-3 text-green-700 font-medium flex items-center">
                <Trophy className="h-4 w-4 mr-1" />
                Congratulations! You've completed this course!
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-800 font-medium">Category: {course.category}</span>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Coding Challenges</h2>
          
          <div className="space-y-4">
            {course.questions.map((question, index) => (
              <div
                key={question.id}
                onClick={() => navigate(`/question/${question.id}`)}
                className={`flex items-center justify-between p-6 border rounded-xl transition-all duration-200 cursor-pointer group ${
                  question.completed 
                    ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm mr-4 ${
                    question.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-100 text-blue-600'
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
                        ? 'text-green-800' 
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {question.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{question.description}</p>
                    {question.attempts && question.attempts > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {question.attempts} attempt{question.attempts > 1 ? 's' : ''}
                        {question.lastAttemptAt && (
                          <span> • Last attempt: {new Date(question.lastAttemptAt).toLocaleDateString()}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  
                  <div className={`flex items-center transition-colors ${
                    question.completed 
                      ? 'text-green-600' 
                      : 'text-blue-600 group-hover:text-blue-700'
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
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600">Questions for this course are coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
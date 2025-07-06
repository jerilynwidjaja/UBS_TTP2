import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Play, Trophy, Star, Sparkles, Brain } from 'lucide-react';
import { Course, CourseService } from '../../services/courseService';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  isRecommended?: boolean;
  onShowRecommendationDetails?: (courseId: number) => void;
  showRecommendationDetails?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isRecommended = false,
  onShowRecommendationDetails,
  showRecommendationDetails = false
}) => {
  const navigate = useNavigate();

  const RecommendationTooltip: React.FC = () => {
    if (!course.recommendation) return null;

    return (
      <div className="absolute z-20 w-96 p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl top-full left-0 mt-2">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {course.recommendation.aiGenerated ? (
                <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
              ) : (
                <Brain className="h-5 w-5 text-blue-500 mr-2" />
              )}
              <span className="font-semibold text-gray-900 dark:text-white">
                {course.recommendation.aiGenerated ? 'AI Recommendation' : 'Smart Match'}
              </span>
            </div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{course.recommendation.score}/100</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{course.recommendation.reasoning}</p>
          
          {course.recommendation.learningPath && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h5 className="font-medium text-blue-900 dark:text-blue-300 text-sm mb-1">Learning Path:</h5>
              <p className="text-xs text-blue-700 dark:text-blue-400">{course.recommendation.learningPath}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm flex items-center">
            Scoring Factors:
          </h4>
          {course.recommendation.factors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300 font-medium">{factor.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <span className="text-gray-800 dark:text-gray-200 font-semibold w-8 text-right">{factor.score}</span>
              </div>
            </div>
          ))}
        </div>
        
        {course.recommendation.aiGenerated && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>Powered by OpenAI GPT-3.5</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative h-full">
      <div
        onClick={() => navigate(`/course/${course.id}`)}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-blue-300 dark:hover:border-blue-600 h-full flex flex-col"
      >
        {/* Course Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3">
              <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${CourseService.getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>
          
          {/* Recommendation Badge */}
          {isRecommended && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {course.recommendation?.aiGenerated ? (
                <div className="bg-purple-500 text-white rounded-full p-1">
                  <Sparkles className="h-3 w-3" />
                </div>
              ) : (
                <div className="bg-yellow-500 text-white rounded-full p-1">
                  <Star className="h-3 w-3" />
                </div>
              )}
            </div>
          )}
          
          {/* Completion Badge */}
          {course.progress.percentage === 100 && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-green-500 text-white rounded-full p-1">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
              {course.title}
            </h3>
            {isRecommended && course.recommendation && onShowRecommendationDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowRecommendationDetails(course.id);
                }}
                className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 ml-2"
              >
                {course.recommendation.aiGenerated ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {course.description}
          </p>
          
          {/* AI Recommendation Score for recommended courses */}
          {isRecommended && course.recommendation && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {course.recommendation.aiGenerated ? (
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-1" />
                  ) : (
                    <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                  )}
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {course.recommendation.aiGenerated ? 'AI Match Score' : 'Smart Match'}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-200">{course.recommendation.score}/100</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-400 line-clamp-2">{course.recommendation.reasoning}</p>
            </div>
          )}
          
          {/* Progress Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {course.progress.completed}/{course.progress.total} ({course.progress.percentage}%)
              </span>
            </div>
            <ProgressBar percentage={course.progress.percentage} />
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {course.estimatedHours}h
              </div>
            </div>
            
            <div className="flex items-center text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <span className="text-sm mr-1">{course.questions.length} questions</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendation Details Tooltip */}
      {isRecommended && showRecommendationDetails && (
        <RecommendationTooltip />
      )}
    </div>
  );
};

export default CourseCard;
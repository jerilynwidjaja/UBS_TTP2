import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Target, Clock, Award, BarChart3, Calendar, Zap, BookOpen, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProgressFeedback {
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  motivationalMessage: string;
  actionableAdvice: string[];
  nextMilestones: string[];
  studyTips: string[];
  encouragement: string;
}

interface LearningPath {
  pathTitle: string;
  description: string;
  estimatedDuration: string;
  phases: Array<{
    phaseNumber: number;
    title: string;
    description: string;
    duration: string;
    courses: Array<{
      courseId: number;
      title: string;
      priority: string;
      reasoning: string;
    }>;
    learningObjectives: string[];
    prerequisites: string[];
  }>;
  tips: string[];
  milestones: string[];
}

interface SequentialPath {
  pathTitle: string;
  description: string;
  totalEstimatedDuration: string;
  difficultyProgression: string;
  courseSequence: Array<{
    step: number;
    courseId: number;
    courseTitle: string;
    level: string;
    category: string;
    estimatedHours: number;
    priority: string;
    reasoning: string;
    prerequisites: string[];
    learningOutcomes: string[];
    preparesFor: string[];
    keySkills: string[];
    currentProgress: number;
  }>;
  learningStrategy: string;
  milestones: Array<{
    afterCourse: number;
    achievement: string;
    nextSteps: string;
  }>;
  tips: string[];
  timeManagement: {
    weeklySchedule: string;
    pacing: string;
    breaks: string;
  };
  adaptations: {
    ifStruggling: string;
    ifAdvancing: string;
    skipConditions: string;
  };
}

interface Analytics {
  totalQuestions: number;
  completedQuestions: number;
  totalAttempts: number;
  averageAttempts: number;
  completionRate: number;
  categoryBreakdown: Record<string, { completed: number; total: number }>;
  difficultyBreakdown: Record<string, { completed: number; total: number }>;
  recentActivity: Array<{
    questionTitle: string;
    courseTitle: string;
    completed: boolean;
    attempts: number;
    date: string;
  }>;
  learningStreak: number;
}

const ProgressDashboard: React.FC = () => {
  const [feedback, setFeedback] = useState<ProgressFeedback | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [sequentialPath, setSequentialPath] = useState<SequentialPath | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feedback' | 'path' | 'sequential' | 'analytics'>('feedback');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [feedbackRes, pathRes, sequentialRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/progress/feedback'),
        axios.get('http://localhost:5000/api/progress/learning-path'),
        axios.get('http://localhost:5000/api/progress/sequential-path'),
        axios.get('http://localhost:5000/api/progress/analytics')
      ]);

      setFeedback(feedbackRes.data.feedback);
      setLearningPath(pathRes.data.learningPath);
      setSequentialPath(sequentialRes.data.sequentialPath);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const ProgressBar: React.FC<{ percentage: number; color?: string }> = ({ 
    percentage, 
    color = 'bg-blue-500' 
  }) => (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 ${color} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
        <p className="text-gray-600">AI-powered insights into your learning journey</p>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Completion Rate</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</div>
            <ProgressBar percentage={analytics.completionRate} color="bg-green-500" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Questions Solved</span>
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.completedQuestions}/{analytics.totalQuestions}
            </div>
            <div className="text-sm text-gray-500">
              Avg {analytics.averageAttempts} attempts per question
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Learning Streak</span>
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analytics.learningStreak}</div>
            <div className="text-sm text-gray-500">consecutive days</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Recent Activity</span>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analytics.recentActivity.length}</div>
            <div className="text-sm text-gray-500">questions this week</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'feedback'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Brain className="h-4 w-4 inline mr-2" />
              AI Feedback
            </button>
            <button
              onClick={() => setActiveTab('path')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'path'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Learning Path
            </button>
            <button
              onClick={() => setActiveTab('sequential')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sequential'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowRight className="h-4 w-4 inline mr-2" />
              Course Sequence
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* AI Feedback Tab */}
          {activeTab === 'feedback' && feedback && (
            <div className="space-y-8">
              {/* Overall Assessment */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Assessment
                </h3>
                <p className="text-blue-800 leading-relaxed">{feedback.overallAssessment}</p>
              </div>

              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Motivation
                </h3>
                <p className="text-green-800 leading-relaxed">{feedback.motivationalMessage}</p>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-green-700 font-medium">{feedback.encouragement}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Strengths */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-500" />
                    Areas for Growth
                  </h3>
                  <ul className="space-y-2">
                    {feedback.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actionable Advice */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-500" />
                    Action Items
                  </h3>
                  <ul className="space-y-3">
                    {feedback.actionableAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Study Tips */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                    Study Tips
                  </h3>
                  <ul className="space-y-2">
                    {feedback.studyTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Milestones */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-indigo-500" />
                  Next Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feedback.nextMilestones.map((milestone, index) => (
                    <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-2">
                          {index + 1}
                        </div>
                        <span className="font-medium text-indigo-900">Goal {index + 1}</span>
                      </div>
                      <p className="text-indigo-800 text-sm">{milestone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Learning Path Tab */}
          {activeTab === 'path' && learningPath && (
            <div className="space-y-8">
              {/* Path Overview */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">{learningPath.pathTitle}</h2>
                <p className="text-purple-800 mb-4">{learningPath.description}</p>
                <div className="flex items-center text-purple-700">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Estimated Duration: {learningPath.estimatedDuration}</span>
                </div>
              </div>

              {/* Learning Phases */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Learning Phases</h3>
                {learningPath.phases.map((phase) => (
                  <div key={phase.phaseNumber} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{phase.title}</h4>
                        <p className="text-gray-600 text-sm">{phase.duration}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{phase.description}</p>
                    
                    {/* Prerequisites */}
                    {phase.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Prerequisites:</h5>
                        <ul className="text-sm text-gray-600">
                          {phase.prerequisites.map((prereq, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Courses */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-3">Recommended Courses:</h5>
                      <div className="space-y-3">
                        {phase.courses.map((course, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h6 className="font-medium text-gray-900">{course.title}</h6>
                              <p className="text-sm text-gray-600">{course.reasoning}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(course.priority)}`}>
                              {course.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Learning Objectives */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Learning Objectives:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {phase.learningObjectives.map((objective, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips and Milestones */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    Success Tips
                  </h4>
                  <ul className="space-y-2">
                    {learningPath.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-green-500" />
                    Key Milestones
                  </h4>
                  <ul className="space-y-2">
                    {learningPath.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Sequential Course Path Tab */}
          {activeTab === 'sequential' && sequentialPath && (
            <div className="space-y-8">
              {/* Path Overview */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">{sequentialPath.pathTitle}</h2>
                <p className="text-indigo-800 mb-4">{sequentialPath.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-indigo-700">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Duration: {sequentialPath.totalEstimatedDuration}</span>
                  </div>
                  <div className="flex items-center text-indigo-700">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{sequentialPath.difficultyProgression}</span>
                  </div>
                  <div className="flex items-center text-indigo-700">
                    <Target className="h-4 w-4 mr-1" />
                    <span>{sequentialPath.courseSequence.length} Courses</span>
                  </div>
                </div>
              </div>

              {/* Learning Strategy */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Learning Strategy
                </h3>
                <p className="text-blue-800">{sequentialPath.learningStrategy}</p>
              </div>

              {/* Course Sequence */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Course Sequence</h3>
                <div className="space-y-4">
                  {sequentialPath.courseSequence.map((course, index) => (
                    <div key={course.step} className="bg-white border border-gray-200 rounded-lg p-6 relative">
                      {/* Step indicator */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                            {course.step}
                          </div>
                          {index < sequentialPath.courseSequence.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-300 mx-auto mt-2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                                {course.level}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(course.priority)}`}>
                                {course.priority}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Category:</strong> {course.category}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Duration:</strong> {course.estimatedHours} hours
                              </p>
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">
                                  <strong>Progress:</strong> {course.currentProgress}%
                                </p>
                                <ProgressBar percentage={course.currentProgress} color="bg-indigo-500" />
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-700 mb-3">{course.reasoning}</p>
                              <div className="flex flex-wrap gap-1">
                                {course.keySkills.map((skill, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Learning Outcomes:</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {course.learningOutcomes.map((outcome, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <Star className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Prepares For:</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {course.preparesFor.map((prep, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <ArrowRight className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                    {prep}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-500" />
                  Learning Milestones
                </h3>
                <div className="space-y-4">
                  {sequentialPath.milestones.map((milestone, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">
                        After Course {milestone.afterCourse}: {milestone.achievement}
                      </h4>
                      <p className="text-green-800 text-sm">{milestone.nextSteps}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Management & Adaptations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Time Management
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-700">Weekly Schedule:</strong>
                      <p className="text-gray-600">{sequentialPath.timeManagement.weeklySchedule}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Pacing:</strong>
                      <p className="text-gray-600">{sequentialPath.timeManagement.pacing}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Breaks:</strong>
                      <p className="text-gray-600">{sequentialPath.timeManagement.breaks}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-purple-500" />
                    Adaptations
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-700">If Struggling:</strong>
                      <p className="text-gray-600">{sequentialPath.adaptations.ifStruggling}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">If Advancing:</strong>
                      <p className="text-gray-600">{sequentialPath.adaptations.ifAdvancing}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Skip Conditions:</strong>
                      <p className="text-gray-600">{sequentialPath.adaptations.skipConditions}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Success Tips
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sequentialPath.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">
              {/* Category Performance */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.categoryBreakdown).map(([category, data]) => {
                    const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">{category}</span>
                          <span className="text-sm text-gray-600">
                            {data.completed}/{data.total} ({percentage}%)
                          </span>
                        </div>
                        <ProgressBar percentage={percentage} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Difficulty</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(analytics.difficultyBreakdown).map(([difficulty, data]) => {
                    const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                    const colorMap = {
                      easy: 'bg-green-500',
                      medium: 'bg-yellow-500',
                      hard: 'bg-red-500'
                    };
                    return (
                      <div key={difficulty} className="text-center">
                        <h4 className="font-medium text-gray-700 capitalize mb-2">{difficulty}</h4>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{percentage}%</div>
                        <div className="text-sm text-gray-600 mb-3">
                          {data.completed}/{data.total} completed
                        </div>
                        <ProgressBar 
                          percentage={percentage} 
                          color={colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-500'} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {analytics.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.recentActivity.slice(0, 10).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.questionTitle}</h4>
                          <p className="text-sm text-gray-600">{activity.courseTitle}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            activity.completed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.completed ? 'Completed' : `${activity.attempts} attempts`}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No recent activity to display</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
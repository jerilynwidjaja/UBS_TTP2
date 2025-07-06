import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Target, Clock, Award, BarChart3, Calendar, Zap, BookOpen, CheckCircle2, ArrowRight, Star, Sparkles, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { ProgressService, ProgressFeedback, LearningPath, SequentialPath, Analytics } from '../services/progressService';
import ProgressBar from './common/ProgressBar';

const ProgressDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
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
      const [feedbackData, pathData, sequentialData, analyticsData] = await Promise.all([
        ProgressService.getProgressFeedback(),
        ProgressService.getLearningPath(),
        ProgressService.getSequentialPath(),
        ProgressService.getAnalytics()
      ]);

      setFeedback(feedbackData);
      setLearningPath(pathData);
      setSequentialPath(sequentialData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Analyzing your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Progress Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">AI-powered insights into your learning journey (Recommended courses only)</p>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Completion Rate</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.completionRate}%</div>
            <ProgressBar percentage={analytics.completionRate} color="bg-green-500" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Questions Solved</span>
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.completedQuestions}/{analytics.totalQuestions}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Avg {analytics.averageAttempts} attempts per question
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Learning Streak</span>
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.learningStreak}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">consecutive days</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Recent Activity</span>
              <Activity className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.recentActivity.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">questions this week</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'feedback'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Sparkles className="h-4 w-4 inline mr-2" />
              AI Feedback
            </button>
            <button
              onClick={() => setActiveTab('path')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'path'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Learning Path
            </button>
            <button
              onClick={() => setActiveTab('sequential')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sequential'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ArrowRight className="h-4 w-4 inline mr-2" />
              Course Sequence
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* Advanced AI Feedback Tab */}
          {activeTab === 'feedback' && feedback && (
            <div className="space-y-8">
              {/* AI Analysis Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Advanced AI Analysis
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Learning Pattern Recognition</h4>
                    <p className="text-purple-700 dark:text-purple-400 text-sm">{feedback.aiAnalysis.learningPatternRecognition}</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Cognitive Load Assessment</h4>
                    <p className="text-purple-700 dark:text-purple-400 text-sm">{feedback.aiAnalysis.cognitiveLoadAssessment}</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Adaptive Recommendations</h4>
                    <p className="text-purple-700 dark:text-purple-400 text-sm">{feedback.aiAnalysis.adaptiveLearningRecommendations}</p>
                  </div>
                </div>
              </div>

              {/* Predictive Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Predictive Learning Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Learning Trajectory</h4>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">{feedback.predictiveInsights.learningTrajectory}</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Potential Challenges</h4>
                      <ul className="space-y-1">
                        {feedback.predictiveInsights.potentialChallenges.map((challenge, index) => (
                          <li key={index} className="flex items-start text-sm text-blue-700 dark:text-blue-400">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Optimization Opportunities</h4>
                      <ul className="space-y-1">
                        {feedback.predictiveInsights.optimizationOpportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-start text-sm text-blue-700 dark:text-blue-400">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personalized Strategies */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Personalized Learning Strategies
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Cognitive Approach</h4>
                    <p className="text-green-700 dark:text-green-400 text-sm">{feedback.personalizedStrategies.cognitiveApproach}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Time Optimization</h4>
                    <p className="text-green-700 dark:text-green-400 text-sm">{feedback.personalizedStrategies.timeOptimization}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Difficulty Progression</h4>
                    <p className="text-green-700 dark:text-green-400 text-sm">{feedback.personalizedStrategies.difficultyProgression}</p>
                  </div>
                </div>
              </div>

              {/* Motivational Psychology */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Motivational Psychology Profile
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Intrinsic Motivators</h4>
                    <ul className="space-y-1">
                      {feedback.motivationalPsychology.intrinsicMotivators.map((motivator, index) => (
                        <li key={index} className="flex items-start text-sm text-orange-700 dark:text-orange-400">
                          <Star className="h-3 w-3 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                          {motivator}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Achievement Framework</h4>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">{feedback.motivationalPsychology.achievementFramework}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Confidence Building</h4>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">{feedback.motivationalPsychology.confidenceBuilding}</p>
                  </div>
                </div>
              </div>

              {/* Data Insights */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Data-Driven Insights
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2">Learning Efficiency Score</h4>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{feedback.dataInsights.learningEfficiencyScore}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Algorithmic assessment</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2">Progress Prediction</h4>
                    <p className="text-gray-700 dark:text-gray-400 text-sm">{feedback.dataInsights.progressPrediction}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2">Recommended Adjustments</h4>
                    <ul className="space-y-1">
                      {feedback.dataInsights.recommendedAdjustments.map((adjustment, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {adjustment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Encouragement */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI-Powered Encouragement
                </h3>
                <p className="text-indigo-800 dark:text-indigo-400 text-lg font-medium leading-relaxed">{feedback.encouragement}</p>
              </div>
            </div>
          )}

          {/* Learning Path Tab */}
          {activeTab === 'path' && learningPath && (
            <div className="space-y-8">
              {/* Path Overview */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-2">{learningPath.pathTitle}</h2>
                <p className="text-purple-800 dark:text-purple-400 mb-4">{learningPath.description}</p>
                <div className="flex items-center text-purple-700 dark:text-purple-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Estimated Duration: {learningPath.estimatedDuration}</span>
                </div>
              </div>

              {/* Learning Phases */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Phases</h3>
                {learningPath.phases.map((phase, index) => (
                  <div key={phase.phaseNumber} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{phase.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{phase.duration}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{phase.description}</p>
                    
                    {/* Prerequisites */}
                    {phase.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Prerequisites:</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-300">
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
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">Recommended Courses:</h5>
                      <div className="space-y-3">
                        {phase.courses.map((course, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <h6 className="font-medium text-gray-900 dark:text-white">{course.title}</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{course.reasoning}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${ProgressService.getPriorityColor(course.priority)}`}>
                              {course.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Learning Objectives */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Learning Objectives:</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
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
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    Success Tips
                  </h4>
                  <ul className="space-y-2">
                    {learningPath.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-green-500" />
                    Key Milestones
                  </h4>
                  <ul className="space-y-2">
                    {learningPath.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{milestone}</span>
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
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">{sequentialPath.pathTitle}</h2>
                <p className="text-indigo-800 dark:text-indigo-400 mb-4">{sequentialPath.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-indigo-700 dark:text-indigo-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Duration: {sequentialPath.totalEstimatedDuration}</span>
                  </div>
                  <div className="flex items-center text-indigo-700 dark:text-indigo-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{sequentialPath.difficultyProgression}</span>
                  </div>
                  <div className="flex items-center text-indigo-700 dark:text-indigo-400">
                    <Target className="h-4 w-4 mr-1" />
                    <span>{sequentialPath.courseSequence.length} Courses</span>
                  </div>
                </div>
              </div>

              {/* Learning Strategy */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Learning Strategy
                </h3>
                <p className="text-blue-800 dark:text-blue-400">{sequentialPath.learningStrategy}</p>
              </div>

              {/* Course Sequence */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Sequence (Recommended Courses Only)</h3>
                <div className="space-y-4">
                  {sequentialPath.courseSequence.map((course, index) => (
                    <div key={course.step} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 relative">
                      {/* Step indicator */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                            {course.step}
                          </div>
                          {index < sequentialPath.courseSequence.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mx-auto mt-2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{course.courseTitle}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                                {course.level}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${ProgressService.getPriorityColor(course.priority)}`}>
                                {course.priority}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <strong>Category:</strong> {course.category}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <strong>Duration:</strong> {course.estimatedHours} hours
                              </p>
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                  <strong>Progress:</strong> {course.currentProgress}%
                                </p>
                                <ProgressBar percentage={course.currentProgress} color="bg-indigo-500" />
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{course.reasoning}</p>
                              <div className="flex flex-wrap gap-1">
                                {course.keySkills.map((skill, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Learning Outcomes:</h5>
                              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                {course.learningOutcomes.map((outcome, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <Star className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Prepares For:</h5>
                              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-500" />
                  Learning Milestones
                </h3>
                <div className="space-y-4">
                  {sequentialPath.milestones.map((milestone, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
                        After Course {milestone.afterCourse}: {milestone.achievement}
                      </h4>
                      <p className="text-green-800 dark:text-green-400 text-sm">{milestone.nextSteps}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Management & Tips */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Time Management
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">Weekly Schedule:</strong>
                      <p className="text-gray-600 dark:text-gray-400">{sequentialPath.timeManagement.weeklySchedule}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">Pacing:</strong>
                      <p className="text-gray-600 dark:text-gray-400">{sequentialPath.timeManagement.pacing}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">Breaks:</strong>
                      <p className="text-gray-600 dark:text-gray-400">{sequentialPath.timeManagement.breaks}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    Success Tips
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {sequentialPath.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">
              {/* Category Performance */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance by Category (Recommended Courses)</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.categoryBreakdown).map(([category, data]) => {
                    const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{category}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance by Difficulty</h3>
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
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 capitalize mb-2">{difficulty}</h4>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{percentage}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity (Recommended Courses)</h3>
                {analytics.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.recentActivity.slice(0, 10).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{activity.questionTitle}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{activity.courseTitle}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            activity.completed 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {activity.completed ? 'Completed' : `${activity.attempts} attempts`}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-center py-8">No recent activity to display</p>
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
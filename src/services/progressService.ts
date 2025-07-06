import axios from 'axios';

export interface ProgressFeedback {
  aiAnalysis: {
    learningPatternRecognition: string;
    cognitiveLoadAssessment: string;
    adaptiveLearningRecommendations: string;
  };
  predictiveInsights: {
    learningTrajectory: string;
    potentialChallenges: string[];
    optimizationOpportunities: string[];
  };
  personalizedStrategies: {
    cognitiveApproach: string;
    timeOptimization: string;
    difficultyProgression: string;
  };
  motivationalPsychology: {
    intrinsicMotivators: string[];
    achievementFramework: string;
    confidenceBuilding: string;
  };
  dataInsights: {
    learningEfficiencyScore: string;
    progressPrediction: string;
    recommendedAdjustments: string[];
  };
  encouragement: string;
}

export interface LearningPath {
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

export interface SequentialPath {
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
}

export interface Analytics {
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

export class ProgressService {
  static async getProgressFeedback(): Promise<ProgressFeedback> {
    const response = await axios.get('http://localhost:8080/api/progress/feedback');
    return response.data.feedback;
  }

  static async getLearningPath(): Promise<LearningPath> {
    const response = await axios.get('http://localhost:8080/api/progress/learning-path');
    return response.data.learningPath;
  }

  static async getSequentialPath(): Promise<SequentialPath> {
    const response = await axios.get('http://localhost:8080/api/progress/sequential-path');
    return response.data.sequentialPath;
  }

  static async getAnalytics(): Promise<Analytics> {
    const response = await axios.get('http://localhost:8080/api/progress/analytics');
    return response.data.analytics;
  }

  static getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  }
}
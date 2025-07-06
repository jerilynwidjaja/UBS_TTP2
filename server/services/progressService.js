import { User, UserProgress, Course, Question } from '../models/index.js';
import { AIRecommendationService } from './aiRecommendationService.js';

export class ProgressService {
  static async getProgressFeedback(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get recommended courses first
    const allCourses = await Course.findAll({
      include: [{ model: Question, as: 'questions' }]
    });

    const userProgress = await UserProgress.findAll({
      where: { userId }
    });

    // Get AI recommendations to focus feedback on recommended courses
    const recommendationResult = await AIRecommendationService.generateRecommendations(user, allCourses, userProgress);
    const recommendedCourses = recommendationResult.recommendations;

    const feedback = await AIRecommendationService.generateProgressFeedback(user, userProgress, allCourses, recommendedCourses);

    return feedback;
  }

  static async getLearningPath(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userProgress = await UserProgress.findAll({
      where: { userId }
    });

    const allCourses = await Course.findAll({
      include: [{ model: Question, as: 'questions' }]
    });

    // Get recommended courses for learning path
    const recommendationResult = await AIRecommendationService.generateRecommendations(user, allCourses, userProgress);
    const recommendedCourses = recommendationResult.recommendations;

    const learningPath = await AIRecommendationService.generateLearningPath(user, recommendedCourses, userProgress);

    return learningPath;
  }

  static async getSequentialPath(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userProgress = await UserProgress.findAll({
      where: { userId }
    });

    const allCourses = await Course.findAll({
      include: [{ model: Question, as: 'questions' }]
    });

    // Get recommended courses for sequential path
    const recommendationResult = await AIRecommendationService.generateRecommendations(user, allCourses, userProgress);
    const recommendedCourses = recommendationResult.recommendations;

    const sequentialPath = await AIRecommendationService.generateSequentialLearningPath(user, recommendedCourses, userProgress);

    return sequentialPath;
  }

  static async getAnalytics(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userProgress = await UserProgress.findAll({
      where: { userId },
      include: [
        { model: Course, as: 'course' },
        { model: Question, as: 'question' }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const allCourses = await Course.findAll({
      include: [{ model: Question, as: 'questions' }]
    });

    // Get recommended courses for analytics
    const recommendationResult = await AIRecommendationService.generateRecommendations(user, allCourses, userProgress);
    const recommendedCourses = recommendationResult.recommendations;

    // Filter progress to only include recommended courses
    const recommendedCourseIds = recommendedCourses.map(c => c.id);
    const filteredProgress = userProgress.filter(p => recommendedCourseIds.includes(p.courseId));

    const analytics = {
      totalQuestions: 0,
      completedQuestions: 0,
      totalAttempts: 0,
      averageAttempts: 0,
      completionRate: 0,
      categoryBreakdown: {},
      difficultyBreakdown: {},
      recentActivity: [],
      learningStreak: 0,
      timeSpent: 0
    };

    filteredProgress.forEach(progress => {
      analytics.totalAttempts += progress.attempts;
      if (progress.completed) {
        analytics.completedQuestions++;
      }

      const category = progress.course?.category || 'Unknown';
      if (!analytics.categoryBreakdown[category]) {
        analytics.categoryBreakdown[category] = { completed: 0, total: 0 };
      }
      analytics.categoryBreakdown[category].total++;
      if (progress.completed) {
        analytics.categoryBreakdown[category].completed++;
      }

      const difficulty = progress.question?.difficulty || 'Unknown';
      if (!analytics.difficultyBreakdown[difficulty]) {
        analytics.difficultyBreakdown[difficulty] = { completed: 0, total: 0 };
      }
      analytics.difficultyBreakdown[difficulty].total++;
      if (progress.completed) {
        analytics.difficultyBreakdown[difficulty].completed++;
      }

      if (progress.lastAttemptAt && 
          new Date(progress.lastAttemptAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        analytics.recentActivity.push({
          questionTitle: progress.question?.title,
          courseTitle: progress.course?.title,
          completed: progress.completed,
          attempts: progress.attempts,
          date: progress.lastAttemptAt
        });
      }
    });

    // Calculate total questions from recommended courses only
    recommendedCourses.forEach(course => {
      analytics.totalQuestions += course.questions?.length || 0;
    });

    analytics.completionRate = analytics.totalQuestions > 0 ? 
      Math.round((analytics.completedQuestions / analytics.totalQuestions) * 100) : 0;
    analytics.averageAttempts = analytics.completedQuestions > 0 ? 
      Math.round((analytics.totalAttempts / analytics.completedQuestions) * 10) / 10 : 0;

    const sortedActivity = filteredProgress
      .filter(p => p.lastAttemptAt)
      .sort((a, b) => new Date(b.lastAttemptAt) - new Date(a.lastAttemptAt));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedActivity.length; i++) {
      const activityDate = new Date(sortedActivity[i].lastAttemptAt);
      activityDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    analytics.learningStreak = streak;

    return analytics;
  }
}
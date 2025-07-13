import { User, Course, Question, UserProgress } from '../models/index.js';
import { AIRecommendationService } from './aiRecommendationService.js';

export class ProgressService {
  static async getProgressFeedback(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get recommended courses for this user
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      await Course.findAll({ include: [{ model: Question, as: 'questions' }] }),
      await UserProgress.findAll({ where: { userId } })
    );

    const recommendedCourses = recommendedCoursesResult.recommendations;
    const userProgress = await UserProgress.findAll({ where: { userId } });

    return await AIRecommendationService.generateProgressFeedback(
      user,
      userProgress,
      await Course.findAll({ include: [{ model: Question, as: 'questions' }] }),
      recommendedCourses
    );
  }

  static async getLearningPath(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get recommended courses for this user
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      await Course.findAll({ include: [{ model: Question, as: 'questions' }] }),
      await UserProgress.findAll({ where: { userId } })
    );

    const recommendedCourses = recommendedCoursesResult.recommendations;
    const userProgress = await UserProgress.findAll({ where: { userId } });

    return await AIRecommendationService.generateLearningPath(
      user,
      recommendedCourses,
      userProgress
    );
  }

  static async getSequentialPath(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get recommended courses for this user
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      await Course.findAll({ include: [{ model: Question, as: 'questions' }] }),
      await UserProgress.findAll({ where: { userId } })
    );

    const recommendedCourses = recommendedCoursesResult.recommendations;
    const userProgress = await UserProgress.findAll({ where: { userId } });

    return await AIRecommendationService.generateSequentialLearningPath(
      user,
      recommendedCourses,
      userProgress
    );
  }

  static async getAnalytics(userId) {
    const userProgress = await UserProgress.findAll({
      where: { userId },
      include: [
        {
          model: Question,
          as: 'question',
          include: [{
            model: Course,
            as: 'course'
          }]
        }
      ]
    });

    // Get recommended courses for this user to filter analytics
    const user = await User.findByPk(userId);
    const recommendedCoursesResult = await AIRecommendationService.generateRecommendations(
      user,
      await Course.findAll({ include: [{ model: Question, as: 'questions' }] }),
      userProgress
    );

    const recommendedCourseIds = recommendedCoursesResult.recommendations.map(c => c.id);

    // Filter progress to only include recommended courses
    const filteredProgress = userProgress.filter(p => 
      recommendedCourseIds.includes(p.courseId)
    );

    const totalQuestions = filteredProgress.length;
    const completedQuestions = filteredProgress.filter(p => p.completed).length;
    const totalAttempts = filteredProgress.reduce((sum, p) => sum + p.attempts, 0);
    const averageAttempts = completedQuestions > 0 ? totalAttempts / completedQuestions : 0;
    const completionRate = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

    // Category breakdown (recommended courses only)
    const categoryBreakdown = {};
    filteredProgress.forEach(p => {
      const category = p.question?.course?.category || 'Unknown';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { completed: 0, total: 0 };
      }
      categoryBreakdown[category].total++;
      if (p.completed) {
        categoryBreakdown[category].completed++;
      }
    });

    // Difficulty breakdown (recommended courses only)
    const difficultyBreakdown = {};
    filteredProgress.forEach(p => {
      const difficulty = p.question?.difficulty || 'unknown';
      if (!difficultyBreakdown[difficulty]) {
        difficultyBreakdown[difficulty] = { completed: 0, total: 0 };
      }
      difficultyBreakdown[difficulty].total++;
      if (p.completed) {
        difficultyBreakdown[difficulty].completed++;
      }
    });

    // Recent activity (last 7 days, recommended courses only)
    const recentActivity = filteredProgress
      .filter(p => p.lastAttemptAt && 
        new Date(p.lastAttemptAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .map(p => ({
        questionTitle: p.question?.title || 'Unknown Question',
        courseTitle: p.question?.course?.title || 'Unknown Course',
        completed: p.completed,
        attempts: p.attempts,
        date: p.lastAttemptAt
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Learning streak (consecutive days with activity, recommended courses only)
    const learningStreak = this.calculateLearningStreak(filteredProgress);

    return {
      totalQuestions,
      completedQuestions,
      totalAttempts,
      averageAttempts: Math.round(averageAttempts * 10) / 10,
      completionRate,
      categoryBreakdown,
      difficultyBreakdown,
      recentActivity,
      learningStreak
    };
  }

  static calculateLearningStreak(userProgress) {
    const activityDates = userProgress
      .filter(p => p.lastAttemptAt)
      .map(p => new Date(p.lastAttemptAt).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    if (activityDates.length === 0) return 0;

    let streak = 1;
    const today = new Date().toDateString();
    
    // Check if there's activity today or yesterday
    if (activityDates[0] !== today && 
        activityDates[0] !== new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      return 0;
    }

    for (let i = 1; i < activityDates.length; i++) {
      const currentDate = new Date(activityDates[i]);
      const previousDate = new Date(activityDates[i - 1]);
      const dayDifference = (previousDate - currentDate) / (24 * 60 * 60 * 1000);

      if (dayDifference === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
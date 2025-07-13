import { Course, Question, UserProgress, User } from '../models/index.js';
import { AIRecommendationService } from './aiRecommendationService.js';
import { DatabaseService } from './databaseService.js';

export class CourseService {
  static async getAllCoursesWithProgress(userId) {
    const courses = await Course.findAll({
      include: [{
        model: Question,
        as: 'questions'
      }]
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await this.calculateCourseProgress(course.id, userId);
        return {
          ...course.toJSON(),
          progress
        };
      })
    );

    return coursesWithProgress;
  }

  static async getRecommendedCourses(userId, forceRefresh = false) {
    try {
      // Get user and all courses
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const allCourses = await Course.findAll({
        include: [{
          model: Question,
          as: 'questions'
        }]
      });

      const userProgress = await UserProgress.findAll({
        where: { userId }
      });

      // Get AI recommendations
      const result = await AIRecommendationService.generateRecommendations(
        user, 
        allCourses, 
        userProgress,
        forceRefresh
      );

      // Add progress to recommended courses
      const coursesWithProgress = await Promise.all(
        result.recommendations.map(async (course) => {
          const progress = await this.calculateCourseProgress(course.id, userId);
          return {
            ...course,
            progress
          };
        })
      );

      return {
        courses: coursesWithProgress,
        metadata: result.metadata,
        aiResponse: result.aiResponse,
        rawAiResponse: result.rawAiResponse
      };

    } catch (error) {
      console.error('Course recommendation error:', error);
      throw error;
    }
  }

  static async getCourseByIdWithProgress(courseId, userId) {
    const course = await Course.findByPk(courseId, {
      include: [{
        model: Question,
        as: 'questions'
      }]
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const progress = await this.calculateCourseProgress(courseId, userId);
    
    // Add progress to each question
    const questionsWithProgress = await Promise.all(
      course.questions.map(async (question) => {
        const questionProgress = await UserProgress.findOne({
          where: { userId, questionId: question.id }
        });

        return {
          ...question.toJSON(),
          completed: questionProgress?.completed || false,
          attempts: questionProgress?.attempts || 0,
          lastAttemptAt: questionProgress?.lastAttemptAt
        };
      })
    );

    return {
      ...course.toJSON(),
      questions: questionsWithProgress,
      progress
    };
  }

  static async calculateCourseProgress(courseId, userId) {
    const totalQuestions = await Question.count({
      where: { courseId }
    });

    const completedQuestions = await UserProgress.count({
      where: { 
        userId, 
        courseId,
        completed: true 
      }
    });

    const percentage = totalQuestions > 0 ? 
      Math.round((completedQuestions / totalQuestions) * 100) : 0;

    return {
      completed: completedQuestions,
      total: totalQuestions,
      percentage
    };
  }
}
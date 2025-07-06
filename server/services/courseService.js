import { Course, Question, User, UserProgress } from '../models/index.js';
import { AIRecommendationService } from './aiRecommendationService.js';
import { DatabaseService } from './databaseService.js';

export class CourseService {
  static async getAllCoursesWithProgress(userId) {
    const courses = await DatabaseService.findAllCourses(true);

    const userProgress = await DatabaseService.findUserProgress(userId);

    const coursesWithProgress = courses.map(course => {
      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const totalQuestions = course.questions.length;
      const completedQuestions = courseProgress.filter(p => p.completed).length;
      const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

      return {
        ...course.toJSON(),
        progress: {
          completed: completedQuestions,
          total: totalQuestions,
          percentage: progressPercentage
        }
      };
    });

    return coursesWithProgress;
  }

  static async getRecommendedCourses(userId) {
    const user = await DatabaseService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const allCourses = await DatabaseService.findAllCourses(true);

    const userProgress = await DatabaseService.findUserProgress(userId);

    const result = await AIRecommendationService.generateRecommendations(user, allCourses, userProgress);

    return {
      courses: result.recommendations,
      strategy: result.strategy,
      metadata: result.metadata
    };
  }

  static async getCourseByIdWithProgress(courseId, userId) {
    const course = await DatabaseService.findCourseById(courseId, true);

    if (!course) {
      throw new Error('Course not found');
    }

    const userProgress = await DatabaseService.getUserProgressForCourse(userId, course.id);

    const questionsWithProgress = course.questions.map(question => {
      const questionProgress = userProgress.find(p => p.questionId === question.id);
      return {
        ...question.toJSON(),
        completed: questionProgress?.completed || false,
        attempts: questionProgress?.attempts || 0,
        lastAttemptAt: questionProgress?.lastAttemptAt || null
      };
    });

    const totalQuestions = course.questions.length;
    const completedQuestions = userProgress.filter(p => p.completed).length;
    const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

    return {
      ...course.toJSON(),
      questions: questionsWithProgress,
      progress: {
        completed: completedQuestions,
        total: totalQuestions,
        percentage: progressPercentage
      }
    };
  }
}
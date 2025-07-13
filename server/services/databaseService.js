import { sequelize } from '../models/index.js';

export class DatabaseService {
  static async findUserById(id) {
    const { User } = await import('../models/index.js');
    return await User.findByPk(id);
  }

  static async findUserByEmail(email) {
    const { User } = await import('../models/index.js');
    return await User.findOne({ where: { email } });
  }

  static async createUser(userData) {
    const { User } = await import('../models/index.js');
    return await User.create(userData);
  }

  static async updateUser(id, updateData) {
    const { User } = await import('../models/index.js');
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.update(updateData);
  }

  static async findAllCourses() {
    const { Course, Question } = await import('../models/index.js');
    return await Course.findAll({
      include: [{
        model: Question,
        as: 'questions'
      }]
    });
  }

  static async findCourseById(id) {
    const { Course, Question } = await import('../models/index.js');
    return await Course.findByPk(id, {
      include: [{
        model: Question,
        as: 'questions'
      }]
    });
  }

  static async findQuestionById(id) {
    const { Question, Course } = await import('../models/index.js');
    return await Question.findByPk(id, {
      include: [{
        model: Course,
        as: 'course'
      }]
    });
  }

  static async findUserProgress(userId, filters = {}) {
    const { UserProgress, Question, Course } = await import('../models/index.js');
    const whereClause = { userId, ...filters };
    
    return await UserProgress.findAll({
      where: whereClause,
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
  }

  static async createOrUpdateProgress(userId, questionId, courseId, updateData) {
    const { UserProgress } = await import('../models/index.js');
    
    const [progress, created] = await UserProgress.findOrCreate({
      where: { userId, questionId, courseId },
      defaults: {
        ...updateData,
        attempts: 1,
        lastAttemptAt: new Date()
      }
    });

    if (!created) {
      await progress.update({
        ...updateData,
        attempts: progress.attempts + 1,
        lastAttemptAt: new Date()
      });
    }

    return progress;
  }

  static async getProgressStats(userId, courseId = null) {
    const { UserProgress } = await import('../models/index.js');
    const whereClause = { userId };
    if (courseId) {
      whereClause.courseId = courseId;
    }

    const totalQuestions = await UserProgress.count({ where: whereClause });
    const completedQuestions = await UserProgress.count({ 
      where: { ...whereClause, completed: true } 
    });

    return {
      total: totalQuestions,
      completed: completedQuestions,
      percentage: totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0
    };
  }

  static async transaction(callback) {
    const transaction = await sequelize.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async healthCheck() {
    try {
      await sequelize.authenticate();
      return { status: 'healthy', database: 'connected' };
    } catch (error) {
      return { status: 'unhealthy', database: 'disconnected', error: error.message };
    }
  }
}
import { User, Course, Question, UserProgress } from '../models/index.js';

export class DatabaseService {
  static async findUserById(userId) {
    return await User.findByPk(userId);
  }

  static async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async createUser(userData) {
    return await User.create(userData);
  }

  static async updateUser(userId, updateData) {
    const [updatedRowsCount] = await User.update(updateData, { 
      where: { id: userId } 
    });
    return updatedRowsCount > 0;
  }

  static async findAllCourses(includeQuestions = false) {
    const includeOptions = includeQuestions ? [
      {
        model: Question,
        as: 'questions',
        attributes: ['id', 'title', 'difficulty']
      }
    ] : [];

    return await Course.findAll({
      include: includeOptions
    });
  }

  static async findCourseById(courseId, includeQuestions = false) {
    const includeOptions = includeQuestions ? [
      {
        model: Question,
        as: 'questions'
      }
    ] : [];

    return await Course.findByPk(courseId, {
      include: includeOptions
    });
  }

  static async findQuestionById(questionId) {
    return await Question.findByPk(questionId);
  }

  static async findUserProgress(userId, filters = {}) {
    const whereClause = { userId, ...filters };
    
    return await UserProgress.findAll({
      where: whereClause,
      include: [
        { model: Course, as: 'course' },
        { model: Question, as: 'question' }
      ],
      order: [['updatedAt', 'DESC']]
    });
  }

  static async findOrCreateUserProgress(userId, questionId, courseId) {
    return await UserProgress.findOrCreate({
      where: { 
        userId,
        questionId
      },
      defaults: {
        userId,
        courseId,
        questionId,
        attempts: 0,
        completed: false
      }
    });
  }

  static async updateUserProgress(progressId, updateData) {
    const progress = await UserProgress.findByPk(progressId);
    if (progress) {
      return await progress.update(updateData);
    }
    return null;
  }

  static async getUserProgressForCourse(userId, courseId) {
    return await UserProgress.findAll({
      where: { userId, courseId }
    });
  }

  static async getUserProgressForQuestion(userId, questionId) {
    return await UserProgress.findOne({
      where: { userId, questionId }
    });
  }
}
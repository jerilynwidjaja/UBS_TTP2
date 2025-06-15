import { Sequelize } from 'sequelize';
import UserModel from './User.js';
import CourseModel from './Course.js';
import QuestionModel from './Question.js';
import UserProgressModel from './UserProgress.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = UserModel(sequelize, Sequelize.DataTypes);
const Course = CourseModel(sequelize, Sequelize.DataTypes);
const Question = QuestionModel(sequelize, Sequelize.DataTypes);
const UserProgress = UserProgressModel(sequelize, Sequelize.DataTypes);

Course.hasMany(Question, { foreignKey: 'courseId', as: 'questions' });
Question.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.hasMany(UserProgress, { foreignKey: 'userId', as: 'progress' });
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(UserProgress, { foreignKey: 'courseId', as: 'userProgress' });
UserProgress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Question.hasMany(UserProgress, { foreignKey: 'questionId', as: 'userProgress' });
UserProgress.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

export { sequelize, User, Course, Question, UserProgress };
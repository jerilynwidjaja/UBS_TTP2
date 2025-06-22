import express from 'express';
import { Course, Question, User, UserProgress } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { AIRecommendationService } from '../services/aiRecommendationService.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: ['id', 'title', 'difficulty']
        }
      ]
    });

    const userProgress = await UserProgress.findAll({
      where: { userId: req.userId },
      attributes: ['courseId', 'questionId', 'completed']
    });

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

    res.json({ courses: coursesWithProgress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/recommended', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allCourses = await Course.findAll({
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: ['id', 'title', 'difficulty']
        }
      ]
    });

    const userProgress = await UserProgress.findAll({
      where: { userId: req.userId },
      attributes: ['courseId', 'questionId', 'completed', 'attempts', 'completedAt']
    });

    const result = await AIRecommendationService.generateRecommendations(user, allCourses, userProgress);

    res.json({ 
      courses: result.recommendations,
      strategy: result.strategy,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          as: 'questions'
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userProgress = await UserProgress.findAll({
      where: { 
        userId: req.userId,
        courseId: course.id
      }
    });

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

    const courseWithProgress = {
      ...course.toJSON(),
      questions: questionsWithProgress,
      progress: {
        completed: completedQuestions,
        total: totalQuestions,
        percentage: progressPercentage
      }
    };

    res.json({ course: courseWithProgress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
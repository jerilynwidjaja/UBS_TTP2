import express from 'express';
import { Course, Question, User, UserProgress } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { Sequelize } from 'sequelize';

const router = express.Router();

const generateRecommendations = async (user, allCourses, userProgress) => {
  const skillProficiency = {};
  const completionRates = {};
  
  for (const course of allCourses) {
    const courseProgress = userProgress.filter(p => p.courseId === course.id);
    const totalQuestions = course.questions.length;
    const completedQuestions = courseProgress.filter(p => p.completed).length;
    const completionRate = totalQuestions > 0 ? completedQuestions / totalQuestions : 0;
    
    completionRates[course.id] = completionRate;
    
    if (course.category) {
      if (!skillProficiency[course.category]) {
        skillProficiency[course.category] = [];
      }
      skillProficiency[course.category].push(completionRate);
    }
  }

  const avgProficiency = {};
  Object.keys(skillProficiency).forEach(category => {
    const rates = skillProficiency[category];
    avgProficiency[category] = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
  });

  const scoredCourses = allCourses.map(course => {
    let score = 0;
    const factors = [];

    if (user.learningGoals && user.learningGoals.length > 0) {
      const goalAlignment = user.learningGoals.reduce((alignment, goal) => {
        const titleMatch = course.title.toLowerCase().includes(goal.toLowerCase()) ? 0.8 : 0;
        const descMatch = course.description.toLowerCase().includes(goal.toLowerCase()) ? 0.6 : 0;
        const categoryMatch = course.category.toLowerCase().includes(goal.toLowerCase()) ? 0.7 : 0;
        const tagMatch = course.tags && course.tags.some(tag => 
          tag.toLowerCase().includes(goal.toLowerCase())
        ) ? 0.5 : 0;
        
        return Math.max(alignment, titleMatch, descMatch, categoryMatch, tagMatch);
      }, 0);
      
      score += goalAlignment * 0.4;
      factors.push({ name: 'Goal Alignment', value: goalAlignment, weight: 0.4 });
    }

    let levelScore = 0;
    if (user.level && course.level) {
      const userLevelNum = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }[user.level] || 1;
      const courseLevelNum = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }[course.level] || 1;
      
      if (userLevelNum === courseLevelNum) {
        levelScore = 1.0;
      } else if (Math.abs(userLevelNum - courseLevelNum) === 1) {
        levelScore = 0.7;
      } else {
        levelScore = 0.3;
      }
    }
    score += levelScore * 0.25;
    factors.push({ name: 'Level Match', value: levelScore, weight: 0.25 });

    let proficiencyScore = 0;
    if (course.category && avgProficiency[course.category] !== undefined) {
      const proficiency = avgProficiency[course.category];
      if (proficiency >= 0.3 && proficiency <= 0.7) {
        proficiencyScore = 1.0; 
      } else if (proficiency < 0.3) {
        proficiencyScore = 0.8; 
      } else {
        proficiencyScore = 0.4; 
      }
    } else {
      proficiencyScore = 0.9; 
    }
    score += proficiencyScore * 0.2;
    factors.push({ name: 'Proficiency Gap', value: proficiencyScore, weight: 0.2 });

    const currentProgress = completionRates[course.id] || 0;
    let progressScore = 0;
    if (currentProgress === 0) {
      progressScore = 1.0; 
    } else if (currentProgress < 0.5) {
      progressScore = 0.9;
    } else if (currentProgress < 1.0) {
      progressScore = 0.8; 
    } else {
      progressScore = 0.2; 
    }
    score += progressScore * 0.1;
    factors.push({ name: 'Progress Status', value: progressScore, weight: 0.1 });

    let timeScore = 0.5; 
    if (user.timeAvailability && course.estimatedHours) {
      const timeCommitment = user.timeAvailability;
      const courseHours = course.estimatedHours;
      
      if (timeCommitment === '1-3' && courseHours <= 4) timeScore = 1.0;
      else if (timeCommitment === '4-6' && courseHours <= 8) timeScore = 1.0;
      else if (timeCommitment === '7-10' && courseHours <= 12) timeScore = 1.0;
      else if (timeCommitment === '10+') timeScore = 1.0;
      else timeScore = 0.6;
    }
    score += timeScore * 0.05;
    factors.push({ name: 'Time Match', value: timeScore, weight: 0.05 });

    return {
      course,
      score,
      factors,
      reasoning: generateRecommendationReasoning(factors, course, user)
    };
  });

  return scoredCourses
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};

const generateRecommendationReasoning = (factors, course, user) => {
  const topFactors = factors
    .sort((a, b) => (b.value * b.weight) - (a.value * a.weight))
    .slice(0, 2);

  let reasoning = `Recommended because: `;
  const reasons = [];

  topFactors.forEach(factor => {
    switch (factor.name) {
      case 'Goal Alignment':
        if (factor.value > 0.5) {
          reasons.push(`matches your learning goals`);
        }
        break;
      case 'Level Match':
        if (factor.value > 0.7) {
          reasons.push(`perfect fit for your ${user.level} level`);
        }
        break;
      case 'Proficiency Gap':
        if (factor.value > 0.8) {
          reasons.push(`builds on your existing skills`);
        }
        break;
      case 'Progress Status':
        if (factor.value > 0.8) {
          reasons.push(`fresh content to explore`);
        }
        break;
    }
  });

  if (reasons.length === 0) {
    reasons.push(`good match for your profile`);
  }

  return reasoning + reasons.join(' and ');
};

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

    const recommendations = await generateRecommendations(user, allCourses, userProgress);

    const recommendedCoursesWithProgress = recommendations.map(({ course, score, factors, reasoning }) => {
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
        },
        recommendation: {
          score: Math.round(score * 100),
          reasoning,
          factors: factors.map(f => ({
            name: f.name,
            score: Math.round(f.value * 100),
            weight: Math.round(f.weight * 100)
          }))
        }
      };
    });

    res.json({ 
      courses: recommendedCoursesWithProgress,
      metadata: {
        algorithm: 'AI-Powered Multi-Factor Scoring',
        factors: [
          'Learning Goals Alignment (40%)',
          'Skill Level Appropriateness (25%)',
          'Category Proficiency Gap (20%)',
          'Progress Status (10%)',
          'Time Availability Match (5%)'
        ]
      }
    });
  } catch (error) {
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
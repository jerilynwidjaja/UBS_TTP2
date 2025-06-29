
import express from 'express';
import { User, UserProgress, Course, Question } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { AIRecommendationService } from '../services/aiRecommendationService.js';

const router = express.Router();

router.get('/feedback', authenticateToken, async (req, res) => {
try {
const user = await User.findByPk(req.userId);
if (!user) {
return res.status(404).json({ message: 'User not found' });
}

const userProgress = await UserProgress.findAll({
where: { userId: req.userId },
include: [
{ model: Course, as: 'course' },
{ model: Question, as: 'question' }
]
});

const allCourses = await Course.findAll({
include: [{ model: Question, as: 'questions' }]
});

const feedback = await AIRecommendationService.generateProgressFeedback(user, userProgress, allCourses);

res.json({ feedback });
} catch (error) {
console.error('Progress feedback error:', error);
res.status(500).json({ message: 'Server error', error: error.message });
}
});

router.get('/learning-path', authenticateToken, async (req, res) => {
try {
const user = await User.findByPk(req.userId);
if (!user) {
return res.status(404).json({ message: 'User not found' });
}

const userProgress = await UserProgress.findAll({
where: { userId: req.userId }
});

const allCourses = await Course.findAll({
include: [{ model: Question, as: 'questions' }]
});

const learningPath = await AIRecommendationService.generateLearningPath(user, allCourses, userProgress);

res.json({ learningPath });
} catch (error) {
console.error('Learning path error:', error);
res.status(500).json({ message: 'Server error', error: error.message });
}
});

router.get('/sequential-path', authenticateToken, async (req, res) => {
try {
const user = await User.findByPk(req.userId);
if (!user) {
return res.status(404).json({ message: 'User not found' });
}

const userProgress = await UserProgress.findAll({
where: { userId: req.userId }
});

const allCourses = await Course.findAll({
include: [{ model: Question, as: 'questions' }]
});

const sequentialPath = await AIRecommendationService.generateSequentialLearningPath(user, allCourses, userProgress);

res.json({ sequentialPath });
} catch (error) {
console.error('Sequential learning path error:', error);
res.status(500).json({ message: 'Server error', error: error.message });
}
});

router.get('/analytics', authenticateToken, async (req, res) => {
try {
const userProgress = await UserProgress.findAll({
where: { userId: req.userId },
include: [
{ model: Course, as: 'course' },
{ model: Question, as: 'question' }
],
order: [['updatedAt', 'DESC']]
});

const allCourses = await Course.findAll({
include: [{ model: Question, as: 'questions' }]
});

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

userProgress.forEach(progress => {
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

allCourses.forEach(course => {
analytics.totalQuestions += course.questions.length;
});

analytics.completionRate = analytics.totalQuestions > 0 ?
Math.round((analytics.completedQuestions / analytics.totalQuestions) * 100) : 0;
analytics.averageAttempts = analytics.completedQuestions > 0 ?
Math.round((analytics.totalAttempts / analytics.completedQuestions) * 10) / 10 : 0;

const sortedActivity = userProgress
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

res.json({ analytics });
} catch (error) {
console.error('Analytics error:', error);
res.status(500).json({ message: 'Server error', error: error.message });
}
});

export default router;
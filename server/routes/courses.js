import express from 'express';
import { CourseService } from '../services/courseService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await CourseService.getAllCoursesWithProgress(req.userId);
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/recommended', authenticateToken, async (req, res) => {
  try {
    const result = await CourseService.getRecommendedCourses(req.userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await CourseService.getCourseByIdWithProgress(req.params.id, req.userId);
    res.json({ course });
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
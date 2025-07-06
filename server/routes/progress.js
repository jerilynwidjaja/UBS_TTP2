import express from 'express';
import { ProgressService } from '../services/progressService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/feedback', authenticateToken, async (req, res) => {
  try {
    const feedback = await ProgressService.getProgressFeedback(req.userId);
    res.json({ feedback });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Progress feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/learning-path', authenticateToken, async (req, res) => {
  try {
    const learningPath = await ProgressService.getLearningPath(req.userId);
    res.json({ learningPath });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Learning path error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/sequential-path', authenticateToken, async (req, res) => {
  try {
    const sequentialPath = await ProgressService.getSequentialPath(req.userId);
    res.json({ sequentialPath });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Sequential learning path error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const analytics = await ProgressService.getAnalytics(req.userId);
    res.json({ analytics });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
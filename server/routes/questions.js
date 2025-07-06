import express from 'express';
import { QuestionService } from '../services/questionService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const question = await QuestionService.getQuestionWithProgress(req.params.id, req.userId);
    res.json({ question });
  } catch (error) {
    if (error.message === 'Question not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const result = await QuestionService.submitCodeForExecution(req.params.id, req.userId, code);
    res.json(result);
  } catch (error) {
    if (error.message === 'Question not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Execution error', error: error.message });
  }
});

export default router;
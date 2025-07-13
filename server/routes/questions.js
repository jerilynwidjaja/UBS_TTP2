import express from 'express';
import { QuestionService } from '../services/questionService.js';
import { ValidationService } from '../services/validationService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get question by ID with progress
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (!ValidationService.validateId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    const question = await QuestionService.getQuestionWithProgress(req.params.id, req.userId);
    res.json({ question });
  } catch (error) {
    if (error.message === 'Question not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit code for execution
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    if (!ValidationService.validateId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    // Validate code submission
    const validationErrors = ValidationService.validateCodeSubmission(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    const result = await QuestionService.submitCodeForExecution(
      req.params.id, 
      req.userId, 
      req.body.code
    );
    res.json(result);
  } catch (error) {
    if (error.message === 'Question not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Execution error', error: error.message });
  }
});

export default router;
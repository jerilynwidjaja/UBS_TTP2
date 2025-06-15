import express from 'express';
import axios from 'axios';
import { Question, UserProgress } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const userProgress = await UserProgress.findOne({
      where: { 
        userId: req.userId,
        questionId: question.id
      }
    });

    const questionWithProgress = {
      ...question.toJSON(),
      completed: userProgress?.completed || false,
      attempts: userProgress?.attempts || 0,
      lastAttemptAt: userProgress?.lastAttemptAt || null
    };

    res.json({ question: questionWithProgress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    const question = await Question.findByPk(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const [userProgress] = await UserProgress.findOrCreate({
      where: { 
        userId: req.userId,
        questionId: question.id
      },
      defaults: {
        userId: req.userId,
        courseId: question.courseId,
        questionId: question.id,
        attempts: 0,
        completed: false
      }
    });

    await userProgress.update({
      attempts: userProgress.attempts + 1,
      lastAttemptAt: new Date()
    });

    const submissionData = {
      source_code: code,
      language_id: question.languageId,
      stdin: ''
    };

    console.log(submissionData);

    try {
      const response = await axios.post(
        `${process.env.JUDGE0_API_URL}/submissions`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      const token = response.data.token;

      await new Promise(resolve => setTimeout(resolve, 2000)); 

      const resultResponse = await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      const result = resultResponse.data;

      console.log(result);
    
      const actualOutput = result.stdout ? result.stdout : '';
      const passed = actualOutput.trim() === question.expectedOutput.trim();

      console.log(actualOutput);

      if (passed && !userProgress.completed) {
        await userProgress.update({
          completed: true,
          completedAt: new Date()
        });
      }

      res.json({
        passed,
        output: actualOutput,
        error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
        status: result.status.description
      });

    } catch (judge0Error) {
      if (question.languageId === 63) { 
        try {
          const result = eval(code);
          const passed = String(result).trim() === question.expectedOutput.trim();
          
          if (passed && !userProgress.completed) {
            await userProgress.update({
              completed: true,
              completedAt: new Date()
            });
          }
          
          res.json({
            passed,
            output: String(result),
            error: null,
            status: 'Accepted'
          });
        } catch (evalError) {
          res.json({
            passed: false,
            output: '',
            error: evalError.message,
            status: 'Runtime Error'
          });
        }
      } else {
        throw judge0Error;
      }
    }

  } catch (error) {
    res.status(500).json({ message: 'Execution error', error: error.message });
  }
});

export default router;
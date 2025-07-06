import axios from 'axios';
import { DatabaseService } from './databaseService.js';

export class QuestionService {
  static async getQuestionWithProgress(questionId, userId) {
    const question = await DatabaseService.findQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const userProgress = await DatabaseService.getUserProgressForQuestion(userId, question.id);

    return {
      ...question.toJSON(),
      completed: userProgress?.completed || false,
      attempts: userProgress?.attempts || 0,
      lastAttemptAt: userProgress?.lastAttemptAt || null
    };
  }

  static async submitCodeForExecution(questionId, userId, code) {
    const question = await DatabaseService.findQuestionById(questionId);
    
    if (!question) {
      throw new Error('Question not found');
    }

    const [userProgress] = await DatabaseService.findOrCreateUserProgress(
      userId, 
      question.id, 
      question.courseId
    );

    await DatabaseService.updateUserProgress(userProgress.id, {
      attempts: userProgress.attempts + 1,
      lastAttemptAt: new Date()
    });

    const executionResult = await this.executeCode(code, question);

    if (executionResult.passed && !userProgress.completed) {
      await DatabaseService.updateUserProgress(userProgress.id, {
        completed: true,
        completedAt: new Date()
      });
    }

    return executionResult;
  }

  static async executeCode(code, question) {

    const submissionData = {
      source_code: code,
      language_id: question.languageId,
      stdin: ''
    };

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
      
      const actualOutput = result.stdout ? result.stdout : '';
      const passed = actualOutput.trim() === question.expectedOutput.trim();

      return {
        passed,
        output: actualOutput,
        error: result.stderr ? result.stderr : null,
        status: result.status.description
      };

    } catch (judge0Error) {

      if (question.languageId === 63) { 
        try {
          const result = eval(code);
          const passed = String(result).trim() === question.expectedOutput.trim();
          
          return {
            passed,
            output: String(result),
            error: null,
            status: 'Accepted'
          };
        } catch (evalError) {
          return {
            passed: false,
            output: '',
            error: evalError.message,
            status: 'Runtime Error'
          };
        }
      } else {
        throw judge0Error;
      }
    }
  }
}
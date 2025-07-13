import { Question, Course, UserProgress } from '../models/index.js';
import axios from 'axios';

export class QuestionService {
  static async getQuestionWithProgress(questionId, userId) {
    const question = await Question.findByPk(questionId, {
      include: [{
        model: Course,
        as: 'course'
      }]
    });

    if (!question) {
      throw new Error('Question not found');
    }

    const progress = await UserProgress.findOne({
      where: { userId, questionId }
    });

    return {
      ...question.toJSON(),
      completed: progress?.completed || false,
      attempts: progress?.attempts || 0,
      lastAttemptAt: progress?.lastAttemptAt
    };
  }

  static async submitCodeForExecution(questionId, userId, code) {
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    try {
      // Update or create progress record
      const [progress, created] = await UserProgress.findOrCreate({
        where: { userId, questionId, courseId: question.courseId },
        defaults: {
          attempts: 1,
          lastAttemptAt: new Date()
        }
      });

      if (!created) {
        await progress.update({
          attempts: progress.attempts + 1,
          lastAttemptAt: new Date()
        });
      }

      // Execute code using Judge0
      const result = await this.executeCodeWithJudge0(code, question);

      // If execution passed, mark as completed
      if (result.passed && !progress.completed) {
        await progress.update({
          completed: true,
          completedAt: new Date()
        });
      }

      return result;

    } catch (error) {
      console.error('Code execution error:', error);
      throw new Error('Code execution failed');
    }
  }

  static async executeCodeWithJudge0(code, question) {
    try {
      const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
      const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'demo-key'; // You'll need to get this from RapidAPI
      
      // Language ID mapping for Judge0
      const languageMap = {
        63: 63, // JavaScript (Node.js)
        71: 71, // Python
        62: 62, // Java
        54: 54, // C++
        50: 50, // C
        51: 51, // C#
        78: 78, // Kotlin
        72: 72, // Ruby
        73: 73, // Rust
        68: 68, // PHP
        60: 60, // Go
        74: 74, // TypeScript
        82: 82, // SQL
        75: 75  // Swift
      };

      const languageId = languageMap[question.languageId] || 63;

      // Submit code for execution
      const submissionResponse = await axios.post(
        `${JUDGE0_API_URL}/submissions`,
        {
          source_code: code,
          language_id: languageId,
          stdin: '', // Add input if needed
          expected_output: question.expectedOutput
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      const submissionToken = submissionResponse.data.token;

      // Wait for execution to complete
      let attempts = 0;
      const maxAttempts = 10;
      let executionResult;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const resultResponse = await axios.get(
          `${JUDGE0_API_URL}/submissions/${submissionToken}`,
          {
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          }
        );

        executionResult = resultResponse.data;
        
        if (executionResult.status.id > 2) { // Status > 2 means execution is complete
          break;
        }
        
        attempts++;
      }

      if (!executionResult) {
        throw new Error('Execution timeout');
      }

      // Process the result
      const output = executionResult.stdout || '';
      const error = executionResult.stderr || executionResult.compile_output || '';
      const statusId = executionResult.status.id;
      
      // Status codes: 3 = Accepted, 4 = Wrong Answer, 5 = Time Limit Exceeded, etc.
      const passed = statusId === 3 && output.trim() === question.expectedOutput?.trim();
      
      const statusMap = {
        3: 'Accepted',
        4: 'Wrong Answer',
        5: 'Time Limit Exceeded',
        6: 'Compilation Error',
        7: 'Runtime Error (SIGSEGV)',
        8: 'Runtime Error (SIGXFSZ)',
        9: 'Runtime Error (SIGFPE)',
        10: 'Runtime Error (SIGABRT)',
        11: 'Runtime Error (NZEC)',
        12: 'Runtime Error (Other)',
        13: 'Internal Error',
        14: 'Exec Format Error'
      };

      return {
        passed,
        output,
        error: error || null,
        status: statusMap[statusId] || 'Unknown',
        executionTime: executionResult.time,
        memory: executionResult.memory
      };

    } catch (error) {
      console.error('Judge0 execution error:', error);
      
      // Fallback to simple JavaScript execution for demo purposes
      if (question.languageId === 63) {
        return this.fallbackJavaScriptExecution(code, question);
      }
      
      return {
        passed: false,
        output: '',
        error: 'Code execution service unavailable. Please try again later.',
        status: 'Service Error'
      };
    }
  }

  static fallbackJavaScriptExecution(code, question) {
    try {
      let output = '';
      let passed = false;

      // Capture console.log output
      const originalLog = console.log;
      const logs = [];
      console.log = (...args) => logs.push(args.join(' '));

      // Execute the code in a try-catch
      try {
        eval(code);
        console.log = originalLog;
        output = logs.join('\n');
        passed = output.trim() === question.expectedOutput?.trim();
      } catch (execError) {
        console.log = originalLog;
        return {
          passed: false,
          output: '',
          error: execError.message,
          status: 'Runtime Error'
        };
      }

      return {
        passed,
        output,
        error: null,
        status: passed ? 'Accepted' : 'Wrong Answer'
      };

    } catch (error) {
      return {
        passed: false,
        output: '',
        error: error.message,
        status: 'Execution Error'
      };
    }
  }

  static getDifficultyColor(difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  }

  static getLanguageConfig(languageId) {
    const configs = {
      63: { name: 'JavaScript', monaco: 'javascript', extension: 'js' },
      71: { name: 'Python', monaco: 'python', extension: 'py' },
      62: { name: 'Java', monaco: 'java', extension: 'java' },
      54: { name: 'C++', monaco: 'cpp', extension: 'cpp' },
      50: { name: 'C', monaco: 'c', extension: 'c' },
      51: { name: 'C#', monaco: 'csharp', extension: 'cs' },
      78: { name: 'Kotlin', monaco: 'kotlin', extension: 'kt' },
      72: { name: 'Ruby', monaco: 'ruby', extension: 'rb' },
      73: { name: 'Rust', monaco: 'rust', extension: 'rs' },
      68: { name: 'PHP', monaco: 'php', extension: 'php' },
      60: { name: 'Go', monaco: 'go', extension: 'go' },
      74: { name: 'TypeScript', monaco: 'typescript', extension: 'ts' },
      82: { name: 'SQL', monaco: 'sql', extension: 'sql' },
      75: { name: 'Swift', monaco: 'swift', extension: 'swift' }
    };
    return configs[languageId] || configs[63];
  }
}
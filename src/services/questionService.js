import axios from 'axios';

export class QuestionService {
  static LANGUAGE_CONFIG = {
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

  static async getQuestionById(id) {
    const response = await axios.get(`http://52.221.205.14:8000/api/questions/${id}`);
    return response.data.question;
  }

  static async submitCode(questionId, code) {
    const response = await axios.post(`http://52.221.205.14:8000/api/questions/${questionId}/submit`, {
      code
    });
    return response.data;
  }

  static getLanguageConfig(languageId) {
    return this.LANGUAGE_CONFIG[languageId] || this.LANGUAGE_CONFIG[63]; // Default to JavaScript
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
}
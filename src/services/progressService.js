import axios from 'axios';

export class ProgressService {
  static async getProgressFeedback() {
    const response = await axios.get('http://52.221.205.14:8000/api/progress/feedback');
    return response.data.feedback;
  }

  static async getLearningPath() {
    const response = await axios.get('http://52.221.205.14:8000/api/progress/learning-path');
    return response.data.learningPath;
  }

  static async getSequentialPath() {
    const response = await axios.get('http://52.221.205.14:8000/api/progress/sequential-path');
    return response.data.sequentialPath;
  }

  static async getAnalytics() {
    const response = await axios.get('http://52.221.205.14:8000/api/progress/analytics');
    return response.data.analytics;
  }

  static getPriorityColor(priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  }
}
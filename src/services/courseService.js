import axios from 'axios';

export class CourseService {
  static courseThumbnails = {
    'JavaScript Fundamentals': 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Python Programming Basics': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Data Structures in JavaScript': 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Advanced Python Concepts': 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Algorithm Design & Analysis': 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400',
    'System Design Fundamentals': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  static async getAllCourses() {
    const response = await axios.get('http://localhost:8000/api/courses');
    return this.addThumbnailsToCourses(response.data.courses);
  }

  static async getRecommendedCourses() {
    const response = await axios.get('http://localhost:8000/api/courses/recommended');
    return {
      ...response.data,
      courses: this.addThumbnailsToCourses(response.data.courses)
    };
  }

  static async getCourseById(id) {
    const response = await axios.get(`http://localhost:8000/api/courses/${id}`);
    const course = response.data.course;
    return {
      ...course,
      thumbnail: this.courseThumbnails[course.title] || 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
  }

  static addThumbnailsToCourses(courses) {
    return courses.map(course => ({
      ...course,
      thumbnail: this.courseThumbnails[course.title] || 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400'
    }));
  }

  static getLevelColor(level) {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  }

  static getProgressColor(percentage) {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-gray-300 dark:bg-gray-600';
  }
}
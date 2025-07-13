import axios from 'axios';

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  category: string;
  estimatedHours: number;
  questions: Array<{ id: number; title: string; difficulty: string; completed?: boolean; attempts?: number; lastAttemptAt?: string }>;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  recommendation?: {
    score: number;
    reasoning: string;
    skillAlignment?: string;
    goalAlignment?: string;
    careerImpact?: string;
    expectedOutcome?: string;
    factors: Array<{
      name: string;
      score: number;
      weight: number;
    }>;
    learningPath?: string;
    aiGenerated: boolean;
    fallbackUsed?: boolean;
    aiResponse?: any;
  };
  thumbnail?: string;
  videos?: Array<{
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    order: number;
  }>;
}

export interface RecommendationResponse {
  courses: Course[];
  strategy: string;
  metadata: {
    algorithm: string;
    generatedAt: string;
    model: string;
    aiUsed: boolean;
    fallbackReason?: string;
    quotaExceeded?: boolean;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    remainingTokens?: number;
    requestId?: string;
    processingTime?: number;
    clicksBeforeQuota?: number;
    estimatedQuotaLimit?: number;
  };
  aiResponse?: any;
  rawAiResponse?: string;
}

export class CourseService {
  private static courseThumbnails: Record<string, string> = {
    'JavaScript Fundamentals': 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Python Programming Basics': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Data Structures in JavaScript': 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Advanced Python Concepts': 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Algorithm Design & Analysis': 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400',
    'System Design Fundamentals': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  private static courseVideos: Record<string, Array<{
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    order: number;
  }>> = {
    'JavaScript Fundamentals': [
      {
        id: 1,
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript syntax and how to get started with programming',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '12:45',
        order: 1
      },
      {
        id: 2,
        title: 'Variables and Data Types',
        description: 'Understand different data types and how to work with variables effectively',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '15:30',
        order: 2
      },
      {
        id: 3,
        title: 'Functions and Scope',
        description: 'Master function creation, scope, and closures in JavaScript',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:20',
        order: 3
      },
      {
        id: 4,
        title: 'Objects and Arrays',
        description: 'Deep dive into objects, arrays, and modern JavaScript features',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:15',
        order: 4
      },
      {
        id: 5,
        title: 'ES6+ Features',
        description: 'Explore ES6+ syntax including arrow functions, destructuring, and modules',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '16:40',
        order: 5
      },
      {
        id: 6,
        title: 'Debugging and Best Practices',
        description: 'Learn debugging techniques and JavaScript best practices',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '14:25',
        order: 6
      }
    ],
    'Python Programming Basics': [
      {
        id: 1,
        title: 'Python Setup and Basics',
        description: 'Set up your Python environment and write your first program',
        thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '13:20',
        order: 1
      },
      {
        id: 2,
        title: 'Control Flow and Loops',
        description: 'Master if statements, loops, and control flow in Python',
        thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '17:45',
        order: 2
      },
      {
        id: 3,
        title: 'Functions and Modules',
        description: 'Create reusable functions and organize code with modules',
        thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:30',
        order: 3
      },
      {
        id: 4,
        title: 'Data Structures in Python',
        description: 'Work with lists, dictionaries, and other Python data structures',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '21:10',
        order: 4
      },
      {
        id: 5,
        title: 'File Handling',
        description: 'Learn to read from and write to files in Python',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '15:55',
        order: 5
      },
      {
        id: 6,
        title: 'Error Handling',
        description: 'Handle errors gracefully with try-except blocks',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '12:35',
        order: 6
      }
    ],
    'Data Structures in JavaScript': [
      {
        id: 1,
        title: 'Arrays and Objects Deep Dive',
        description: 'Master arrays and objects for efficient data organization',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '20:15',
        order: 1
      },
      {
        id: 2,
        title: 'Stacks and Queues Implementation',
        description: 'Implement stack and queue data structures from scratch',
        thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:40',
        order: 2
      },
      {
        id: 3,
        title: 'Trees and Binary Search',
        description: 'Understand tree structures and binary search algorithms',
        thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '25:30',
        order: 3
      },
      {
        id: 4,
        title: 'Hash Tables and Maps',
        description: 'Learn hash tables and efficient data lookup techniques',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:20',
        order: 4
      },
      {
        id: 5,
        title: 'Graph Algorithms',
        description: 'Implement graph algorithms for complex data relationships',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '28:45',
        order: 5
      },
      {
        id: 6,
        title: 'Performance Analysis',
        description: 'Analyze time and space complexity of different approaches',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '16:50',
        order: 6
      }
    ],
    'Advanced Python Concepts': [
      {
        id: 1,
        title: 'Object-Oriented Programming',
        description: 'Master classes, inheritance, and object-oriented design principles',
        thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '24:15',
        order: 1
      },
      {
        id: 2,
        title: 'Decorators and Generators',
        description: 'Learn decorators, generators, and advanced function concepts',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:30',
        order: 2
      },
      {
        id: 3,
        title: 'Context Managers',
        description: 'Understand context managers and the with statement',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '17:45',
        order: 3
      },
      {
        id: 4,
        title: 'Async Programming',
        description: 'Explore asynchronous programming with async/await',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '26:20',
        order: 4
      },
      {
        id: 5,
        title: 'Testing with pytest',
        description: 'Write comprehensive tests using pytest framework',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '21:40',
        order: 5
      },
      {
        id: 6,
        title: 'Performance Optimization',
        description: 'Optimize Python code for better performance',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '23:10',
        order: 6
      }
    ],
    'Algorithm Design & Analysis': [
      {
        id: 1,
        title: 'Big O Notation Explained',
        description: 'Understand time and space complexity analysis fundamentals',
        thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:30',
        order: 1
      },
      {
        id: 2,
        title: 'Sorting Algorithms Comparison',
        description: 'Compare different sorting algorithms and their trade-offs',
        thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:45',
        order: 2
      },
      {
        id: 3,
        title: 'Search Algorithms',
        description: 'Master binary search and other efficient search techniques',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '20:15',
        order: 3
      },
      {
        id: 4,
        title: 'Dynamic Programming',
        description: 'Solve complex problems using dynamic programming',
        thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '28:20',
        order: 4
      },
      {
        id: 5,
        title: 'Graph Algorithms',
        description: 'Implement graph traversal and shortest path algorithms',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '25:40',
        order: 5
      },
      {
        id: 6,
        title: 'Algorithm Optimization',
        description: 'Learn techniques for optimizing algorithm performance',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:55',
        order: 6
      }
    ],
    'System Design Fundamentals': [
      {
        id: 1,
        title: 'Scalability Principles',
        description: 'Learn the principles of designing scalable systems',
        thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '21:30',
        order: 1
      },
      {
        id: 2,
        title: 'Database Design Patterns',
        description: 'Design efficient database schemas and query patterns',
        thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '24:15',
        order: 2
      },
      {
        id: 3,
        title: 'Caching Strategies',
        description: 'Implement caching strategies for improved performance',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '19:45',
        order: 3
      },
      {
        id: 4,
        title: 'Load Balancing',
        description: 'Understand load balancing and traffic distribution',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '22:20',
        order: 4
      },
      {
        id: 5,
        title: 'Microservices Architecture',
        description: 'Design microservices and distributed system architectures',
        thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '26:40',
        order: 5
      },
      {
        id: 6,
        title: 'System Monitoring',
        description: 'Monitor and maintain large-scale systems effectively',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '18:35',
        order: 6
      }
    ]
  };

  // Enhanced cache with user-specific storage and preferences tracking
  private static recommendationCache: Map<string, {
    data: RecommendationResponse;
    timestamp: number;
    userPreferencesHash: string;
    userId: number;
  }> = new Map();

  private static readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour for stability

  static async getAllCourses(): Promise<Course[]> {
    const response = await axios.get('http://localhost:5000/api/courses');
    return this.addThumbnailsToCourses(response.data.courses);
  }

  static async getRecommendedCourses(forceRefresh = false): Promise<RecommendationResponse> {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const userPreferencesHash = this.getUserPreferencesHash();
    const cacheKey = `${currentUserId}_${userPreferencesHash}`;
    const now = Date.now();
    
    // Check user-specific cache with preferences hash
    const cachedData = this.recommendationCache.get(cacheKey);
    if (!forceRefresh && cachedData && (now - cachedData.timestamp) < this.CACHE_DURATION) {
      console.log('Using cached recommendations for user:', currentUserId, 'with preferences hash:', userPreferencesHash);
      return cachedData.data;
    }

    try {
      console.log('Fetching fresh recommendations for user:', currentUserId, 'with preferences hash:', userPreferencesHash);
      const response = await axios.get('http://localhost:5000/api/courses/recommended');
      const result = {
        ...response.data,
        courses: this.addThumbnailsToCourses(response.data.courses)
      };

      // Update user-specific cache with preferences hash
      this.recommendationCache.set(cacheKey, {
        data: result,
        timestamp: now,
        userPreferencesHash,
        userId: currentUserId
      });

      // Clean old cache entries for this user
      this.cleanOldCacheEntries(currentUserId);

      return result;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      throw error;
    }
  }

  static async getCourseById(id: string): Promise<Course> {
    const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
    const course = response.data.course;
    return {
      ...course,
      thumbnail: this.courseThumbnails[course.title] || 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
      videos: this.courseVideos[course.title] || []
    };
  }

  private static getCurrentUserId(): number | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  }

  private static getUserPreferencesHash(): string {
    try {
      // Get user data from localStorage or context
      const userStr = localStorage.getItem('user') || '{}';
      const user = JSON.parse(userStr);
      
      // Create a stable hash of user preferences
      const preferences = {
        level: user.level || '',
        careerStage: user.careerStage || '',
        skills: (user.skills || []).sort(), // Sort for consistency
        learningGoals: (user.learningGoals || []).sort(), // Sort for consistency
        timeAvailability: user.timeAvailability || '',
        hasPreferences: user.hasPreferences || false
      };
      
      return btoa(JSON.stringify(preferences));
    } catch {
      return 'default';
    }
  }

  private static cleanOldCacheEntries(userId: number): void {
    const userPrefix = `${userId}_`;
    const keysToDelete: string[] = [];
    
    this.recommendationCache.forEach((value, key) => {
      if (key.startsWith(userPrefix) && value.userId === userId) {
        // Keep only the most recent entry for this user
        if (key !== `${userId}_${this.getUserPreferencesHash()}`) {
          keysToDelete.push(key);
        }
      }
    });
    
    keysToDelete.forEach(key => this.recommendationCache.delete(key));
  }

  static clearRecommendationCache(userId?: number): void {
    if (userId) {
      const userPrefix = `${userId}_`;
      const keysToDelete: string[] = [];
      
      this.recommendationCache.forEach((value, key) => {
        if (key.startsWith(userPrefix)) {
          keysToDelete.push(key);
        }
      });
      
      keysToDelete.forEach(key => this.recommendationCache.delete(key));
    } else {
      this.recommendationCache.clear();
    }
  }

  static getCacheInfo(): { size: number; users: number[]; keys: string[] } {
    const users = new Set<number>();
    const keys: string[] = [];
    
    this.recommendationCache.forEach((value, key) => {
      users.add(value.userId);
      keys.push(key);
    });
    
    return {
      size: this.recommendationCache.size,
      users: Array.from(users),
      keys
    };
  }

  private static addThumbnailsToCourses(courses: Course[]): Course[] {
    return courses.map(course => ({
      ...course,
      thumbnail: this.courseThumbnails[course.title] || 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400'
    }));
  }

  static getLevelColor(level: string): string {
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

  static getProgressColor(percentage: number): string {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-gray-300 dark:bg-gray-600';
  }
}
import { sequelize, Course, Question } from './models/index.js';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    const courses = await Course.bulkCreate([
      {
        title: 'JavaScript Fundamentals',
        description: 'Master the core concepts of JavaScript programming with hands-on exercises',
        level: 'beginner',
        category: 'Web Development',
        tags: ['JavaScript', 'Programming', 'Web'],
        estimatedHours: 6
      },
      {
        title: 'Python Programming Basics',
        description: 'Learn Python programming from scratch with practical examples',
        level: 'beginner',
        category: 'Programming',
        tags: ['Python', 'Programming', 'Basics'],
        estimatedHours: 8
      },
      {
        title: 'Data Structures in JavaScript',
        description: 'Implement and understand fundamental data structures',
        level: 'intermediate',
        category: 'Computer Science',
        tags: ['JavaScript', 'Data Structures', 'Algorithms'],
        estimatedHours: 12
      },
      {
        title: 'Advanced Python Concepts',
        description: 'Dive deep into advanced Python programming techniques',
        level: 'intermediate',
        category: 'Programming',
        tags: ['Python', 'Advanced', 'OOP'],
        estimatedHours: 15
      },
      {
        title: 'Algorithm Design & Analysis',
        description: 'Master algorithmic thinking and complexity analysis',
        level: 'advanced',
        category: 'Computer Science',
        tags: ['Algorithms', 'Complexity', 'Problem Solving'],
        estimatedHours: 20
      },
      {
        title: 'System Design Fundamentals',
        description: 'Learn to design scalable and robust software systems',
        level: 'advanced',
        category: 'Software Engineering',
        tags: ['System Design', 'Architecture', 'Scalability'],
        estimatedHours: 25
      }
    ]);

    await Question.bulkCreate([

      {
        title: 'Hello World Function',
        description: 'Create a function that returns the string "Hello, World!"',
        starterCode: 'function helloWorld() {\n  // Your code here\n  \n}\n\n// Test the function\nconsole.log(helloWorld());',
        languageId: 63,
        expectedOutput: 'Hello, World!',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, World!' }]
      },
      {
        title: 'Sum Two Numbers',
        description: 'Write a function that takes two numbers and returns their sum',
        starterCode: 'function addNumbers(a, b) {\n  // Your code here\n  \n}\n\n// Test the function\nconsole.log(addNumbers(5, 3));',
        languageId: 63,
        expectedOutput: '8',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '5, 3', expected: '8' }]
      },
      {
        title: 'Array Maximum',
        description: 'Find the maximum number in an array',
        starterCode: 'function findMax(numbers) {\n  // Your code here\n  \n}\n\n// Test the function\nconsole.log(findMax([1, 5, 3, 9, 2]));',
        languageId: 63,
        expectedOutput: '9',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 5, 3, 9, 2]', expected: '9' }]
      },
      {
        title: 'String Reversal',
        description: 'Write a function that reverses a string',
        starterCode: 'function reverseString(str) {\n  // Your code here\n  \n}\n\n// Test the function\nconsole.log(reverseString("hello"));',
        languageId: 63,
        expectedOutput: 'olleh',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello"', expected: 'olleh' }]
      },

      {
        title: 'Python Hello World',
        description: 'Print "Hello, Python!" to the console',
        starterCode: '# Write your code here\n\n',
        languageId: 71,
        expectedOutput: 'Hello, Python!',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, Python!' }]
      },
      {
        title: 'List Sum',
        description: 'Calculate and print the sum of numbers in a list',
        starterCode: 'numbers = [1, 2, 3, 4, 5]\n# Calculate and print the sum\n\n',
        languageId: 71,
        expectedOutput: '15',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '15' }]
      },
      {
        title: 'Even Numbers Filter',
        description: 'Filter and print even numbers from a list',
        starterCode: 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n# Filter and print even numbers\n\n',
        languageId: 71,
        expectedOutput: '[2, 4, 6, 8, 10]',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', expected: '[2, 4, 6, 8, 10]' }]
      },

      {
        title: 'Stack Implementation',
        description: 'Implement a basic stack with push, pop, and peek operations',
        starterCode: 'class Stack {\n  constructor() {\n    this.items = [];\n  }\n  \n  push(item) {\n    // Your code here\n  }\n  \n  pop() {\n    // Your code here\n  }\n  \n  peek() {\n    // Your code here\n  }\n  \n  size() {\n    return this.items.length;\n  }\n}\n\n// Test the stack\nconst stack = new Stack();\nstack.push(1);\nstack.push(2);\nstack.push(3);\nconsole.log(stack.peek());\nconsole.log(stack.pop());\nconsole.log(stack.size());',
        languageId: 63,
        expectedOutput: '3\n3\n2',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'push(1,2,3), peek(), pop(), size()', expected: '3\n3\n2' }]
      },
      {
        title: 'Binary Search',
        description: 'Implement binary search algorithm',
        starterCode: 'function binarySearch(arr, target) {\n  // Your code here\n  // Return the index of target, or -1 if not found\n  \n}\n\n// Test the function\nconst sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];\nconsole.log(binarySearch(sortedArray, 7));\nconsole.log(binarySearch(sortedArray, 4));',
        languageId: 63,
        expectedOutput: '3\n-1',
        courseId: courses[2].id,
        difficulty: 'hard',
        testCases: [{ input: '[1,3,5,7,9,11,13,15], target=7', expected: '3' }]
      },

      {
        title: 'Class Inheritance',
        description: 'Create a Vehicle class and a Car subclass with method overriding',
        starterCode: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n    \n    def start(self):\n        return f"{self.brand} vehicle starting"\n\nclass Car(Vehicle):\n    def __init__(self, brand, model):\n        # Your code here\n        pass\n    \n    def start(self):\n        # Your code here\n        pass\n\n# Test the classes\ncar = Car("Toyota", "Camry")\nprint(car.start())',
        languageId: 71,
        expectedOutput: 'Toyota Camry car starting',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: 'Car("Toyota", "Camry")', expected: 'Toyota Camry car starting' }]
      },
      {
        title: 'Decorator Pattern',
        description: 'Create a decorator that measures function execution time',
        starterCode: 'import time\n\ndef timing_decorator(func):\n    # Your code here\n    pass\n\n@timing_decorator\ndef slow_function():\n    time.sleep(0.1)\n    return "Function completed"\n\n# Test the decorator\nresult = slow_function()\nprint("Done")',
        languageId: 71,
        expectedOutput: 'Done',
        courseId: courses[3].id,
        difficulty: 'hard',
        testCases: [{ input: 'decorated function call', expected: 'Done' }]
      },

      {
        title: 'Merge Sort Implementation',
        description: 'Implement the merge sort algorithm',
        starterCode: 'function mergeSort(arr) {\n  // Your code here\n  // Implement merge sort algorithm\n  \n}\n\nfunction merge(left, right) {\n  // Helper function to merge two sorted arrays\n  \n}\n\n// Test the function\nconst unsorted = [64, 34, 25, 12, 22, 11, 90];\nconst sorted = mergeSort(unsorted);\nconsole.log(sorted.join(","));',
        languageId: 63,
        expectedOutput: '11,12,22,25,34,64,90',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[64,34,25,12,22,11,90]', expected: '11,12,22,25,34,64,90' }]
      },
      {
        title: 'Dynamic Programming - Fibonacci',
        description: 'Implement Fibonacci using dynamic programming with memoization',
        starterCode: 'function fibonacciDP(n, memo = {}) {\n  // Your code here\n  // Use memoization for efficiency\n  \n}\n\n// Test the function\nconsole.log(fibonacciDP(10));\nconsole.log(fibonacciDP(20));',
        languageId: 63,
        expectedOutput: '55\n6765',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: 'n=10', expected: '55' }]
      },

      {
        title: 'Rate Limiter Design',
        description: 'Implement a simple rate limiter using token bucket algorithm',
        starterCode: 'class RateLimiter {\n  constructor(capacity, refillRate) {\n    this.capacity = capacity;\n    this.tokens = capacity;\n    this.refillRate = refillRate;\n    this.lastRefill = Date.now();\n  }\n  \n  allowRequest() {\n    // Your code here\n    // Return true if request is allowed, false otherwise\n    \n  }\n  \n  refillTokens() {\n    // Your code here\n    \n  }\n}\n\n// Test the rate limiter\nconst limiter = new RateLimiter(5, 1); // 5 tokens, 1 token per second\nconsole.log(limiter.allowRequest()); // Should be true\nconsole.log(limiter.allowRequest()); // Should be true',
        languageId: 63,
        expectedOutput: 'true\ntrue',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'capacity=5, rate=1', expected: 'true' }]
      },
      {
        title: 'Cache Implementation',
        description: 'Implement an LRU (Least Recently Used) cache',
        starterCode: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  \n  get(key) {\n    // Your code here\n    \n  }\n  \n  put(key, value) {\n    // Your code here\n    \n  }\n}\n\n// Test the cache\nconst cache = new LRUCache(2);\ncache.put(1, "one");\ncache.put(2, "two");\nconsole.log(cache.get(1));\ncache.put(3, "three");\nconsole.log(cache.get(2) || "null");',
        languageId: 63,
        expectedOutput: 'one\nnull',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'capacity=2, operations', expected: 'one\nnull' }]
      }
    ]);

    console.log('Database seeded successfully with comprehensive courses!');
    console.log(`Created ${courses.length} courses with multiple difficulty levels`);
    console.log('All questions have verifiable outputs for testing');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
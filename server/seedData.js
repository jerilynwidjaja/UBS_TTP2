import { sequelize, Course, Question } from './models/index.js';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    // Create comprehensive courses with verifiable outputs
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

    // Create comprehensive questions with starter code only (no solutions)
    await Question.bulkCreate([
      // JavaScript Fundamentals (Beginner) - 8 questions
      {
        title: 'Hello World Function',
        description: 'Create a function that returns the string "Hello, World!"',
        starterCode: 'function helloWorld() {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: 'Hello, World!',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, World!' }]
      },
      {
        title: 'Sum Two Numbers',
        description: 'Write a function that takes two numbers and returns their sum',
        starterCode: 'function addNumbers(a, b) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '8',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [{ input: '5, 3', expected: '8' }]
      },
      {
        title: 'Array Maximum',
        description: 'Find the maximum number in an array',
        starterCode: 'function findMax(numbers) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '9',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 5, 3, 9, 2]', expected: '9' }]
      },
      {
        title: 'String Reversal',
        description: 'Write a function that reverses a string',
        starterCode: 'function reverseString(str) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: 'olleh',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello"', expected: 'olleh' }]
      },
      {
        title: 'Count Vowels',
        description: 'Count the number of vowels in a string',
        starterCode: 'function countVowels(str) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '3',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello world"', expected: '3' }]
      },
      {
        title: 'Factorial Calculator',
        description: 'Calculate the factorial of a number',
        starterCode: 'function factorial(n) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '120',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '5', expected: '120' }]
      },
      {
        title: 'Palindrome Check',
        description: 'Check if a string is a palindrome',
        starterCode: 'function isPalindrome(str) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: 'true',
        courseId: courses[0].id,
        difficulty: 'hard',
        testCases: [{ input: '"racecar"', expected: 'true' }]
      },
      {
        title: 'FizzBuzz',
        description: 'Print numbers 1-15, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz"',
        starterCode: 'function fizzBuzz() {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
        courseId: courses[0].id,
        difficulty: 'hard',
        testCases: [{ input: '', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }]
      },

      // Python Programming Basics (Beginner) - 8 questions
      {
        title: 'Python Hello World',
        description: 'Print "Hello, Python!" to the console',
        starterCode: '# Write your code here\n',
        languageId: 71,
        expectedOutput: 'Hello, Python!',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, Python!' }]
      },
      {
        title: 'List Sum',
        description: 'Calculate and print the sum of numbers in a list',
        starterCode: 'numbers = [1, 2, 3, 4, 5]\n# Calculate and print the sum\n',
        languageId: 71,
        expectedOutput: '15',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '15' }]
      },
      {
        title: 'Even Numbers Filter',
        description: 'Filter and print even numbers from a list',
        starterCode: 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n# Filter and print even numbers\n',
        languageId: 71,
        expectedOutput: '[2, 4, 6, 8, 10]',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', expected: '[2, 4, 6, 8, 10]' }]
      },
      {
        title: 'String Length Counter',
        description: 'Count the length of a string',
        starterCode: 'text = "Python Programming"\n# Print the length\n',
        languageId: 71,
        expectedOutput: '18',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '"Python Programming"', expected: '18' }]
      },
      {
        title: 'List Maximum',
        description: 'Find and print the maximum value in a list',
        starterCode: 'numbers = [3, 7, 2, 9, 1, 5]\n# Find and print maximum\n',
        languageId: 71,
        expectedOutput: '9',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '[3, 7, 2, 9, 1, 5]', expected: '9' }]
      },
      {
        title: 'Dictionary Access',
        description: 'Access and print a value from a dictionary',
        starterCode: 'student = {"name": "Alice", "age": 20, "grade": "A"}\n# Print the student\'s name\n',
        languageId: 71,
        expectedOutput: 'Alice',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: 'student["name"]', expected: 'Alice' }]
      },
      {
        title: 'Loop and Print',
        description: 'Use a loop to print numbers 1 to 5',
        starterCode: '# Use a loop to print numbers 1 to 5\n',
        languageId: 71,
        expectedOutput: '1\n2\n3\n4\n5',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: 'range(1, 6)', expected: '1\n2\n3\n4\n5' }]
      },
      {
        title: 'String Formatting',
        description: 'Format and print a string with variables',
        starterCode: 'name = "Bob"\nage = 25\n# Format and print: "Hello, Bob! You are 25 years old."\n',
        languageId: 71,
        expectedOutput: 'Hello, Bob! You are 25 years old.',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: 'name="Bob", age=25', expected: 'Hello, Bob! You are 25 years old.' }]
      },

      // Data Structures in JavaScript (Intermediate) - 6 questions
      {
        title: 'Stack Implementation',
        description: 'Implement a basic stack with push, pop, and peek operations',
        starterCode: 'class Stack {\n  constructor() {\n    this.items = [];\n  }\n  \n  push(item) {\n    // Your code here\n  }\n  \n  pop() {\n    // Your code here\n  }\n  \n  peek() {\n    // Your code here\n  }\n  \n  size() {\n    // Your code here\n  }\n}',
        languageId: 63,
        expectedOutput: '3\n3\n2',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'push(1,2,3), peek(), pop(), size()', expected: '3\n3\n2' }]
      },
      {
        title: 'Binary Search',
        description: 'Implement binary search algorithm',
        starterCode: 'function binarySearch(arr, target) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '3\n-1',
        courseId: courses[2].id,
        difficulty: 'hard',
        testCases: [{ input: '[1,3,5,7,9,11,13,15], target=7', expected: '3' }]
      },
      {
        title: 'Queue Implementation',
        description: 'Implement a basic queue with enqueue and dequeue operations',
        starterCode: 'class Queue {\n  constructor() {\n    // Your code here\n  }\n  \n  enqueue(item) {\n    // Your code here\n  }\n  \n  dequeue() {\n    // Your code here\n  }\n  \n  front() {\n    // Your code here\n  }\n  \n  size() {\n    // Your code here\n  }\n}',
        languageId: 63,
        expectedOutput: 'A\nA\n2',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'enqueue(A,B,C), front(), dequeue(), size()', expected: 'A\nA\n2' }]
      },
      {
        title: 'Linked List Node',
        description: 'Create a simple linked list node and traverse it',
        starterCode: 'class ListNode {\n  constructor(val) {\n    // Your code here\n  }\n}\n\n// Create a function to traverse and print the linked list\nfunction traverseList(head) {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: '1\n2\n3',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: '1->2->3', expected: '1\n2\n3' }]
      },
      {
        title: 'Hash Map Character Count',
        description: 'Use a Map to count character frequencies',
        starterCode: 'function countChars(str) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '2\n1',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello"', expected: '2\n1' }]
      },
      {
        title: 'Tree Traversal',
        description: 'Implement simple binary tree inorder traversal',
        starterCode: 'class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nfunction inorderTraversal(root) {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: '1\n2\n3',
        courseId: courses[2].id,
        difficulty: 'hard',
        testCases: [{ input: 'tree(2,1,3)', expected: '1\n2\n3' }]
      },

      // Advanced Python Concepts (Intermediate) - 6 questions
      {
        title: 'Class Inheritance',
        description: 'Create a Vehicle class and a Car subclass with method overriding',
        starterCode: 'class Vehicle:\n    def __init__(self, brand):\n        # Your code here\n    \n    def start(self):\n        # Your code here\n\nclass Car(Vehicle):\n    def __init__(self, brand, model):\n        # Your code here\n    \n    def start(self):\n        # Your code here',
        languageId: 71,
        expectedOutput: 'Toyota Camry car starting',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: 'Car("Toyota", "Camry")', expected: 'Toyota Camry car starting' }]
      },
      {
        title: 'List Comprehension',
        description: 'Use list comprehension to create a list of squares',
        starterCode: '# Create list of squares for numbers 1-5 using list comprehension\n',
        languageId: 71,
        expectedOutput: '[1, 4, 9, 16, 25]',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: 'range(1, 6)', expected: '[1, 4, 9, 16, 25]' }]
      },
      {
        title: 'Lambda Functions',
        description: 'Use lambda function with map to double numbers',
        starterCode: 'numbers = [1, 2, 3, 4, 5]\n# Use lambda with map to double each number\n',
        languageId: 71,
        expectedOutput: '[2, 4, 6, 8, 10]',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '[2, 4, 6, 8, 10]' }]
      },
      {
        title: 'Exception Handling',
        description: 'Handle division by zero with try-except',
        starterCode: 'def safe_divide(a, b):\n    # Your code here\n    \n',
        languageId: 71,
        expectedOutput: 'Result: 5.0\nError: Division by zero',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: '10/2, 10/0', expected: 'Result: 5.0\nError: Division by zero' }]
      },
      {
        title: 'Generator Function',
        description: 'Create a generator that yields fibonacci numbers',
        starterCode: 'def fibonacci_generator(n):\n    # Your code here\n    ',
        languageId: 71,
        expectedOutput: '0\n1\n1\n2\n3',
        courseId: courses[3].id,
        difficulty: 'hard',
        testCases: [{ input: 'n=5', expected: '0\n1\n1\n2\n3' }]
      },
      {
        title: 'Decorator Pattern',
        description: 'Create a simple decorator that prints function calls',
        starterCode: 'def call_logger(func):\n    # Your code here\n    \n@call_logger\ndef greet(name):\n    return f"Hello, {name}!"',
        languageId: 71,
        expectedOutput: 'Calling greet\nFinished greet\nHello, Alice!',
        courseId: courses[3].id,
        difficulty: 'hard',
        testCases: [{ input: 'greet("Alice")', expected: 'Calling greet\nFinished greet\nHello, Alice!' }]
      },

      // Algorithm Design & Analysis (Advanced) - 5 questions
      {
        title: 'Merge Sort Implementation',
        description: 'Implement the merge sort algorithm',
        starterCode: 'function mergeSort(arr) {\n  // Your code here\n  \n}\n\nfunction merge(left, right) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '11,12,22,25,34,64,90',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[64,34,25,12,22,11,90]', expected: '11,12,22,25,34,64,90' }]
      },
      {
        title: 'Dynamic Programming - Fibonacci',
        description: 'Implement Fibonacci using dynamic programming with memoization',
        starterCode: 'function fibonacciDP(n, memo = {}) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '55\n6765',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: 'n=10', expected: '55' }]
      },
      {
        title: 'Quick Sort',
        description: 'Implement the quicksort algorithm',
        starterCode: 'function quickSort(arr) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '1,1,2,3,6,8,10',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[3,6,8,10,1,2,1]', expected: '1,1,2,3,6,8,10' }]
      },
      {
        title: 'Graph BFS',
        description: 'Implement breadth-first search for a graph',
        starterCode: 'function bfs(graph, start) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: 'A,B,C,D',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: 'graph, start="A"', expected: 'A,B,C,D' }]
      },
      {
        title: 'Longest Common Subsequence',
        description: 'Find the length of longest common subsequence using DP',
        starterCode: 'function lcs(str1, str2) {\n  // Your code here\n  \n}',
        languageId: 63,
        expectedOutput: '3\n4',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '"ABCDGH", "AEDFHR"', expected: '3' }]
      },

      // System Design Fundamentals (Advanced) - 5 questions
      {
        title: 'Rate Limiter Design',
        description: 'Implement a simple rate limiter using token bucket algorithm',
        starterCode: 'class RateLimiter {\n  constructor(capacity, refillRate) {\n    // Your code here\n  }\n  \n  allowRequest() {\n    // Your code here\n  }\n  \n  refillTokens() {\n    // Your code here\n  }\n}',
        languageId: 63,
        expectedOutput: 'true\ntrue',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'capacity=5, rate=1', expected: 'true' }]
      },
      {
        title: 'Cache Implementation',
        description: 'Implement an LRU (Least Recently Used) cache',
        starterCode: 'class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  \n  get(key) {\n    // Your code here\n  }\n  \n  put(key, value) {\n    // Your code here\n  }\n}',
        languageId: 63,
        expectedOutput: 'one\nnull',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'capacity=2, operations', expected: 'one\nnull' }]
      },
      {
        title: 'Load Balancer Simulation',
        description: 'Implement a simple round-robin load balancer',
        starterCode: 'class LoadBalancer {\n  constructor(servers) {\n    // Your code here\n  }\n  \n  getNextServer() {\n    // Your code here\n  }\n  \n  addServer(server) {\n    // Your code here\n  }\n}',
        languageId: 63,
        expectedOutput: 'Server1\nServer2\nServer3\nServer1',
        courseId: courses[5].id,
        difficulty: 'medium',
        testCases: [{ input: '["Server1", "Server2", "Server3"]', expected: 'Server1\nServer2\nServer3\nServer1' }]
      },
      {
        title: 'Consistent Hashing',
        description: 'Implement basic consistent hashing for distributed systems',
        starterCode: 'class ConsistentHash {\n  constructor() {\n    // Your code here\n  }\n  \n  addNode(node) {\n    // Your code here\n  }\n  \n  getNode(key) {\n    // Your code here\n  }\n  \n  hash(str) {\n    // Your code here\n  }\n}',
        languageId: 63,
        expectedOutput: 'Node2\nNode1',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'key1, key2', expected: 'Node2\nNode1' }]
      },
      {
        title: 'Circuit Breaker Pattern',
        description: 'Implement a circuit breaker for fault tolerance',
        starterCode: 'class CircuitBreaker {\n  constructor(threshold = 3, timeout = 5000) {\n    // Your code here\n  }\n  \n  call(operation) {\n    // Your code here\n  }\n  \n  onSuccess() {\n    // Your code here\n  }\n  \n  onFailure() {\n    // Your code here\n  }\n}',
        languageId: 63,
        expectedOutput: 'Success\nOperation failed\nOperation failed\nCircuit breaker is OPEN',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'threshold=2', expected: 'Success\nOperation failed\nOperation failed\nCircuit breaker is OPEN' }]
      }
    ]);

    console.log('Database seeded successfully with comprehensive courses!');
    console.log(`Created ${courses.length} courses with multiple difficulty levels`);
    console.log('All questions have starter code only - no solutions included');
    
    // Print course summary
    for (const course of courses) {
      const questionCount = await Question.count({ where: { courseId: course.id } });
      console.log(`- ${course.title}: ${questionCount} questions`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
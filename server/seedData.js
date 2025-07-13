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

    // Create comprehensive questions with verifiable outputs
    await Question.bulkCreate([
      // JavaScript Fundamentals (Beginner) - 8 questions
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
        title: 'Count Vowels',
        description: 'Count the number of vowels in a string',
        starterCode: 'function countVowels(str) {\n  // Your code here\n  \n}\n\n// Test the function\nconsole.log(countVowels("hello world"));',
        languageId: 63,
        expectedOutput: '3',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello world"', expected: '3' }]
      },
      {
        title: 'Factorial Calculator',
        description: 'Calculate the factorial of a number',
        starterCode: 'function factorial(n) {\n  // Your code here\n  \n}\n\n// Test the function\nconsole.log(factorial(5));',
        languageId: 63,
        expectedOutput: '120',
        courseId: courses[0].id,
        difficulty: 'medium',
        testCases: [{ input: '5', expected: '120' }]
      },
      {
        title: 'Palindrome Check',
        description: 'Check if a string is a palindrome',
        starterCode: 'function isPalindrome(str) {\n  // Your code here\n  \n}\n\n// Test the function\nconsole.log(isPalindrome("racecar"));',
        languageId: 63,
        expectedOutput: 'true',
        courseId: courses[0].id,
        difficulty: 'hard',
        testCases: [{ input: '"racecar"', expected: 'true' }]
      },
      {
        title: 'FizzBuzz',
        description: 'Print numbers 1-15, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz"',
        starterCode: 'function fizzBuzz() {\n  // Your code here\n  \n}\n\n// Test the function\nfizzBuzz();',
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
        starterCode: '# Write your code here\nprint("Hello, Python!")',
        languageId: 71,
        expectedOutput: 'Hello, Python!',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '', expected: 'Hello, Python!' }]
      },
      {
        title: 'List Sum',
        description: 'Calculate and print the sum of numbers in a list',
        starterCode: 'numbers = [1, 2, 3, 4, 5]\n# Calculate and print the sum\nprint(sum(numbers))',
        languageId: 71,
        expectedOutput: '15',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '15' }]
      },
      {
        title: 'Even Numbers Filter',
        description: 'Filter and print even numbers from a list',
        starterCode: 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n# Filter and print even numbers\neven_numbers = [n for n in numbers if n % 2 == 0]\nprint(even_numbers)',
        languageId: 71,
        expectedOutput: '[2, 4, 6, 8, 10]',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', expected: '[2, 4, 6, 8, 10]' }]
      },
      {
        title: 'String Length Counter',
        description: 'Count the length of a string',
        starterCode: 'text = "Python Programming"\n# Print the length\nprint(len(text))',
        languageId: 71,
        expectedOutput: '18',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '"Python Programming"', expected: '18' }]
      },
      {
        title: 'List Maximum',
        description: 'Find and print the maximum value in a list',
        starterCode: 'numbers = [3, 7, 2, 9, 1, 5]\n# Find and print maximum\nprint(max(numbers))',
        languageId: 71,
        expectedOutput: '9',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [{ input: '[3, 7, 2, 9, 1, 5]', expected: '9' }]
      },
      {
        title: 'Dictionary Access',
        description: 'Access and print a value from a dictionary',
        starterCode: 'student = {"name": "Alice", "age": 20, "grade": "A"}\n# Print the student\'s name\nprint(student["name"])',
        languageId: 71,
        expectedOutput: 'Alice',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: 'student["name"]', expected: 'Alice' }]
      },
      {
        title: 'Loop and Print',
        description: 'Use a loop to print numbers 1 to 5',
        starterCode: '# Use a loop to print numbers 1 to 5\nfor i in range(1, 6):\n    print(i)',
        languageId: 71,
        expectedOutput: '1\n2\n3\n4\n5',
        courseId: courses[1].id,
        difficulty: 'medium',
        testCases: [{ input: 'range(1, 6)', expected: '1\n2\n3\n4\n5' }]
      },
      {
        title: 'String Formatting',
        description: 'Format and print a string with variables',
        starterCode: 'name = "Bob"\nage = 25\n# Format and print: "Hello, Bob! You are 25 years old."\nprint(f"Hello, {name}! You are {age} years old.")',
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
        starterCode: 'class Stack {\n  constructor() {\n    this.items = [];\n  }\n  \n  push(item) {\n    this.items.push(item);\n  }\n  \n  pop() {\n    return this.items.pop();\n  }\n  \n  peek() {\n    return this.items[this.items.length - 1];\n  }\n  \n  size() {\n    return this.items.length;\n  }\n}\n\n// Test the stack\nconst stack = new Stack();\nstack.push(1);\nstack.push(2);\nstack.push(3);\nconsole.log(stack.peek());\nconsole.log(stack.pop());\nconsole.log(stack.size());',
        languageId: 63,
        expectedOutput: '3\n3\n2',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'push(1,2,3), peek(), pop(), size()', expected: '3\n3\n2' }]
      },
      {
        title: 'Binary Search',
        description: 'Implement binary search algorithm',
        starterCode: 'function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\n// Test the function\nconst sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];\nconsole.log(binarySearch(sortedArray, 7));\nconsole.log(binarySearch(sortedArray, 4));',
        languageId: 63,
        expectedOutput: '3\n-1',
        courseId: courses[2].id,
        difficulty: 'hard',
        testCases: [{ input: '[1,3,5,7,9,11,13,15], target=7', expected: '3' }]
      },
      {
        title: 'Queue Implementation',
        description: 'Implement a basic queue with enqueue and dequeue operations',
        starterCode: 'class Queue {\n  constructor() {\n    this.items = [];\n  }\n  \n  enqueue(item) {\n    this.items.push(item);\n  }\n  \n  dequeue() {\n    return this.items.shift();\n  }\n  \n  front() {\n    return this.items[0];\n  }\n  \n  size() {\n    return this.items.length;\n  }\n}\n\n// Test the queue\nconst queue = new Queue();\nqueue.enqueue("A");\nqueue.enqueue("B");\nqueue.enqueue("C");\nconsole.log(queue.front());\nconsole.log(queue.dequeue());\nconsole.log(queue.size());',
        languageId: 63,
        expectedOutput: 'A\nA\n2',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: 'enqueue(A,B,C), front(), dequeue(), size()', expected: 'A\nA\n2' }]
      },
      {
        title: 'Linked List Node',
        description: 'Create a simple linked list node and traverse',
        starterCode: 'class ListNode {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n  }\n}\n\n// Create linked list: 1 -> 2 -> 3\nconst node1 = new ListNode(1);\nconst node2 = new ListNode(2);\nconst node3 = new ListNode(3);\nnode1.next = node2;\nnode2.next = node3;\n\n// Traverse and print\nlet current = node1;\nwhile (current) {\n  console.log(current.val);\n  current = current.next;\n}',
        languageId: 63,
        expectedOutput: '1\n2\n3',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: '1->2->3', expected: '1\n2\n3' }]
      },
      {
        title: 'Hash Map Basic',
        description: 'Use a Map to count character frequencies',
        starterCode: 'function countChars(str) {\n  const map = new Map();\n  for (let char of str) {\n    map.set(char, (map.get(char) || 0) + 1);\n  }\n  return map;\n}\n\n// Test the function\nconst result = countChars("hello");\nconsole.log(result.get("l"));\nconsole.log(result.get("o"));',
        languageId: 63,
        expectedOutput: '2\n1',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [{ input: '"hello"', expected: '2\n1' }]
      },
      {
        title: 'Tree Traversal',
        description: 'Implement simple binary tree traversal',
        starterCode: 'class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nfunction inorderTraversal(root) {\n  if (!root) return;\n  inorderTraversal(root.left);\n  console.log(root.val);\n  inorderTraversal(root.right);\n}\n\n// Create tree: 2\n//             / \\\n//            1   3\nconst root = new TreeNode(2);\nroot.left = new TreeNode(1);\nroot.right = new TreeNode(3);\n\ninorderTraversal(root);',
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
        starterCode: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n    \n    def start(self):\n        return f"{self.brand} vehicle starting"\n\nclass Car(Vehicle):\n    def __init__(self, brand, model):\n        super().__init__(brand)\n        self.model = model\n    \n    def start(self):\n        return f"{self.brand} {self.model} car starting"\n\n# Test the classes\ncar = Car("Toyota", "Camry")\nprint(car.start())',
        languageId: 71,
        expectedOutput: 'Toyota Camry car starting',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: 'Car("Toyota", "Camry")', expected: 'Toyota Camry car starting' }]
      },
      {
        title: 'List Comprehension',
        description: 'Use list comprehension to create a list of squares',
        starterCode: '# Create list of squares for numbers 1-5\nsquares = [x**2 for x in range(1, 6)]\nprint(squares)',
        languageId: 71,
        expectedOutput: '[1, 4, 9, 16, 25]',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: 'range(1, 6)', expected: '[1, 4, 9, 16, 25]' }]
      },
      {
        title: 'Lambda Functions',
        description: 'Use lambda function with map to double numbers',
        starterCode: 'numbers = [1, 2, 3, 4, 5]\n# Use lambda with map to double each number\ndoubled = list(map(lambda x: x * 2, numbers))\nprint(doubled)',
        languageId: 71,
        expectedOutput: '[2, 4, 6, 8, 10]',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expected: '[2, 4, 6, 8, 10]' }]
      },
      {
        title: 'Exception Handling',
        description: 'Handle division by zero with try-except',
        starterCode: 'def safe_divide(a, b):\n    try:\n        result = a / b\n        return f"Result: {result}"\n    except ZeroDivisionError:\n        return "Error: Division by zero"\n\n# Test the function\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))',
        languageId: 71,
        expectedOutput: 'Result: 5.0\nError: Division by zero',
        courseId: courses[3].id,
        difficulty: 'medium',
        testCases: [{ input: '10/2, 10/0', expected: 'Result: 5.0\nError: Division by zero' }]
      },
      {
        title: 'Generator Function',
        description: 'Create a generator that yields fibonacci numbers',
        starterCode: 'def fibonacci_generator(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\n# Test the generator\nfib_gen = fibonacci_generator(5)\nfor num in fib_gen:\n    print(num)',
        languageId: 71,
        expectedOutput: '0\n1\n1\n2\n3',
        courseId: courses[3].id,
        difficulty: 'hard',
        testCases: [{ input: 'n=5', expected: '0\n1\n1\n2\n3' }]
      },
      {
        title: 'Decorator Pattern',
        description: 'Create a simple decorator that prints function calls',
        starterCode: 'def call_logger(func):\n    def wrapper(*args, **kwargs):\n        print(f"Calling {func.__name__}")\n        result = func(*args, **kwargs)\n        print(f"Finished {func.__name__}")\n        return result\n    return wrapper\n\n@call_logger\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Test the decorator\nresult = greet("Alice")\nprint(result)',
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
        starterCode: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  \n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  let result = [];\n  let i = 0, j = 0;\n  \n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) {\n      result.push(left[i]);\n      i++;\n    } else {\n      result.push(right[j]);\n      j++;\n    }\n  }\n  \n  return result.concat(left.slice(i)).concat(right.slice(j));\n}\n\n// Test the function\nconst unsorted = [64, 34, 25, 12, 22, 11, 90];\nconst sorted = mergeSort(unsorted);\nconsole.log(sorted.join(","));',
        languageId: 63,
        expectedOutput: '11,12,22,25,34,64,90',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[64,34,25,12,22,11,90]', expected: '11,12,22,25,34,64,90' }]
      },
      {
        title: 'Dynamic Programming - Fibonacci',
        description: 'Implement Fibonacci using dynamic programming with memoization',
        starterCode: 'function fibonacciDP(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 2) return 1;\n  \n  memo[n] = fibonacciDP(n - 1, memo) + fibonacciDP(n - 2, memo);\n  return memo[n];\n}\n\n// Test the function\nconsole.log(fibonacciDP(10));\nconsole.log(fibonacciDP(20));',
        languageId: 63,
        expectedOutput: '55\n6765',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: 'n=10', expected: '55' }]
      },
      {
        title: 'Quick Sort',
        description: 'Implement the quicksort algorithm',
        starterCode: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const middle = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  \n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}\n\n// Test the function\nconst unsorted = [3, 6, 8, 10, 1, 2, 1];\nconst sorted = quickSort(unsorted);\nconsole.log(sorted.join(","));',
        languageId: 63,
        expectedOutput: '1,1,2,3,6,8,10',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: '[3,6,8,10,1,2,1]', expected: '1,1,2,3,6,8,10' }]
      },
      {
        title: 'Graph BFS',
        description: 'Implement breadth-first search for a graph',
        starterCode: 'function bfs(graph, start) {\n  const visited = new Set();\n  const queue = [start];\n  const result = [];\n  \n  while (queue.length > 0) {\n    const node = queue.shift();\n    if (!visited.has(node)) {\n      visited.add(node);\n      result.push(node);\n      \n      for (const neighbor of graph[node] || []) {\n        if (!visited.has(neighbor)) {\n          queue.push(neighbor);\n        }\n      }\n    }\n  }\n  \n  return result;\n}\n\n// Test with a simple graph\nconst graph = {\n  A: ["B", "C"],\n  B: ["A", "D"],\n  C: ["A", "D"],\n  D: ["B", "C"]\n};\n\nconst result = bfs(graph, "A");\nconsole.log(result.join(","));',
        languageId: 63,
        expectedOutput: 'A,B,C,D',
        courseId: courses[4].id,
        difficulty: 'hard',
        testCases: [{ input: 'graph, start="A"', expected: 'A,B,C,D' }]
      },
      {
        title: 'Longest Common Subsequence',
        description: 'Find the length of longest common subsequence using DP',
        starterCode: 'function lcs(str1, str2) {\n  const m = str1.length;\n  const n = str2.length;\n  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));\n  \n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (str1[i - 1] === str2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n  \n  return dp[m][n];\n}\n\n// Test the function\nconsole.log(lcs("ABCDGH", "AEDFHR"));\nconsole.log(lcs("AGGTAB", "GXTXAYB"));',
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
        starterCode: 'class RateLimiter {\n  constructor(capacity, refillRate) {\n    this.capacity = capacity;\n    this.tokens = capacity;\n    this.refillRate = refillRate;\n    this.lastRefill = Date.now();\n  }\n  \n  allowRequest() {\n    this.refillTokens();\n    \n    if (this.tokens > 0) {\n      this.tokens--;\n      return true;\n    }\n    return false;\n  }\n  \n  refillTokens() {\n    const now = Date.now();\n    const timePassed = (now - this.lastRefill) / 1000;\n    const tokensToAdd = Math.floor(timePassed * this.refillRate);\n    \n    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);\n    this.lastRefill = now;\n  }\n}\n\n// Test the rate limiter\nconst limiter = new RateLimiter(5, 1);\nconsole.log(limiter.allowRequest());\nconsole.log(limiter.allowRequest());',
        languageId: 63,
        expectedOutput: 'true\ntrue',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'capacity=5, rate=1', expected: 'true' }]
      },
      {
        title: 'Cache Implementation',
        description: 'Implement an LRU (Least Recently Used) cache',
        starterCode: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  \n  get(key) {\n    if (this.cache.has(key)) {\n      const value = this.cache.get(key);\n      this.cache.delete(key);\n      this.cache.set(key, value);\n      return value;\n    }\n    return null;\n  }\n  \n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      this.cache.delete(firstKey);\n    }\n    this.cache.set(key, value);\n  }\n}\n\n// Test the cache\nconst cache = new LRUCache(2);\ncache.put(1, "one");\ncache.put(2, "two");\nconsole.log(cache.get(1));\ncache.put(3, "three");\nconsole.log(cache.get(2) || "null");',
        languageId: 63,
        expectedOutput: 'one\nnull',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'capacity=2, operations', expected: 'one\nnull' }]
      },
      {
        title: 'Load Balancer Simulation',
        description: 'Implement a simple round-robin load balancer',
        starterCode: 'class LoadBalancer {\n  constructor(servers) {\n    this.servers = servers;\n    this.currentIndex = 0;\n  }\n  \n  getNextServer() {\n    const server = this.servers[this.currentIndex];\n    this.currentIndex = (this.currentIndex + 1) % this.servers.length;\n    return server;\n  }\n  \n  addServer(server) {\n    this.servers.push(server);\n  }\n}\n\n// Test the load balancer\nconst lb = new LoadBalancer(["Server1", "Server2", "Server3"]);\nconsole.log(lb.getNextServer());\nconsole.log(lb.getNextServer());\nconsole.log(lb.getNextServer());\nconsole.log(lb.getNextServer());',
        languageId: 63,
        expectedOutput: 'Server1\nServer2\nServer3\nServer1',
        courseId: courses[5].id,
        difficulty: 'medium',
        testCases: [{ input: '["Server1", "Server2", "Server3"]', expected: 'Server1\nServer2\nServer3\nServer1' }]
      },
      {
        title: 'Consistent Hashing',
        description: 'Implement basic consistent hashing for distributed systems',
        starterCode: 'class ConsistentHash {\n  constructor() {\n    this.ring = new Map();\n    this.sortedKeys = [];\n  }\n  \n  addNode(node) {\n    const hash = this.hash(node);\n    this.ring.set(hash, node);\n    this.sortedKeys.push(hash);\n    this.sortedKeys.sort((a, b) => a - b);\n  }\n  \n  getNode(key) {\n    if (this.sortedKeys.length === 0) return null;\n    \n    const hash = this.hash(key);\n    for (const nodeHash of this.sortedKeys) {\n      if (hash <= nodeHash) {\n        return this.ring.get(nodeHash);\n      }\n    }\n    return this.ring.get(this.sortedKeys[0]);\n  }\n  \n  hash(str) {\n    let hash = 0;\n    for (let i = 0; i < str.length; i++) {\n      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;\n    }\n    return Math.abs(hash) % 1000;\n  }\n}\n\n// Test consistent hashing\nconst ch = new ConsistentHash();\nch.addNode("Node1");\nch.addNode("Node2");\nch.addNode("Node3");\nconsole.log(ch.getNode("key1"));\nconsole.log(ch.getNode("key2"));',
        languageId: 63,
        expectedOutput: 'Node2\nNode1',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'key1, key2', expected: 'Node2\nNode1' }]
      },
      {
        title: 'Circuit Breaker Pattern',
        description: 'Implement a circuit breaker for fault tolerance',
        starterCode: 'class CircuitBreaker {\n  constructor(threshold = 3, timeout = 5000) {\n    this.threshold = threshold;\n    this.timeout = timeout;\n    this.failureCount = 0;\n    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN\n    this.nextAttempt = Date.now();\n  }\n  \n  call(operation) {\n    if (this.state === "OPEN") {\n      if (Date.now() < this.nextAttempt) {\n        return "Circuit breaker is OPEN";\n      }\n      this.state = "HALF_OPEN";\n    }\n    \n    try {\n      const result = operation();\n      this.onSuccess();\n      return result;\n    } catch (error) {\n      this.onFailure();\n      return "Operation failed";\n    }\n  }\n  \n  onSuccess() {\n    this.failureCount = 0;\n    this.state = "CLOSED";\n  }\n  \n  onFailure() {\n    this.failureCount++;\n    if (this.failureCount >= this.threshold) {\n      this.state = "OPEN";\n      this.nextAttempt = Date.now() + this.timeout;\n    }\n  }\n}\n\n// Test circuit breaker\nconst cb = new CircuitBreaker(2, 1000);\nconst faultyOperation = () => { throw new Error("Service down"); };\nconst healthyOperation = () => "Success";\n\nconsole.log(cb.call(healthyOperation));\nconsole.log(cb.call(faultyOperation));\nconsole.log(cb.call(faultyOperation));\nconsole.log(cb.call(healthyOperation));',
        languageId: 63,
        expectedOutput: 'Success\nOperation failed\nOperation failed\nCircuit breaker is OPEN',
        courseId: courses[5].id,
        difficulty: 'hard',
        testCases: [{ input: 'threshold=2', expected: 'Success\nOperation failed\nOperation failed\nCircuit breaker is OPEN' }]
      }
    ]);

    console.log('Database seeded successfully with comprehensive courses!');
    console.log(`Created ${courses.length} courses with multiple difficulty levels`);
    console.log('All questions have verifiable outputs for testing');
    
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
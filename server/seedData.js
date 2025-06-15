import { sequelize, Course, Question } from './models/index.js';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    const courses = await Course.bulkCreate([
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        level: 'beginner',
        category: 'Web Development',
        tags: ['JavaScript', 'Programming', 'Web'],
        estimatedHours: 4
      },
      {
        title: 'Python for Data Science',
        description: 'Introduction to Python programming for data analysis',
        level: 'beginner',
        category: 'Data Science',
        tags: ['Python', 'Data Science', 'Analytics'],
        estimatedHours: 6
      },
      {
        title: 'React Advanced Patterns',
        description: 'Advanced React concepts and patterns',
        level: 'intermediate',
        category: 'Web Development',
        tags: ['React', 'JavaScript', 'Frontend'],
        estimatedHours: 8
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning concepts',
        level: 'intermediate',
        category: 'AI/ML',
        tags: ['Machine Learning', 'AI', 'Python'],
        estimatedHours: 10
      }
    ]);

    await Question.bulkCreate([
      {
        title: 'Hello World',
        description: 'Write a function that returns "Hello, World!"',
        starterCode: 'function helloWorld() {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: 'Hello, World!',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [
          { input: '', expected: 'Hello, World!' }
        ]
      },
      {
        title: 'Add Two Numbers',
        description: 'Write a function that adds two numbers',
        starterCode: 'function addNumbers(a, b) {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: '5',
        courseId: courses[0].id,
        difficulty: 'easy',
        testCases: [
          { input: '2, 3', expected: '5' }
        ]
      },
      {
        title: 'List Operations',
        description: 'Create a list and perform basic operations',
        starterCode: '# Create a list with numbers 1, 2, 3\n# Print the sum of all elements',
        languageId: 71,
        expectedOutput: '6',
        courseId: courses[1].id,
        difficulty: 'easy',
        testCases: [
          { input: '', expected: '6' }
        ]
      },
      {
        title: 'Component State',
        description: 'Create a React component with state management',
        starterCode: 'import React, { useState } from "react";\n\nfunction Counter() {\n  // Your code here\n}',
        languageId: 63,
        expectedOutput: 'Component rendered',
        courseId: courses[2].id,
        difficulty: 'medium',
        testCases: [
          { input: '', expected: 'Component rendered' }
        ]
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIRecommendationService {
  static async generateRecommendations(user, allCourses, userProgress) {
    try {
      // Prepare user profile data
      const userProfile = {
        level: user.level || 'beginner',
        careerStage: user.careerStage || 'student',
        skills: user.skills || [],
        learningGoals: user.learningGoals || [],
        timeAvailability: user.timeAvailability || '1-3'
      };

      // Calculate user's performance metrics
      const performanceMetrics = this.calculatePerformanceMetrics(allCourses, userProgress);

      // Prepare course data for AI analysis
      const courseData = allCourses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        category: course.category,
        tags: course.tags || [],
        estimatedHours: course.estimatedHours,
        totalQuestions: course.questions.length,
        userProgress: performanceMetrics.courseProgress[course.id] || {
          completed: 0,
          total: course.questions.length,
          completionRate: 0
        }
      }));

      // Create AI prompt for course recommendations
      const prompt = this.createRecommendationPrompt(userProfile, courseData, performanceMetrics);

      // Get AI recommendations
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational AI that provides personalized course recommendations. Analyze user profiles and learning patterns to suggest the most suitable courses. Always respond with valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content);
      
      // Process AI recommendations and add detailed scoring
      return this.processAIRecommendations(aiResponse, allCourses, userProgress);

    } catch (error) {
      console.error('AI Recommendation Error:', error);
      // Fallback to mathematical algorithm if AI fails
      return this.fallbackRecommendations(user, allCourses, userProgress);
    }
  }

  static async generateProgressFeedback(user, userProgress, allCourses) {
    try {
      const performanceMetrics = this.calculatePerformanceMetrics(allCourses, userProgress);
      
      // Prepare detailed progress data
      const progressData = {
        overallStats: {
          totalQuestions: performanceMetrics.totalQuestions,
          completedQuestions: performanceMetrics.completedQuestions,
          completionRate: performanceMetrics.overallCompletionRate,
          averageAttempts: performanceMetrics.averageAttempts,
          learningVelocity: performanceMetrics.learningVelocity
        },
        categoryPerformance: performanceMetrics.categoryPerformance,
        recentActivity: performanceMetrics.recentActivity,
        strugglingAreas: performanceMetrics.strugglingAreas,
        strengths: performanceMetrics.strongestCategories
      };

      const feedbackPrompt = this.createFeedbackPrompt(user, progressData);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert learning coach that provides personalized, encouraging, and actionable feedback on student progress. Focus on growth mindset, specific improvements, and motivation."
          },
          {
            role: "user",
            content: feedbackPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('AI Feedback Error:', error);
      return this.fallbackFeedback(user, userProgress);
    }
  }

  static async generateLearningPath(user, allCourses, userProgress) {
    try {
      const performanceMetrics = this.calculatePerformanceMetrics(allCourses, userProgress);
      
      const pathPrompt = this.createLearningPathPrompt(user, allCourses, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer that creates personalized learning paths. Design structured, progressive learning journeys that build skills systematically."
          },
          {
            role: "user",
            content: pathPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('AI Learning Path Error:', error);
      return this.fallbackLearningPath(user, allCourses);
    }
  }

  static async generateSequentialLearningPath(user, allCourses, userProgress) {
    try {
      const performanceMetrics = this.calculatePerformanceMetrics(allCourses, userProgress);
      
      const sequentialPrompt = this.createSequentialPathPrompt(user, allCourses, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer that creates sequential learning paths. Design a step-by-step course sequence that builds knowledge progressively, ensuring each course prepares the student for the next one."
          },
          {
            role: "user",
            content: sequentialPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('AI Sequential Learning Path Error:', error);
      return this.fallbackSequentialPath(user, allCourses, userProgress);
    }
  }

  static createSequentialPathPrompt(user, allCourses, performanceMetrics) {
    return `
Create a sequential learning path for this student with courses in optimal order:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Skills: ${(user.skills || []).join(', ') || 'None specified'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}
- Time Availability: ${user.timeAvailability || '1-3'} hours/week

AVAILABLE COURSES:
${allCourses.map(course => `- ID: ${course.id}, Title: "${course.title}", Level: ${course.level}, Category: ${course.category}, Hours: ${course.estimatedHours}, Questions: ${course.questions.length}`).join('\n')}

CURRENT PROGRESS:
${Object.entries(performanceMetrics.courseProgress).map(([courseId, progress]) => {
  const course = allCourses.find(c => c.id == courseId);
  return `- ${course?.title || 'Unknown'}: ${progress.completionRate}% complete`;
}).join('\n')}

Create a sequential learning path in this JSON format:
{
  "pathTitle": "Personalized Sequential Learning Journey",
  "description": "A step-by-step course sequence tailored to your goals",
  "totalEstimatedDuration": "Total time to complete all courses",
  "difficultyProgression": "How difficulty increases through the sequence",
  "courseSequence": [
    {
      "step": 1,
      "courseId": 1,
      "courseTitle": "Course Name",
      "level": "beginner",
      "category": "Programming",
      "estimatedHours": 6,
      "priority": "high",
      "reasoning": "Why this course comes first in the sequence",
      "prerequisites": ["What knowledge is needed before starting"],
      "learningOutcomes": ["What you'll achieve after completing this course"],
      "preparesFor": ["Which subsequent courses this enables"],
      "keySkills": ["Main skills developed in this course"],
      "currentProgress": 0
    }
  ],
  "learningStrategy": "Overall approach and methodology for this path",
  "milestones": [
    {
      "afterCourse": 1,
      "achievement": "What you'll have accomplished",
      "nextSteps": "What becomes possible next"
    }
  ],
  "tips": ["Study tips for following this sequential path"],
  "timeManagement": {
    "weeklySchedule": "Recommended weekly time distribution",
    "pacing": "How to pace through the courses",
    "breaks": "When to take breaks between courses"
  },
  "adaptations": {
    "ifStruggling": "What to do if a course is too difficult",
    "ifAdvancing": "How to accelerate if courses are too easy",
    "skipConditions": "When it's okay to skip a course"
  }
}

IMPORTANT GUIDELINES:
1. Order courses from foundational to advanced
2. Ensure each course builds upon previous ones
3. Consider the student's current level and goals
4. Balance challenge with achievability
5. Include all relevant courses in logical sequence
6. Provide clear reasoning for the order
7. Consider time constraints and pacing
8. Include progress tracking and adaptation strategies
`;
  }

  static createFeedbackPrompt(user, progressData) {
    return `
Analyze this student's learning progress and provide personalized feedback:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}

PROGRESS DATA:
- Overall Completion Rate: ${progressData.overallStats.completionRate}%
- Questions Completed: ${progressData.overallStats.completedQuestions}/${progressData.overallStats.totalQuestions}
- Average Attempts per Question: ${progressData.overallStats.averageAttempts}
- Learning Velocity: ${progressData.overallStats.learningVelocity}

CATEGORY PERFORMANCE:
${progressData.categoryPerformance.map(cat => `- ${cat.category}: ${cat.rate}%`).join('\n')}

STRENGTHS: ${progressData.strengths.join(', ')}
STRUGGLING AREAS: ${progressData.strugglingAreas.join(', ')}

Provide feedback in this JSON format:
{
  "overallAssessment": "Brief overall assessment of progress",
  "strengths": ["List of specific strengths observed"],
  "areasForImprovement": ["Specific areas that need work"],
  "motivationalMessage": "Encouraging message to keep them motivated",
  "actionableAdvice": ["Specific, actionable steps to improve"],
  "nextMilestones": ["Suggested next goals/milestones"],
  "studyTips": ["Personalized study tips based on their performance"],
  "encouragement": "Personal encouragement message"
}

Make the feedback encouraging, specific, and actionable. Focus on growth mindset.
`;
  }

  static createLearningPathPrompt(user, allCourses, performanceMetrics) {
    return `
Create a personalized learning path for this student:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Skills: ${(user.skills || []).join(', ') || 'None specified'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}
- Time Availability: ${user.timeAvailability || '1-3'} hours/week

AVAILABLE COURSES:
${allCourses.map(course => `- ${course.title} (${course.level}, ${course.category}, ${course.estimatedHours}h)`).join('\n')}

CURRENT PROGRESS:
${Object.entries(performanceMetrics.courseProgress).map(([courseId, progress]) => {
  const course = allCourses.find(c => c.id == courseId);
  return `- ${course?.title || 'Unknown'}: ${progress.completionRate}%`;
}).join('\n')}

Create a learning path in this JSON format:
{
  "pathTitle": "Descriptive title for the learning path",
  "description": "Brief description of the learning journey",
  "estimatedDuration": "Total estimated time to complete",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "description": "What this phase covers",
      "duration": "Estimated time for this phase",
      "courses": [
        {
          "courseId": 1,
          "title": "Course title",
          "priority": "high/medium/low",
          "reasoning": "Why this course is included in this phase"
        }
      ],
      "learningObjectives": ["What they'll learn in this phase"],
      "prerequisites": ["What they need before starting this phase"]
    }
  ],
  "tips": ["General tips for following this learning path"],
  "milestones": ["Key milestones to track progress"]
}

Design a progressive path that builds skills systematically.
`;
  }

  static createRecommendationPrompt(userProfile, courseData, performanceMetrics) {
    return `
Analyze this user's learning profile and recommend the top 6 courses:

USER PROFILE:
- Level: ${userProfile.level}
- Career Stage: ${userProfile.careerStage}
- Current Skills: ${userProfile.skills.join(', ') || 'None specified'}
- Learning Goals: ${userProfile.learningGoals.join(', ') || 'None specified'}
- Time Availability: ${userProfile.timeAvailability} hours/week

PERFORMANCE METRICS:
- Overall Completion Rate: ${performanceMetrics.overallCompletionRate}%
- Strongest Categories: ${performanceMetrics.strongestCategories.join(', ')}
- Areas for Improvement: ${performanceMetrics.improvementAreas.join(', ')}
- Learning Velocity: ${performanceMetrics.learningVelocity}

AVAILABLE COURSES:
${JSON.stringify(courseData, null, 2)}

Please recommend exactly 6 courses and respond in this JSON format:
{
  "recommendations": [
    {
      "courseId": 1,
      "score": 95,
      "reasoning": "Detailed explanation of why this course is recommended",
      "factors": {
        "goalAlignment": 90,
        "levelMatch": 85,
        "skillBuilding": 95,
        "progressOptimization": 80,
        "timeCommitment": 75
      },
      "learningPath": "Explanation of how this fits into their learning journey"
    }
  ],
  "overallStrategy": "Brief explanation of the recommended learning strategy"
}

Consider:
1. Learning goal alignment and career relevance
2. Appropriate difficulty progression
3. Skill gap analysis and building upon existing knowledge
4. Time commitment vs. available hours
5. Variety in learning topics to maintain engagement
6. Optimal challenge level (not too easy, not too hard)
`;
  }

  static calculatePerformanceMetrics(allCourses, userProgress) {
    const categoryPerformance = {};
    let totalQuestions = 0;
    let completedQuestions = 0;
    let totalAttempts = 0;
    const courseProgress = {};
    const strugglingAreas = [];

    // Calculate performance by category and overall
    allCourses.forEach(course => {
      const courseProgressData = userProgress.filter(p => p.courseId === course.id);
      const completed = courseProgressData.filter(p => p.completed).length;
      const total = course.questions.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      const attempts = courseProgressData.reduce((sum, p) => sum + p.attempts, 0);

      courseProgress[course.id] = { completed, total, completionRate, attempts };
      totalQuestions += total;
      completedQuestions += completed;
      totalAttempts += attempts;

      // Track category performance
      if (course.category) {
        if (!categoryPerformance[course.category]) {
          categoryPerformance[course.category] = { completed: 0, total: 0, attempts: 0 };
        }
        categoryPerformance[course.category].completed += completed;
        categoryPerformance[course.category].total += total;
        categoryPerformance[course.category].attempts += attempts;
      }

      // Identify struggling areas (high attempts, low completion)
      if (attempts > completed * 3 && completed > 0) {
        strugglingAreas.push(course.category);
      }
    });

    // Calculate category completion rates
    const categoryRates = Object.entries(categoryPerformance).map(([category, data]) => ({
      category,
      rate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      avgAttempts: data.completed > 0 ? data.attempts / data.completed : 0
    }));

    const strongestCategories = categoryRates
      .filter(c => c.rate >= 60)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3)
      .map(c => c.category);

    const improvementAreas = categoryRates
      .filter(c => c.rate < 40 && c.rate > 0)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3)
      .map(c => c.category);

    // Calculate recent activity
    const recentProgress = userProgress
      .filter(p => p.completedAt && new Date(p.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;

    return {
      overallCompletionRate: totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0,
      strongestCategories,
      improvementAreas,
      learningVelocity: this.calculateLearningVelocity(userProgress),
      courseProgress,
      categoryPerformance: categoryRates,
      totalQuestions,
      completedQuestions,
      averageAttempts: completedQuestions > 0 ? Math.round(totalAttempts / completedQuestions * 10) / 10 : 0,
      recentActivity: recentProgress,
      strugglingAreas: [...new Set(strugglingAreas)]
    };
  }

  static calculateLearningVelocity(userProgress) {
    const recentProgress = userProgress
      .filter(p => p.completedAt && new Date(p.completedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .length;
    
    if (recentProgress >= 10) return 'High';
    if (recentProgress >= 5) return 'Medium';
    return 'Low';
  }

  static processAIRecommendations(aiResponse, allCourses, userProgress) {
    const recommendations = aiResponse.recommendations.map(rec => {
      const course = allCourses.find(c => c.id === rec.courseId);
      if (!course) return null;

      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const totalQuestions = course.questions.length;
      const completedQuestions = courseProgress.filter(p => p.completed).length;
      const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

      return {
        ...course.toJSON(),
        progress: {
          completed: completedQuestions,
          total: totalQuestions,
          percentage: progressPercentage
        },
        recommendation: {
          score: rec.score,
          reasoning: rec.reasoning,
          factors: Object.entries(rec.factors).map(([name, score]) => ({
            name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            score,
            weight: this.getFactorWeight(name)
          })),
          learningPath: rec.learningPath,
          aiGenerated: true
        }
      };
    }).filter(Boolean);

    return {
      recommendations,
      strategy: aiResponse.overallStrategy,
      metadata: {
        algorithm: 'OpenAI GPT-3.5 Turbo',
        generatedAt: new Date().toISOString(),
        model: 'AI-Powered Personalized Learning'
      }
    };
  }

  static getFactorWeight(factorName) {
    const weights = {
      goalAlignment: 35,
      levelMatch: 25,
      skillBuilding: 20,
      progressOptimization: 15,
      timeCommitment: 5
    };
    return weights[factorName] || 10;
  }

  static fallbackSequentialPath(user, allCourses, userProgress) {
    // Sort courses by level and estimated hours for a logical progression
    const sortedCourses = allCourses.sort((a, b) => {
      const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) return levelDiff;
      return a.estimatedHours - b.estimatedHours;
    });

    const courseSequence = sortedCourses.map((course, index) => {
      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const completedQuestions = courseProgress.filter(p => p.completed).length;
      const totalQuestions = course.questions.length;
      const currentProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

      return {
        step: index + 1,
        courseId: course.id,
        courseTitle: course.title,
        level: course.level,
        category: course.category,
        estimatedHours: course.estimatedHours,
        priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        reasoning: `Step ${index + 1} in your learning journey - builds foundational skills for subsequent courses`,
        prerequisites: index === 0 ? ['Basic computer literacy'] : [`Complete Step ${index}`],
        learningOutcomes: [`Master ${course.category} concepts`, 'Build problem-solving skills'],
        preparesFor: index < sortedCourses.length - 1 ? [`Step ${index + 2} courses`] : ['Advanced projects'],
        keySkills: course.tags || [course.category],
        currentProgress
      };
    });

    return {
      pathTitle: "Structured Programming Journey",
      description: "A systematic progression through programming concepts",
      totalEstimatedDuration: `${sortedCourses.reduce((sum, c) => sum + c.estimatedHours, 0)} hours`,
      difficultyProgression: "Beginner → Intermediate → Advanced",
      courseSequence,
      learningStrategy: "Progressive skill building with hands-on practice",
      milestones: [
        { afterCourse: 2, achievement: "Programming fundamentals mastered", nextSteps: "Ready for data structures" },
        { afterCourse: 4, achievement: "Intermediate concepts understood", nextSteps: "Advanced algorithm design" },
        { afterCourse: 6, achievement: "Advanced programming skills", nextSteps: "Real-world projects" }
      ],
      tips: ["Practice daily", "Build projects", "Join coding communities"],
      timeManagement: {
        weeklySchedule: "2-3 hours per course per week",
        pacing: "Complete one course before starting the next",
        breaks: "Take 1-2 days break between courses"
      },
      adaptations: {
        ifStruggling: "Spend extra time on fundamentals, seek help from community",
        ifAdvancing: "Add bonus challenges, explore related topics",
        skipConditions: "Only skip if you can demonstrate mastery through assessment"
      }
    };
  }

  static fallbackRecommendations(user, allCourses, userProgress) {
    // Mathematical fallback algorithm (existing logic)
    const scoredCourses = allCourses.map(course => {
      let score = Math.random() * 40 + 60; // Base score 60-100
      
      // Simple scoring based on user preferences
      if (user.learningGoals) {
        const goalMatch = user.learningGoals.some(goal => 
          course.title.toLowerCase().includes(goal.toLowerCase()) ||
          course.category.toLowerCase().includes(goal.toLowerCase())
        );
        if (goalMatch) score += 20;
      }

      if (user.level === course.level) score += 15;

      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const completionRate = course.questions.length > 0 ? 
        courseProgress.filter(p => p.completed).length / course.questions.length : 0;
      
      if (completionRate === 0) score += 10; // Prefer new courses
      if (completionRate === 1) score -= 30; // Avoid completed courses

      return {
        course,
        score: Math.min(100, Math.max(0, score))
      };
    });

    const recommendations = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ course, score }) => {
        const courseProgress = userProgress.filter(p => p.courseId === course.id);
        const totalQuestions = course.questions.length;
        const completedQuestions = courseProgress.filter(p => p.completed).length;
        const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

        return {
          ...course.toJSON(),
          progress: {
            completed: completedQuestions,
            total: totalQuestions,
            percentage: progressPercentage
          },
          recommendation: {
            score: Math.round(score),
            reasoning: "Recommended based on your profile and preferences",
            factors: [
              { name: 'Profile Match', score: Math.round(score * 0.8), weight: 50 },
              { name: 'Content Relevance', score: Math.round(score * 0.9), weight: 30 },
              { name: 'Learning Path', score: Math.round(score * 0.7), weight: 20 }
            ],
            aiGenerated: false
          }
        };
      });

    return {
      recommendations,
      strategy: "Recommendations based on your learning preferences and progress",
      metadata: {
        algorithm: 'Mathematical Scoring (Fallback)',
        generatedAt: new Date().toISOString(),
        model: 'Rule-Based Recommendation'
      }
    };
  }

  static fallbackFeedback(user, userProgress) {
    const totalQuestions = userProgress.length;
    const completedQuestions = userProgress.filter(p => p.completed).length;
    const completionRate = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

    return {
      overallAssessment: `You have completed ${completionRate}% of attempted questions. Keep up the good work!`,
      strengths: ["Consistent practice", "Problem-solving approach"],
      areasForImprovement: ["Focus on completing more challenges", "Review fundamental concepts"],
      motivationalMessage: "Every expert was once a beginner. Keep coding!",
      actionableAdvice: ["Practice daily for 30 minutes", "Review solutions after completing problems"],
      nextMilestones: ["Complete 10 more questions", "Try a new programming language"],
      studyTips: ["Break down complex problems", "Use debugging techniques"],
      encouragement: "You're making great progress on your coding journey!"
    };
  }

  static fallbackLearningPath(user, allCourses) {
    const beginnerCourses = allCourses.filter(c => c.level === 'beginner');
    const intermediateCourses = allCourses.filter(c => c.level === 'intermediate');
    
    return {
      pathTitle: "Structured Programming Journey",
      description: "A systematic approach to learning programming",
      estimatedDuration: "3-6 months",
      phases: [
        {
          phaseNumber: 1,
          title: "Foundation Building",
          description: "Master the basics",
          duration: "4-6 weeks",
          courses: beginnerCourses.slice(0, 2).map(course => ({
            courseId: course.id,
            title: course.title,
            priority: "high",
            reasoning: "Essential foundation skills"
          })),
          learningObjectives: ["Basic syntax", "Problem solving"],
          prerequisites: ["None"]
        },
        {
          phaseNumber: 2,
          title: "Skill Development",
          description: "Build intermediate skills",
          duration: "6-8 weeks",
          courses: intermediateCourses.slice(0, 2).map(course => ({
            courseId: course.id,
            title: course.title,
            priority: "medium",
            reasoning: "Intermediate skill building"
          })),
          learningObjectives: ["Advanced concepts", "Real-world applications"],
          prerequisites: ["Complete Phase 1"]
        }
      ],
      tips: ["Practice regularly", "Build projects", "Join coding communities"],
      milestones: ["Complete first course", "Solve 50 problems", "Build first project"]
    };
  }
}
import OpenAI from 'openai/index.mjs';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIRecommendationService {
  static async generateRecommendations(user, allCourses, userProgress) {
    try {

      const userProfile = {
        level: user.level || 'beginner',
        careerStage: user.careerStage || 'student',
        skills: user.skills || [],
        learningGoals: user.learningGoals || [],
        timeAvailability: user.timeAvailability || '1-3'
      };

      const performanceMetrics = this.calculatePerformanceMetrics(allCourses, userProgress);

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

      const prompt = this.createRecommendationPrompt(userProfile, courseData, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational AI that provides personalized course recommendations. Analyze user profiles and learning patterns to suggest the most suitable courses. Always respond with valid JSON format. Limit recommendations to exactly 4 courses maximum."
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
      
      return this.processAIRecommendations(aiResponse, allCourses, userProgress);

    } catch (error) {
      console.error('AI Recommendation Error:', error);

      return this.fallbackRecommendations(user, allCourses, userProgress);
    }
  }

  static async generateProgressFeedback(user, userProgress, allCourses, recommendedCourses) {
    try {
      const performanceMetrics = this.calculatePerformanceMetrics(recommendedCourses, userProgress);
      
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

      const feedbackPrompt = this.createAdvancedFeedbackPrompt(user, progressData);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an advanced AI learning coach with deep expertise in educational psychology, learning science, and personalized instruction. Provide highly sophisticated, data-driven feedback that demonstrates advanced AI capabilities including pattern recognition, predictive analytics, and adaptive learning strategies. Your analysis should be comprehensive, insightful, and clearly AI-generated."
          },
          {
            role: "user",
            content: feedbackPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('AI Feedback Error:', error);
      return this.fallbackDataAnalyticsFeedback(user, userProgress, recommendedCourses);
    }
  }

  static async generateLearningPath(user, recommendedCourses, userProgress) {
    try {
      const performanceMetrics = this.calculatePerformanceMetrics(recommendedCourses, userProgress);
      
      const pathPrompt = this.createLearningPathPrompt(user, recommendedCourses, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer that creates personalized learning paths. Design structured, progressive learning journeys that build skills systematically using only the provided recommended courses."
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
      return this.fallbackMathematicalLearningPath(user, recommendedCourses, userProgress);
    }
  }

  static async generateSequentialLearningPath(user, recommendedCourses, userProgress) {
    try {
      const performanceMetrics = this.calculatePerformanceMetrics(recommendedCourses, userProgress);
      
      const sequentialPrompt = this.createSequentialPathPrompt(user, recommendedCourses, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer that creates sequential learning paths. Design a step-by-step course sequence that builds knowledge progressively, ensuring each course prepares the student for the next one. Use only the provided recommended courses."
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
      return this.fallbackMathematicalSequentialPath(user, recommendedCourses, userProgress);
    }
  }

  static createAdvancedFeedbackPrompt(user, progressData) {
    return `
As an advanced AI learning coach, perform a comprehensive analysis of this student's learning patterns and provide sophisticated, data-driven feedback:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}

ADVANCED ANALYTICS:
- Completion Rate: ${progressData.overallStats.completionRate}% (Recommended courses only)
- Questions Mastered: ${progressData.overallStats.completedQuestions}/${progressData.overallStats.totalQuestions}
- Learning Efficiency: ${progressData.overallStats.averageAttempts} avg attempts per question
- Learning Velocity: ${progressData.overallStats.learningVelocity}

PERFORMANCE PATTERNS:
${progressData.categoryPerformance.map(cat => `- ${cat.category}: ${cat.rate}% mastery rate`).join('\n')}

COGNITIVE STRENGTHS: ${progressData.strengths.join(', ')}
LEARNING CHALLENGES: ${progressData.strugglingAreas.join(', ')}

Provide advanced AI feedback in this JSON format:
{
  "aiAnalysis": {
    "learningPatternRecognition": "Advanced pattern analysis of learning behavior",
    "cognitiveLoadAssessment": "Analysis of mental processing capacity and optimization",
    "adaptiveLearningRecommendations": "AI-driven personalization strategies"
  },
  "predictiveInsights": {
    "learningTrajectory": "Predicted learning path based on current patterns",
    "potentialChallenges": ["AI-identified future learning obstacles"],
    "optimizationOpportunities": ["Data-driven improvement suggestions"]
  },
  "personalizedStrategies": {
    "cognitiveApproach": "Tailored learning methodology based on cognitive profile",
    "timeOptimization": "AI-calculated optimal study scheduling",
    "difficultyProgression": "Intelligent difficulty scaling recommendations"
  },
  "motivationalPsychology": {
    "intrinsicMotivators": ["Identified internal motivation drivers"],
    "achievementFramework": "Personalized goal-setting strategy",
    "confidenceBuilding": "Targeted confidence enhancement approach"
  },
  "dataInsights": {
    "learningEfficiencyScore": "Quantified learning effectiveness rating",
    "progressPrediction": "AI forecast of future learning outcomes",
    "recommendedAdjustments": ["Specific algorithmic recommendations"]
  },
  "encouragement": "Sophisticated, personalized motivational message demonstrating AI understanding"
}

Make the feedback clearly demonstrate advanced AI capabilities including:
- Pattern recognition across multiple data dimensions
- Predictive analytics and forecasting
- Cognitive load theory application
- Adaptive learning algorithm insights
- Personalized psychological profiling
- Data-driven optimization strategies
`;
  }

  static createRecommendationPrompt(userProfile, courseData, performanceMetrics) {
    return `
Analyze this user's learning profile and recommend exactly 4 courses maximum:

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

Please recommend exactly 4 courses and respond in this JSON format:
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

IMPORTANT: Recommend exactly 4 courses maximum, prioritizing quality over quantity.
`;
  }

  static createLearningPathPrompt(user, recommendedCourses, performanceMetrics) {
    return `
Create a personalized learning path using ONLY the recommended courses:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Skills: ${(user.skills || []).join(', ') || 'None specified'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}
- Time Availability: ${user.timeAvailability || '1-3'} hours/week

RECOMMENDED COURSES ONLY:
${recommendedCourses.map(course => `- ${course.title} (${course.level}, ${course.category}, ${course.estimatedHours}h)`).join('\n')}

CURRENT PROGRESS:
${Object.entries(performanceMetrics.courseProgress).map(([courseId, progress]) => {
  const course = recommendedCourses.find(c => c.id == courseId);
  return `- ${course?.title || 'Unknown'}: ${progress.completionRate}%`;
}).join('\n')}

Create a learning path using ONLY these recommended courses in this JSON format:
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

Use ONLY the provided recommended courses. Design a progressive path that builds skills systematically.
`;
  }

  static createSequentialPathPrompt(user, recommendedCourses, performanceMetrics) {
    return `
Create a sequential learning path using ONLY the recommended courses:

STUDENT PROFILE:
- Level: ${user.level || 'beginner'}
- Career Stage: ${user.careerStage || 'student'}
- Skills: ${(user.skills || []).join(', ') || 'None specified'}
- Learning Goals: ${(user.learningGoals || []).join(', ') || 'General programming'}
- Time Availability: ${user.timeAvailability || '1-3'} hours/week

RECOMMENDED COURSES ONLY:
${recommendedCourses.map(course => `- ID: ${course.id}, Title: "${course.title}", Level: ${course.level}, Category: ${course.category}, Hours: ${course.estimatedHours}, Questions: ${course.questions.length}`).join('\n')}

CURRENT PROGRESS:
${Object.entries(performanceMetrics.courseProgress).map(([courseId, progress]) => {
  const course = recommendedCourses.find(c => c.id == courseId);
  return `- ${course?.title || 'Unknown'}: ${progress.completionRate}% complete`;
}).join('\n')}

Create a sequential learning path using ONLY these recommended courses in this JSON format:
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
  }
}

IMPORTANT: Use ONLY the provided recommended courses. Order them logically from foundational to advanced.
`;
  }

  static calculatePerformanceMetrics(courses, userProgress) {
    const categoryPerformance = {};
    let totalQuestions = 0;
    let completedQuestions = 0;
    let totalAttempts = 0;
    const courseProgress = {};
    const strugglingAreas = [];

    courses.forEach(course => {
      const courseProgressData = userProgress.filter(p => p.courseId === course.id);
      const completed = courseProgressData.filter(p => p.completed).length;
      const total = course.questions.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      const attempts = courseProgressData.reduce((sum, p) => sum + p.attempts, 0);

      courseProgress[course.id] = { completed, total, completionRate, attempts };
      totalQuestions += total;
      completedQuestions += completed;
      totalAttempts += attempts;

      if (course.category) {
        if (!categoryPerformance[course.category]) {
          categoryPerformance[course.category] = { completed: 0, total: 0, attempts: 0 };
        }
        categoryPerformance[course.category].completed += completed;
        categoryPerformance[course.category].total += total;
        categoryPerformance[course.category].attempts += attempts;
      }

      if (attempts > completed * 3 && completed > 0) {
        strugglingAreas.push(course.category);
      }
    });

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
    const recommendations = aiResponse.recommendations.slice(0, 4).map(rec => {
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

  static fallbackMathematicalSequentialPath(user, recommendedCourses, userProgress) {

    const sortedCourses = recommendedCourses.sort((a, b) => {
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
        priority: index < 2 ? 'high' : index < 3 ? 'medium' : 'low',
        reasoning: `Step ${index + 1} in your learning journey - builds foundational skills for subsequent courses`,
        prerequisites: index === 0 ? ['Basic computer literacy'] : [`Complete Step ${index}`],
        learningOutcomes: [`Master ${course.category} concepts`, 'Build problem-solving skills'],
        preparesFor: index < sortedCourses.length - 1 ? [`Step ${index + 2} courses`] : ['Advanced projects'],
        keySkills: course.tags || [course.category],
        currentProgress
      };
    });

    return {
      pathTitle: "Mathematical Sequential Learning Path",
      description: "A systematic progression through recommended programming concepts",
      totalEstimatedDuration: `${sortedCourses.reduce((sum, c) => sum + c.estimatedHours, 0)} hours`,
      difficultyProgression: "Beginner → Intermediate → Advanced",
      courseSequence,
      learningStrategy: "Progressive skill building with hands-on practice",
      milestones: [
        { afterCourse: 1, achievement: "Programming fundamentals mastered", nextSteps: "Ready for intermediate concepts" },
        { afterCourse: 2, achievement: "Intermediate concepts understood", nextSteps: "Advanced algorithm design" }
      ],
      tips: ["Practice daily", "Build projects", "Join coding communities"],
      timeManagement: {
        weeklySchedule: "2-3 hours per course per week",
        pacing: "Complete one course before starting the next",
        breaks: "Take 1-2 days break between courses"
      }
    };
  }

  static fallbackMathematicalLearningPath(user, recommendedCourses, userProgress) {
    const beginnerCourses = recommendedCourses.filter(c => c.level === 'beginner');
    const intermediateCourses = recommendedCourses.filter(c => c.level === 'intermediate');
    const advancedCourses = recommendedCourses.filter(c => c.level === 'advanced');
    
    const phases = [];
    
    if (beginnerCourses.length > 0) {
      phases.push({
        phaseNumber: 1,
        title: "Foundation Building",
        description: "Master the basics with recommended courses",
        duration: "4-6 weeks",
        courses: beginnerCourses.map(course => ({
          courseId: course.id,
          title: course.title,
          priority: "high",
          reasoning: "Essential foundation skills"
        })),
        learningObjectives: ["Basic syntax", "Problem solving"],
        prerequisites: ["None"]
      });
    }
    
    if (intermediateCourses.length > 0) {
      phases.push({
        phaseNumber: phases.length + 1,
        title: "Skill Development",
        description: "Build intermediate skills",
        duration: "6-8 weeks",
        courses: intermediateCourses.map(course => ({
          courseId: course.id,
          title: course.title,
          priority: "medium",
          reasoning: "Intermediate skill building"
        })),
        learningObjectives: ["Advanced concepts", "Real-world applications"],
        prerequisites: ["Complete Phase 1"]
      });
    }
    
    if (advancedCourses.length > 0) {
      phases.push({
        phaseNumber: phases.length + 1,
        title: "Advanced Mastery",
        description: "Master advanced concepts",
        duration: "8-10 weeks",
        courses: advancedCourses.map(course => ({
          courseId: course.id,
          title: course.title,
          priority: "low",
          reasoning: "Advanced skill mastery"
        })),
        learningObjectives: ["Expert-level concepts", "Complex problem solving"],
        prerequisites: ["Complete previous phases"]
      });
    }

    return {
      pathTitle: "Mathematical Learning Path",
      description: "A systematic approach to learning programming with recommended courses",
      estimatedDuration: "3-6 months",
      phases,
      tips: ["Practice regularly", "Build projects", "Join coding communities"],
      milestones: ["Complete first course", "Solve 50 problems", "Build first project"]
    };
  }

  static fallbackDataAnalyticsFeedback(user, userProgress, recommendedCourses) {
    const totalQuestions = userProgress.length;
    const completedQuestions = userProgress.filter(p => p.completed).length;
    const completionRate = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
    const totalAttempts = userProgress.reduce((sum, p) => sum + p.attempts, 0);
    const avgAttempts = completedQuestions > 0 ? Math.round((totalAttempts / completedQuestions) * 10) / 10 : 0;

    const recentProgress = userProgress.filter(p => 
      p.completedAt && new Date(p.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const categoryStats = {};
    recommendedCourses.forEach(course => {
      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const completed = courseProgress.filter(p => p.completed).length;
      const total = course.questions.length;
      
      if (!categoryStats[course.category]) {
        categoryStats[course.category] = { completed: 0, total: 0 };
      }
      categoryStats[course.category].completed += completed;
      categoryStats[course.category].total += total;
    });

    const strongCategories = Object.entries(categoryStats)
      .filter(([_, stats]) => stats.total > 0 && (stats.completed / stats.total) >= 0.6)
      .map(([category, _]) => category);

    const weakCategories = Object.entries(categoryStats)
      .filter(([_, stats]) => stats.total > 0 && (stats.completed / stats.total) < 0.4)
      .map(([category, _]) => category);

    return {
      aiAnalysis: {
        learningPatternRecognition: `Data analysis shows ${completionRate}% completion rate with ${avgAttempts} average attempts per question, indicating ${avgAttempts < 2 ? 'efficient' : avgAttempts < 3 ? 'moderate' : 'challenging'} learning patterns.`,
        cognitiveLoadAssessment: `Based on attempt patterns, cognitive load appears ${avgAttempts < 2 ? 'optimal' : avgAttempts < 4 ? 'manageable' : 'high'}. Consider adjusting difficulty progression.`,
        adaptiveLearningRecommendations: `Analytics suggest ${recentProgress > 5 ? 'maintaining current pace' : 'increasing study frequency'} for optimal learning outcomes.`
      },
      predictiveInsights: {
        learningTrajectory: `Current trajectory suggests ${completionRate > 70 ? 'excellent' : completionRate > 50 ? 'good' : 'developing'} progress toward learning goals.`,
        potentialChallenges: weakCategories.length > 0 ? [`Difficulty in ${weakCategories.join(', ')} areas`] : ["No significant challenges identified"],
        optimizationOpportunities: [`Focus on ${weakCategories.length > 0 ? weakCategories[0] : 'advanced concepts'}`, "Increase practice frequency"]
      },
      personalizedStrategies: {
        cognitiveApproach: avgAttempts > 3 ? "Break down complex problems into smaller steps" : "Continue current problem-solving approach",
        timeOptimization: `Based on current pace, allocate ${recentProgress < 3 ? 'more' : 'consistent'} time for practice`,
        difficultyProgression: completionRate > 80 ? "Ready for more challenging content" : "Consolidate current level before advancing"
      },
      motivationalPsychology: {
        intrinsicMotivators: strongCategories.length > 0 ? [`Success in ${strongCategories.join(', ')}`] : ["Problem-solving achievements"],
        achievementFramework: `Target ${Math.min(completionRate + 20, 100)}% completion rate in next phase`,
        confidenceBuilding: strongCategories.length > 0 ? `Build on strengths in ${strongCategories[0]}` : "Focus on incremental progress"
      },
      dataInsights: {
        learningEfficiencyScore: `${Math.max(0, 100 - (avgAttempts - 1) * 20)}/100`,
        progressPrediction: `Projected to complete current courses in ${Math.ceil((totalQuestions - completedQuestions) / Math.max(1, recentProgress))} weeks`,
        recommendedAdjustments: avgAttempts > 3 ? ["Reduce problem complexity", "Increase review time"] : ["Maintain current approach"]
      },
      encouragement: `Your data shows ${completionRate > 50 ? 'strong' : 'developing'} progress! ${strongCategories.length > 0 ? `You excel in ${strongCategories[0]} - leverage this strength!` : 'Keep building your foundation!'}`
    };
  }

  static fallbackRecommendations(user, allCourses, userProgress) {

    const scoredCourses = allCourses.map(course => {
      let score = 50; 
      
      if (user.level === course.level) score += 25;
      else if (user.level === 'beginner' && course.level === 'intermediate') score += 10;
      else if (user.level === 'intermediate' && course.level === 'advanced') score += 10;
      
      if (user.learningGoals) {
        const goalMatch = user.learningGoals.some(goal => 
          course.title.toLowerCase().includes(goal.toLowerCase()) ||
          course.category.toLowerCase().includes(goal.toLowerCase())
        );
        if (goalMatch) score += 20;
      }

      if (user.skills) {
        const skillMatch = user.skills.some(skill =>
          course.tags?.includes(skill) || course.title.toLowerCase().includes(skill.toLowerCase())
        );
        if (skillMatch) score += 15;
      }

      const courseProgress = userProgress.filter(p => p.courseId === course.id);
      const completionRate = course.questions.length > 0 ? 
        courseProgress.filter(p => p.completed).length / course.questions.length : 0;
      
      if (completionRate === 0) score += 10; 
      if (completionRate === 1) score -= 40; 
      if (completionRate > 0 && completionRate < 1) score += 5; 

      const timeMap = { '1-3': 1, '4-6': 2, '7-10': 3, '10+': 4 };
      const userTime = timeMap[user.timeAvailability] || 2;
      const courseTime = course.estimatedHours <= 6 ? 1 : course.estimatedHours <= 12 ? 2 : course.estimatedHours <= 20 ? 3 : 4;
      
      if (Math.abs(userTime - courseTime) <= 1) score += 10;

      return { course, score: Math.min(100, Math.max(0, score)) };
    });

    const recommendations = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 4) 
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
            reasoning: "Recommended based on mathematical analysis of your profile and preferences",
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
      strategy: "Recommendations based on mathematical analysis of your learning preferences and progress",
      metadata: {
        algorithm: 'Mathematical Scoring (Fallback)',
        generatedAt: new Date().toISOString(),
        model: 'Rule-Based Recommendation'
      }
    };
  }
}
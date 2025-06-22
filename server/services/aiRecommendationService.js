import OpenAI from 'openai';
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
        level: course.level,
        category: course.category,
        tags: course.tags || [],
        estimatedHours: course.estimatedHours,
        totalQuestions: course.questions.length,
        completionRate: performanceMetrics.courseProgress[course.id]?.completionRate || 0
      }));

      const prompt = this.createRecommendationPrompt(userProfile, courseData, performanceMetrics);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational AI. Analyze user learning profiles and provide balanced, grounded, and personalized course recommendations. Always respond in valid JSON."
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

  static createRecommendationPrompt(userProfile, courseData, performanceMetrics) {
    return `
USER PROFILE:
- Level: ${userProfile.level}
- Career Stage: ${userProfile.careerStage}
- Current Skills: ${userProfile.skills.join(', ') || 'None'}
- Learning Goals: ${userProfile.learningGoals.join(', ') || 'None'}
- Time Availability: ${userProfile.timeAvailability} hours/week

PERFORMANCE METRICS:
- Overall Completion Rate: ${performanceMetrics.overallCompletionRate}%
- Strongest Categories: ${performanceMetrics.strongestCategories.join(', ')}
- Areas for Improvement: ${performanceMetrics.improvementAreas.join(', ')}
- Learning Velocity: ${performanceMetrics.learningVelocity}

AVAILABLE COURSES:
${JSON.stringify(courseData, null, 2)}

TASK:
Recommend exactly 6 courses using the following JSON format. Never assign a score of 100. Use a realistic range from 50 to 95.

{
  "recommendations": [
    {
      "courseId": 1,
      "score": 85,
      "reasoning": "Why this course is suitable",
      "factors": {
        "goalAlignment": 85,
        "levelMatch": 75,
        "skillBuilding": 80,
        "progressOptimization": 70,
        "timeCommitment": 65
      },
      "learningPath": "How it fits the user's journey"
    }
  ],
  "overallStrategy": "Summarize your recommendation approach"
}
`;
  }

  static calculatePerformanceMetrics(allCourses, userProgress) {
    const categoryPerformance = {};
    let totalQuestions = 0;
    let completedQuestions = 0;
    const courseProgress = {};

    allCourses.forEach(course => {
      const courseProgressData = userProgress.filter(p => p.courseId === course.id);
      const completed = courseProgressData.filter(p => p.completed).length;
      const total = course.questions.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      courseProgress[course.id] = { completed, total, completionRate };
      totalQuestions += total;
      completedQuestions += completed;

      if (course.category) {
        if (!categoryPerformance[course.category]) {
          categoryPerformance[course.category] = { completed: 0, total: 0 };
        }
        categoryPerformance[course.category].completed += completed;
        categoryPerformance[course.category].total += total;
      }
    });

    const categoryRates = Object.entries(categoryPerformance).map(([category, data]) => ({
      category,
      rate: data.total > 0 ? (data.completed / data.total) * 100 : 0
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

    return {
      overallCompletionRate: totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0,
      strongestCategories,
      improvementAreas,
      learningVelocity: this.calculateLearningVelocity(userProgress),
      courseProgress,
      categoryPerformance: categoryRates
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

  static scaleScore(rawScore) {
    if (rawScore >= 95) return 90;
    if (rawScore >= 90) return 85;
    if (rawScore >= 80) return 80;
    if (rawScore < 50) return 50;
    return Math.round(rawScore);
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
          score: this.scaleScore(rec.score),
          reasoning: rec.reasoning,
          factors: Object.entries(rec.factors).map(([name, score]) => ({
            name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            score: Math.min(100, Math.max(0, score)),
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

  static fallbackRecommendations(user, allCourses, userProgress) {
    const scoredCourses = allCourses.map(course => {
      let score = Math.random() * 40 + 60;

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

      if (completionRate === 0) score += 10;
      if (completionRate === 1) score -= 30;

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
}

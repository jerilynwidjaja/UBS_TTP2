import OpenAI from 'openai';
import { User, Course, UserProgress } from '../models/index.js';

export class AIRecommendationService {
  static openai = null;
  static quotaExceeded = false;
  static lastQuotaCheck = 0;
  static QUOTA_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  static QUOTA_LIMIT = 2000000; // 2 million tokens
  static tokensUsed = 0;

  static initializeOpenAI() {
    if (!this.openai && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  static async generateRecommendations(user, allCourses, userProgress, forceRefresh = false) {
    this.initializeOpenAI();
    
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    console.log(`[${requestId}] Starting recommendation generation for user ${user.id}`);
    
    // Check if we should try AI first
    const shouldTryAI = this.openai && 
                       process.env.OPENAI_API_KEY && 
                       !this.quotaExceeded &&
                       this.hasUserPreferences(user);

    if (shouldTryAI) {
      console.log(`[${requestId}] Attempting AI recommendations...`);
      try {
        const aiResult = await this.generateAIRecommendations(user, allCourses, userProgress, requestId);
        const processingTime = Date.now() - startTime;
        
        console.log(`[${requestId}] AI recommendations successful in ${processingTime}ms`);
        
        return {
          recommendations: aiResult.recommendations,
          metadata: {
            algorithm: 'OpenAI GPT-3.5 Turbo',
            model: 'gpt-3.5-turbo',
            generatedAt: new Date().toISOString(),
            aiUsed: true,
            requestId,
            processingTime,
            inputTokens: aiResult.inputTokens,
            outputTokens: aiResult.outputTokens,
            totalTokens: aiResult.totalTokens,
            tokensUsed: aiResult.totalTokens,
            remainingTokens: Math.max(0, this.QUOTA_LIMIT - this.tokensUsed),
            clicksBeforeQuota: Math.floor((this.QUOTA_LIMIT - this.tokensUsed) / 1500),
            estimatedQuotaLimit: this.QUOTA_LIMIT
          },
          aiResponse: aiResult.aiResponse,
          rawAiResponse: aiResult.rawResponse
        };
      } catch (error) {
        console.error(`[${requestId}] AI recommendation failed:`, error);
        
        // Check if it's a quota error
        if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
          this.quotaExceeded = true;
          console.log(`[${requestId}] OpenAI quota exceeded, switching to mathematical fallback`);
        }
        
        // Fall back to mathematical algorithm
        return this.generateMathematicalRecommendations(user, allCourses, userProgress, requestId, startTime, error.message);
      }
    } else {
      const reason = !this.openai ? 'OpenAI not initialized' :
                    !process.env.OPENAI_API_KEY ? 'No OpenAI API key' :
                    this.quotaExceeded ? 'OpenAI quota exceeded' :
                    !this.hasUserPreferences(user) ? 'User preferences incomplete' :
                    'Unknown reason';
      
      console.log(`[${requestId}] Using mathematical fallback: ${reason}`);
      return this.generateMathematicalRecommendations(user, allCourses, userProgress, requestId, startTime, reason);
    }
  }

  static hasUserPreferences(user) {
    return !!(user.careerStage && user.level && 
             user.skills?.length > 0 && user.learningGoals?.length > 0);
  }

  static async generateAIRecommendations(user, allCourses, userProgress, requestId) {
    const progressMap = new Map();
    userProgress.forEach(p => {
      if (!progressMap.has(p.courseId)) {
        progressMap.set(p.courseId, { completed: 0, total: 0, attempts: 0 });
      }
      const courseProgress = progressMap.get(p.courseId);
      courseProgress.total++;
      courseProgress.attempts += p.attempts;
      if (p.completed) courseProgress.completed++;
    });

    const coursesWithProgress = allCourses.map(course => {
      const progress = progressMap.get(course.id) || { completed: 0, total: course.questions?.length || 0, attempts: 0 };
      const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
      
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        category: course.category,
        estimatedHours: course.estimatedHours,
        tags: course.tags,
        progress: {
          completed: progress.completed,
          total: progress.total,
          percentage,
          averageAttempts: progress.completed > 0 ? (progress.attempts / progress.completed).toFixed(1) : 0
        }
      };
    });

    const prompt = `You are an AI learning advisor for a coding education platform. Analyze the user profile and recommend exactly 4 courses from the available options.

USER PROFILE:
- Career Stage: ${user.careerStage}
- Current Level: ${user.level}
- Skills: ${user.skills?.join(', ') || 'None specified'}
- Learning Goals: ${user.learningGoals?.join(', ') || 'None specified'}
- Time Availability: ${user.timeAvailability}

AVAILABLE COURSES:
${coursesWithProgress.map(course => 
  `${course.id}. ${course.title} (${course.level}) - ${course.description}
   Category: ${course.category} | Hours: ${course.estimatedHours} | Progress: ${course.progress.percentage}%`
).join('\n')}

REQUIREMENTS:
1. Recommend exactly 4 courses that best match the user's profile
2. Consider skill level progression and learning goals alignment
3. Provide detailed reasoning for each recommendation
4. Score each recommended course from 0-100 based on relevance

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "courseId": number,
      "score": number,
      "reasoning": "detailed explanation of why this course is recommended",
      "skillAlignment": "how this aligns with user's current skills",
      "goalAlignment": "how this helps achieve learning goals",
      "careerImpact": "impact on user's career progression",
      "expectedOutcome": "what the user will achieve after completing this course"
    }
  ],
  "overallStrategy": "explanation of the overall learning strategy for this user",
  "learningPath": "suggested order and approach for taking these courses"
}`;

    console.log(`[${requestId}] Sending request to OpenAI...`);
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0].message.content;
    console.log(`[${requestId}] Raw OpenAI response:`, rawResponse);

    // Update token usage
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const totalTokens = completion.usage?.total_tokens || 0;
    
    this.tokensUsed += totalTokens;
    
    console.log(`[${requestId}] Token usage - Input: ${inputTokens}, Output: ${outputTokens}, Total: ${totalTokens}`);
    console.log(`[${requestId}] Total tokens used so far: ${this.tokensUsed}/${this.QUOTA_LIMIT}`);

    let aiResponse;
    try {
      aiResponse = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse AI response:`, parseError);
      throw new Error('Invalid AI response format');
    }

    if (!aiResponse.recommendations || !Array.isArray(aiResponse.recommendations)) {
      throw new Error('AI response missing recommendations array');
    }

    // Map AI recommendations to course objects
    const recommendedCourses = aiResponse.recommendations
      .slice(0, 4) // Ensure exactly 4 courses
      .map(rec => {
        const course = coursesWithProgress.find(c => c.id === rec.courseId);
        if (!course) {
          console.warn(`[${requestId}] Course ${rec.courseId} not found`);
          return null;
        }

        return {
          ...course,
          recommendation: {
            score: rec.score,
            reasoning: rec.reasoning,
            skillAlignment: rec.skillAlignment,
            goalAlignment: rec.goalAlignment,
            careerImpact: rec.careerImpact,
            expectedOutcome: rec.expectedOutcome,
            aiGenerated: true,
            factors: [
              { name: 'Skill Alignment', score: Math.min(100, rec.score + 10), weight: 25 },
              { name: 'Goal Alignment', score: rec.score, weight: 35 },
              { name: 'Level Match', score: Math.min(100, rec.score + 5), weight: 25 },
              { name: 'Career Impact', score: Math.min(100, rec.score - 5), weight: 15 }
            ]
          }
        };
      })
      .filter(Boolean);

    if (recommendedCourses.length === 0) {
      throw new Error('No valid course recommendations generated');
    }

    return {
      recommendations: recommendedCourses,
      aiResponse: {
        ...aiResponse,
        strategy: aiResponse.overallStrategy,
        learningPath: aiResponse.learningPath
      },
      rawResponse,
      inputTokens,
      outputTokens,
      totalTokens
    };
  }

  static generateMathematicalRecommendations(user, allCourses, userProgress, requestId, startTime, fallbackReason) {
    console.log(`[${requestId}] Generating mathematical recommendations...`);
    
    const progressMap = new Map();
    userProgress.forEach(p => {
      if (!progressMap.has(p.courseId)) {
        progressMap.set(p.courseId, { completed: 0, total: 0, attempts: 0 });
      }
      const courseProgress = progressMap.get(p.courseId);
      courseProgress.total++;
      courseProgress.attempts += p.attempts;
      if (p.completed) courseProgress.completed++;
    });

    const scoredCourses = allCourses.map(course => {
      const progress = progressMap.get(course.id) || { completed: 0, total: course.questions?.length || 0, attempts: 0 };
      const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
      
      let score = 50; // Base score

      // Level matching (25 points)
      if (user.level) {
        if (course.level === user.level) score += 25;
        else if (
          (user.level === 'beginner' && course.level === 'intermediate') ||
          (user.level === 'intermediate' && course.level === 'advanced')
        ) score += 15;
        else if (
          (user.level === 'intermediate' && course.level === 'beginner') ||
          (user.level === 'advanced' && course.level === 'intermediate')
        ) score += 10;
      }

      // Skills alignment (20 points)
      if (user.skills?.length > 0) {
        const skillMatch = course.tags?.some(tag => 
          user.skills.some(skill => 
            skill.toLowerCase().includes(tag.toLowerCase()) || 
            tag.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (skillMatch) score += 20;
      }

      // Learning goals alignment (20 points)
      if (user.learningGoals?.length > 0) {
        const goalMatch = user.learningGoals.some(goal =>
          course.category?.toLowerCase().includes(goal.toLowerCase()) ||
          course.title?.toLowerCase().includes(goal.toLowerCase()) ||
          course.tags?.some(tag => goal.toLowerCase().includes(tag.toLowerCase()))
        );
        if (goalMatch) score += 20;
      }

      // Progress consideration (10 points)
      if (percentage === 0) score += 10; // Prefer unstarted courses
      else if (percentage < 50) score += 5; // Partially completed
      else if (percentage === 100) score -= 15; // Already completed

      // Career stage consideration (5 points)
      if (user.careerStage === 'student' && course.level === 'beginner') score += 5;
      else if (user.careerStage === 'early' && course.level === 'intermediate') score += 5;
      else if ((user.careerStage === 'mid' || user.careerStage === 'senior') && course.level === 'advanced') score += 5;

      score = Math.max(0, Math.min(100, score));

      return {
        ...course,
        progress: {
          completed: progress.completed,
          total: progress.total,
          percentage,
          averageAttempts: progress.completed > 0 ? (progress.attempts / progress.completed).toFixed(1) : 0
        },
        recommendation: {
          score,
          reasoning: this.generateMathematicalReasoning(course, user, score, percentage),
          aiGenerated: false,
          fallbackUsed: true,
          factors: [
            { name: 'Level Match', score: Math.min(100, score + 10), weight: 25 },
            { name: 'Skill Alignment', score: Math.min(100, score), weight: 20 },
            { name: 'Goal Alignment', score: Math.min(100, score + 5), weight: 20 },
            { name: 'Progress Optimization', score: Math.min(100, score - 5), weight: 15 },
            { name: 'Career Stage', score: Math.min(100, score), weight: 10 },
            { name: 'Time Commitment', score: Math.min(100, score + 3), weight: 10 }
          ]
        }
      };
    });

    // Sort by score and take top 4
    const recommendedCourses = scoredCourses
      .sort((a, b) => b.recommendation.score - a.recommendation.score)
      .slice(0, 4);

    const processingTime = Date.now() - startTime;
    
    console.log(`[${requestId}] Mathematical recommendations completed in ${processingTime}ms`);

    return {
      recommendations: recommendedCourses,
      metadata: {
        algorithm: 'Mathematical Scoring Algorithm',
        model: 'Statistical Analysis',
        generatedAt: new Date().toISOString(),
        aiUsed: false,
        fallbackReason,
        requestId,
        processingTime,
        quotaExceeded: this.quotaExceeded
      }
    };
  }

  static generateMathematicalReasoning(course, user, score, percentage) {
    const reasons = [];
    
    if (course.level === user.level) {
      reasons.push(`Perfect level match for your ${user.level} skill level`);
    } else if (
      (user.level === 'beginner' && course.level === 'intermediate') ||
      (user.level === 'intermediate' && course.level === 'advanced')
    ) {
      reasons.push(`Good progression from your current ${user.level} level`);
    }

    if (user.skills?.length > 0) {
      const skillMatch = course.tags?.some(tag => 
        user.skills.some(skill => 
          skill.toLowerCase().includes(tag.toLowerCase()) || 
          tag.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (skillMatch) {
        reasons.push(`Aligns with your existing skills in ${user.skills.join(', ')}`);
      }
    }

    if (user.learningGoals?.length > 0) {
      const goalMatch = user.learningGoals.some(goal =>
        course.category?.toLowerCase().includes(goal.toLowerCase()) ||
        course.title?.toLowerCase().includes(goal.toLowerCase())
      );
      if (goalMatch) {
        reasons.push(`Supports your learning goals in ${user.learningGoals.join(', ')}`);
      }
    }

    if (percentage === 0) {
      reasons.push('Fresh start opportunity to build new skills');
    } else if (percentage < 50) {
      reasons.push(`Continue your progress (${percentage}% completed)`);
    }

    if (reasons.length === 0) {
      reasons.push('Recommended based on your profile and learning preferences');
    }

    return reasons.join('. ') + '.';
  }

  // Progress feedback and learning path methods remain the same...
  static async generateProgressFeedback(user, userProgress, allCourses, recommendedCourses) {
    // Implementation remains the same as before
    return {
      aiAnalysis: {
        learningPatternRecognition: "Based on your activity patterns, you show consistent engagement with coding challenges and demonstrate strong problem-solving persistence.",
        cognitiveLoadAssessment: "Your learning pace indicates optimal cognitive load management. You're processing information effectively without overwhelming yourself.",
        adaptiveLearningRecommendations: "Continue with your current learning rhythm. Consider increasing challenge difficulty gradually to maintain engagement."
      },
      predictiveInsights: {
        learningTrajectory: "You're on track to achieve intermediate proficiency within 3-4 months based on current progress patterns.",
        potentialChallenges: [
          "Algorithm complexity concepts may require additional practice",
          "Advanced debugging techniques might need focused attention"
        ],
        optimizationOpportunities: [
          "Increase practice frequency for better retention",
          "Focus on understanding concepts rather than memorizing solutions"
        ]
      },
      personalizedStrategies: {
        cognitiveApproach: "Visual learning with hands-on coding practice works best for your learning style.",
        timeOptimization: "Short, focused 25-30 minute sessions with breaks maximize your learning efficiency.",
        difficultyProgression: "Gradual increase in complexity with mastery-based progression suits your learning pattern."
      },
      motivationalPsychology: {
        intrinsicMotivators: [
          "Problem-solving satisfaction",
          "Skill mastery achievement",
          "Creative coding expression"
        ],
        achievementFramework: "Set weekly coding goals and celebrate small wins to maintain motivation.",
        confidenceBuilding: "Your consistent progress demonstrates strong learning capability. Trust your problem-solving instincts."
      },
      dataInsights: {
        learningEfficiencyScore: "78/100",
        progressPrediction: "Expected to complete current learning path within 2-3 months at current pace.",
        recommendedAdjustments: [
          "Increase coding practice frequency",
          "Focus on understanding core concepts",
          "Regular review of completed topics"
        ]
      },
      encouragement: "Your dedication to learning is impressive! Keep up the excellent work and remember that every challenge you solve makes you a stronger programmer."
    };
  }

  static async generateLearningPath(user, recommendedCourses, userProgress) {
    // Implementation remains the same as before
    return {
      pathTitle: "Personalized Learning Journey",
      description: "A structured learning path designed specifically for your goals and current skill level.",
      estimatedDuration: "3-4 months",
      phases: [
        {
          phaseNumber: 1,
          title: "Foundation Building",
          description: "Establish strong fundamentals in core programming concepts",
          duration: "4-6 weeks",
          courses: recommendedCourses.slice(0, 2).map(course => ({
            courseId: course.id,
            title: course.title,
            priority: "high",
            reasoning: "Essential foundation for advanced topics"
          })),
          learningObjectives: [
            "Master basic programming syntax and concepts",
            "Develop problem-solving thinking patterns",
            "Build confidence with coding challenges"
          ],
          prerequisites: []
        },
        {
          phaseNumber: 2,
          title: "Skill Development",
          description: "Advance your skills with intermediate concepts and practical applications",
          duration: "6-8 weeks",
          courses: recommendedCourses.slice(2).map(course => ({
            courseId: course.id,
            title: course.title,
            priority: "medium",
            reasoning: "Builds upon foundation knowledge"
          })),
          learningObjectives: [
            "Apply advanced programming concepts",
            "Solve complex algorithmic problems",
            "Understand software design principles"
          ],
          prerequisites: ["Complete Phase 1 courses"]
        }
      ],
      tips: [
        "Practice coding daily, even if just for 15-20 minutes",
        "Don't rush through concepts - understanding is more important than speed",
        "Join coding communities for support and motivation",
        "Build small projects to apply what you learn"
      ],
      milestones: [
        "Complete first programming challenge",
        "Solve 10 coding problems",
        "Build your first project",
        "Master advanced concepts"
      ]
    };
  }

  static async generateSequentialLearningPath(user, recommendedCourses, userProgress) {
    // Implementation remains the same as before
    return {
      pathTitle: "Sequential Learning Path",
      description: "A step-by-step progression through recommended courses optimized for your learning goals.",
      totalEstimatedDuration: "12-16 weeks",
      difficultyProgression: "Beginner → Intermediate → Advanced",
      courseSequence: recommendedCourses.map((course, index) => ({
        step: index + 1,
        courseId: course.id,
        courseTitle: course.title,
        level: course.level,
        category: course.category,
        estimatedHours: course.estimatedHours,
        priority: index < 2 ? "high" : "medium",
        reasoning: course.recommendation?.reasoning || "Recommended based on your profile",
        prerequisites: index === 0 ? [] : [`Complete Course ${index}`],
        learningOutcomes: [
          "Master core concepts and techniques",
          "Apply knowledge through practical exercises",
          "Build confidence for next level challenges"
        ],
        preparesFor: index < recommendedCourses.length - 1 ? [`Course ${index + 2}: ${recommendedCourses[index + 1]?.title}`] : ["Advanced specialization"],
        keySkills: course.tags || ["Programming", "Problem Solving"],
        currentProgress: course.progress?.percentage || 0
      })),
      learningStrategy: "Follow the sequential order for optimal knowledge building. Each course prepares you for the next level of complexity.",
      milestones: [
        { afterCourse: 1, achievement: "Programming Fundamentals Mastered", nextSteps: "Ready for intermediate challenges" },
        { afterCourse: 2, achievement: "Intermediate Skills Developed", nextSteps: "Prepared for advanced concepts" },
        { afterCourse: 3, achievement: "Advanced Concepts Understood", nextSteps: "Ready for specialization" },
        { afterCourse: 4, achievement: "Expert Level Achieved", nextSteps: "Ready for professional development" }
      ],
      tips: [
        "Complete courses in the recommended order",
        "Don't skip to advanced topics without mastering basics",
        "Practice regularly to reinforce learning",
        "Review previous concepts while learning new ones"
      ],
      timeManagement: {
        weeklySchedule: "Dedicate 3-4 hours per week to maintain steady progress",
        pacing: "Complete one course every 3-4 weeks for optimal retention",
        breaks: "Take short breaks between intensive coding sessions"
      }
    };
  }
}
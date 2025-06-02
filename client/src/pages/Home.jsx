import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 32px',
      position: 'relative',
      zIndex: 10,
    },
    navBrand: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logo: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '20px',
    },
    brandText: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #c084fc, #f472b6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    navButtons: {
      display: 'flex',
      gap: '24px',
    },
    signupBtn: {
      padding: '12px 32px',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      borderRadius: '50px',
      fontWeight: '600',
      textDecoration: 'none',
      color: 'white',
      display: 'inline-block',
      transition: 'transform 0.3s ease',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
      border: 'none',
      cursor: 'pointer',
    },
    loginBtn: {
      padding: '12px 32px',
      border: '2px solid rgba(255,255,255,0.2)',
      borderRadius: '50px',
      fontWeight: '600',
      textDecoration: 'none',
      color: 'white',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
    },
    hero: {
      padding: '64px 32px',
      textAlign: 'center',
    },
    heroContainer: {
      maxWidth: '1024px',
      margin: '0 auto',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 24px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '50px',
      border: '1px solid rgba(255,255,255,0.2)',
      marginBottom: '32px',
      fontSize: '14px',
      fontWeight: '500',
    },
    pulsingDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#4ade80',
      borderRadius: '50%',
      marginRight: '12px',
      animation: 'pulse 2s infinite',
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      marginBottom: '24px',
      lineHeight: '1.1',
    },
    heroSubtitle: {
      fontSize: '20px',
      color: '#d1d5db',
      marginBottom: '40px',
      maxWidth: '768px',
      margin: '0 auto 40px auto',
    },
    heroButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      justifyContent: 'center',
      marginBottom: '64px',
    },
    primaryBtn: {
      padding: '16px 40px',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
      boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
    },
    secondaryBtn: {
      padding: '16px 40px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    section: {
      padding: '64px 32px',
    },
    sectionContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #c084fc, #f472b6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
    },
    sectionSubtitle: {
      fontSize: '20px',
      color: '#9ca3af',
      maxWidth: '512px',
      margin: '0 auto 64px auto',
      textAlign: 'center',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
    },
    featureCard: {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.5s ease',
      cursor: 'pointer',
    },
    featureIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
      transition: 'transform 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: 'white',
    },
    featureDescription: {
      color: '#9ca3af',
      lineHeight: '1.6',
      marginBottom: '16px',
    },
    featureDetails: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    detailsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    detailsItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#d1d5db',
      marginBottom: '8px',
    },
    detailsDot: {
      width: '6px',
      height: '6px',
      backgroundColor: '#c084fc',
      borderRadius: '50%',
    },
    clickHint: {
      marginTop: '16px',
      color: '#c084fc',
      fontSize: '14px',
      fontWeight: '500',
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '32px',
    },
    stepItem: {
      textAlign: 'center',
    },
    stepNumber: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px auto',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    stepTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    stepDesc: {
      color: '#9ca3af',
    },
    sampleSection: {
      background: 'rgba(255,255,255,0.05)',
    },
    sampleContainer: {
      maxWidth: '1024px',
      margin: '0 auto',
    },
    pathPreview: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    pathHeader: {
      marginBottom: '24px',
    },
    pathTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    pathMeta: {
      color: '#9ca3af',
    },
    coursesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    courseItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    courseStatus: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
    },
    courseContent: {
      flex: 1,
    },
    courseHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    },
    courseName: {
      fontWeight: '500',
    },
    courseProgress: {
      fontSize: '14px',
      color: '#9ca3af',
    },
    progressBar: {
      width: '100%',
      backgroundColor: '#374151',
      borderRadius: '50px',
      height: '8px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: '50px',
      transition: 'width 0.5s ease',
    },
    cta: {
      padding: '80px 32px',
      textAlign: 'center',
    },
    ctaContainer: {
      maxWidth: '768px',
      margin: '0 auto',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '24px',
    },
    ctaDesc: {
      fontSize: '20px',
      color: '#d1d5db',
      marginBottom: '40px',
    },
    ctaBtn: {
      padding: '20px 48px',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      borderRadius: '50px',
      fontSize: '20px',
      fontWeight: '600',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
      boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
    },
  };

  const features = [
    {
      id: 'profile',
      title: 'Smart Profile Creation',
      description:
        'Tell us about your career stage, current skills, learning goals, and time availability',
      icon: (
        <svg
          style={{ width: '32px', height: '32px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      details: [
        'Career stage assessment',
        'Skills inventory',
        'Goal-oriented planning',
        'Time-based scheduling',
      ],
    },
    {
      id: 'learning',
      title: 'AI-Powered Learning Paths',
      description:
        'Get personalized course recommendations based on your profile and career objectives',
      icon: (
        <svg
          style={{ width: '32px', height: '32px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      details: [
        'Rule-based recommendations',
        'Beginner to advanced paths',
        'Industry-relevant courses',
        'PostgreSQL-powered content',
      ],
    },
    {
      id: 'progress',
      title: 'Progress Tracking',
      description:
        'Visual progress bars and completion tracking for all your courses and challenges',
      icon: (
        <svg
          style={{ width: '32px', height: '32px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
          />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      details: [
        'Completion percentages',
        'Visual progress bars',
        'Achievement tracking',
        'Performance analytics',
      ],
    },
    {
      id: 'coding',
      title: 'Interactive Coding Challenges',
      description:
        'Practice with live coding exercises using embedded CodePen and Replit environments',
      icon: (
        <svg
          style={{ width: '32px', height: '32px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
      details: [
        'Live coding exercises',
        'Instant validation',
        'Multiple languages',
        'Real-time feedback',
      ],
    },
    {
      id: 'ai-guidance',
      title: 'AI-Assisted Guidance',
      description:
        'Get personalized study tips and motivational messages powered by OpenAI',
      icon: (
        <svg
          style={{ width: '32px', height: '32px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
      details: [
        'Personalized tips',
        'Motivational messages',
        'Learning optimization',
        'Progress-based guidance',
      ],
    },
  ];

  const handleHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
    } else {
      e.target.style.transform = 'scale(1)';
      e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
    }
  };

  const handleIconHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = 'scale(1.1)';
    } else {
      e.target.style.transform = 'scale(1)';
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @media (min-width: 640px) {
            .hero-buttons {
              flex-direction: row !important;
            }
          }
          
          button:hover, a:hover {
            transform: scale(1.05);
          }
        `}
      </style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.logo}>T</div>
          <h2 style={styles.brandText}>TechRise</h2>
        </div>
        <div style={styles.navButtons}>
        <Link to="/signup" style={styles.signupBtn}>
          Sign Up
        </Link>
        <Link to="/login" style={styles.loginBtn}>
          Login
        </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <div style={styles.badge}>
            <span style={styles.pulsingDot}></span>
            <span>Personalized Learning Platform for Women in Tech</span>
          </div>

          <h1 style={styles.heroTitle}>
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff, #d1d5db)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Master Tech Skills with
            </span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #c084fc, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI-Powered Learning
            </span>
          </h1>

          <p style={styles.heroSubtitle}>
            Create your profile, get personalized learning paths, track
            progress, and practice with interactive coding challenges—all
            powered by AI guidance.
          </p>

          <div style={styles.heroButtons} className="hero-buttons">
            <button style={styles.primaryBtn}>Create Your Profile</button>
            <button style={styles.secondaryBtn}>View Sample Path</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <div>
            <h2 style={styles.sectionTitle}>Platform Features</h2>
            <p style={styles.sectionSubtitle}>
              Everything you need to accelerate your tech career in one
              comprehensive platform
            </p>
          </div>

          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={feature.id}
                style={styles.featureCard}
                onClick={() =>
                  setSelectedFeature(
                    selectedFeature === feature.id ? null : feature.id
                  )
                }
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
              >
                <div
                  style={{
                    ...styles.featureIcon,
                    background: feature.gradient,
                  }}
                  onMouseEnter={(e) => handleIconHover(e, true)}
                  onMouseLeave={(e) => handleIconHover(e, false)}
                >
                  {feature.icon}
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>

                {selectedFeature === feature.id && (
                  <div style={styles.featureDetails}>
                    <ul style={styles.detailsList}>
                      {feature.details.map((detail, idx) => (
                        <li key={idx} style={styles.detailsItem}>
                          <div style={styles.detailsDot}></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={styles.clickHint}>
                  Click to {selectedFeature === feature.id ? 'hide' : 'view'}{' '}
                  details
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...styles.section, ...styles.sampleSection }}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>How TechRise Works</h2>

          <div style={styles.stepsGrid}>
            {[
              {
                step: '01',
                title: 'Create Profile',
                desc: 'Share your career stage, skills, and goals',
              },
              {
                step: '02',
                title: 'Get Learning Path',
                desc: 'AI recommends personalized courses',
              },
              {
                step: '03',
                title: 'Practice Coding',
                desc: 'Complete interactive challenges',
              },
              {
                step: '04',
                title: 'Track Progress',
                desc: 'Monitor your advancement',
              },
            ].map((item, index) => (
              <div key={index} style={styles.stepItem}>
                <div style={styles.stepNumber}>{item.step}</div>
                <h3 style={styles.stepTitle}>{item.title}</h3>
                <p style={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Learning Path Preview */}
      <section style={{ ...styles.section, ...styles.sampleSection }}>
        <div style={styles.sampleContainer}>
          <h2
            style={{
              ...styles.sectionTitle,
              fontSize: '2rem',
              marginBottom: '48px',
            }}
          >
            Sample Learning Path
          </h2>

          <div style={styles.pathPreview}>
            <div style={styles.pathHeader}>
              <h3 style={styles.pathTitle}>Frontend Development Path</h3>
              <p style={styles.pathMeta}>
                For: Beginner • Duration: 12 weeks • 3-5 hours/week
              </p>
            </div>

            <div style={styles.coursesList}>
              {[
                {
                  title: 'HTML & CSS Fundamentals',
                  progress: 100,
                  status: 'completed',
                },
                {
                  title: 'JavaScript Basics',
                  progress: 75,
                  status: 'in-progress',
                },
                { title: 'React Introduction', progress: 0, status: 'locked' },
                {
                  title: 'Build Your First App',
                  progress: 0,
                  status: 'locked',
                },
              ].map((course, index) => (
                <div key={index} style={styles.courseItem}>
                  <div
                    style={{
                      ...styles.courseStatus,
                      backgroundColor:
                        course.status === 'completed'
                          ? '#10b981'
                          : course.status === 'in-progress'
                            ? '#3b82f6'
                            : '#6b7280',
                    }}
                  >
                    {course.status === 'completed'
                      ? '✓'
                      : course.status === 'in-progress'
                        ? '▶'
                        : '🔒'}
                  </div>
                  <div style={styles.courseContent}>
                    <div style={styles.courseHeader}>
                      <span style={styles.courseName}>{course.title}</span>
                      <span style={styles.courseProgress}>
                        {course.progress}%
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${course.progress}%`,
                          backgroundColor:
                            course.status === 'completed'
                              ? '#10b981'
                              : course.status === 'in-progress'
                                ? '#3b82f6'
                                : '#6b7280',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p style={styles.ctaDesc}>
            Join thousands of women advancing their tech careers with
            personalized, AI-powered learning.
          </p>
          <button style={styles.ctaBtn}>Get Started Free</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

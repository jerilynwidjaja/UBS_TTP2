import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://13.229.46.111:5000/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      alert('Signup successful! Redirecting to login...');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
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
    navLink: {
      padding: '8px 20px',
      color: '#c084fc',
      textDecoration: 'none',
      fontWeight: '600',
      borderRadius: '25px',
      transition: 'all 0.3s ease',
      border: '1px solid transparent',
    },
    navLinkActive: {
      background: 'rgba(192, 132, 252, 0.1)',
      border: '1px solid rgba(192, 132, 252, 0.3)',
    },
    main: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    },
    formContainer: {
      width: '100%',
      maxWidth: '440px',
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '48px',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    },
    formHeader: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    formTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '12px',
      background: 'linear-gradient(135deg, #ffffff, #c084fc)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    formSubtitle: {
      color: '#d1d5db',
      fontSize: '16px',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#e5e7eb',
      marginLeft: '4px',
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '12px',
      fontSize: '16px',
      color: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      boxSizing: 'border-box',
    },
    inputFocus: {
      border: '1px solid #8b5cf6',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
      background: 'rgba(255,255,255,0.08)',
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(139, 92, 246, 0.4)',
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      display: 'inline-block',
      marginRight: '8px',
    },
    errorMessage: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      padding: '12px 16px',
      color: '#fca5a5',
      fontSize: '14px',
      textAlign: 'center',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      margin: '32px 0',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(255,255,255,0.15)',
    },
    dividerText: {
      fontSize: '14px',
      color: '#9ca3af',
    },
    footer: {
      textAlign: 'center',
      marginTop: '32px',
    },
    footerText: {
      color: '#9ca3af',
      fontSize: '14px',
    },
    footerLink: {
      color: '#c084fc',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginTop: '24px',
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#d1d5db',
    },
    featureIcon: {
      width: '16px',
      height: '16px',
      color: '#10b981',
    },
  };

  const [focusedInput, setFocusedInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder {
            color: rgba(156, 163, 175, 0.8);
          }
          
          @media (max-width: 768px) {
            .form-container {
              padding: 32px 24px !important;
              margin: 20px !important;
            }
            .nav-buttons {
              gap: 12px !important;
            }
            .features-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.logo}>T</div>
          <h2 style={styles.brandText}>TechRise</h2>
        </div>
        <div style={styles.navButtons} className="nav-buttons">
          <Link to="/signup" style={styles.link}>
            Signup
          </Link>
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.formContainer} className="form-container">
          {/* Header */}
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Join TechRise</h1>
            <p style={styles.formSubtitle}>
              Start your personalized learning journey and accelerate your tech
              career
            </p>
          </div>

          {/* Features Preview */}
          <div style={styles.features} className="features-grid">
            <div style={styles.feature}>
              <svg
                style={styles.featureIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>AI-Powered Paths</span>
            </div>
            <div style={styles.feature}>
              <svg
                style={styles.featureIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Progress Tracking</span>
            </div>
            <div style={styles.feature}>
              <svg
                style={styles.featureIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Interactive Coding</span>
            </div>
            <div style={styles.feature}>
              <svg
                style={styles.featureIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Expert Guidance</span>
            </div>
          </div>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>Create your account</span>
            <div style={styles.dividerLine}></div>
          </div>

          {/* Error Message */}
          {error && <div style={styles.errorMessage}>{error}</div>}

          {/* Form */}
          <div onSubmit={handleSignup} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
                style={{
                  ...styles.input,
                  ...(focusedInput === 'email' ? styles.inputFocus : {}),
                }}
                required
                disabled={isLoading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
                style={{
                  ...styles.input,
                  ...(focusedInput === 'password' ? styles.inputFocus : {}),
                }}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              onClick={handleSignup}
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                ...styles.submitButton,
                ...(isHovered && !isLoading ? styles.submitButtonHover : {}),
                ...(isLoading ? styles.submitButtonDisabled : {}),
              }}
            >
              {isLoading && <div style={styles.loadingSpinner}></div>}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?
              <a href="/login" style={styles.footerLink}>
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;

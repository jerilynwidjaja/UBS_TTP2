export class ValidationService {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateRequired(fields) {
    const errors = [];
    
    for (const [fieldName, value] of Object.entries(fields)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push(`${fieldName} is required`);
      }
    }
    
    return errors;
  }

  static validateUserRegistration(userData) {
    const { email, password, firstName, lastName } = userData;
    const errors = [];

    const requiredErrors = this.validateRequired({
      email,
      password,
      firstName,
      lastName
    });
    errors.push(...requiredErrors);

    if (email && !this.validateEmail(email)) {
      errors.push('Invalid email format');
    }

    if (password && !this.validatePassword(password)) {
      errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    return errors;
  }

  static validateUserLogin(credentials) {
    const { email, password } = credentials;
    const errors = [];

    const requiredErrors = this.validateRequired({ email, password });
    errors.push(...requiredErrors);

    if (email && !this.validateEmail(email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }

  static validatePreferences(preferences) {
    const { careerStage, level, timeAvailability } = preferences;
    const errors = [];

    const requiredErrors = this.validateRequired({
      careerStage,
      level,
      timeAvailability
    });
    errors.push(...requiredErrors);

    const validCareerStages = ['student', 'early', 'mid', 'senior'];
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    const validTimeAvailability = ['1-3', '4-6', '7-10', '10+'];

    if (careerStage && !validCareerStages.includes(careerStage)) {
      errors.push('Invalid career stage');
    }

    if (level && !validLevels.includes(level)) {
      errors.push('Invalid level');
    }

    if (timeAvailability && !validTimeAvailability.includes(timeAvailability)) {
      errors.push('Invalid time availability');
    }

    return errors;
  }

  static validatePasswordChange(passwordData) {
    const { currentPassword, newPassword } = passwordData;
    const errors = [];

    const requiredErrors = this.validateRequired({
      currentPassword,
      newPassword
    });
    errors.push(...requiredErrors);

    if (newPassword && !this.validatePassword(newPassword)) {
      errors.push('New password must be at least 8 characters with uppercase, lowercase, and number');
    }

    return errors;
  }
}
export class ValidationService {
  static PASSWORD_REQUIREMENTS = [
    { text: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { text: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { text: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { text: 'Contains number', test: (pwd) => /\d/.test(pwd) },
    { text: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  static validateUserRegistration(data) {
    const errors = [];
    const { email, password, firstName, lastName } = data;

    // Email validation
    if (!email) {
      errors.push('Email is required');
    } else if (!this.validateEmail(email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (!password) {
      errors.push('Password is required');
    } else if (!this.validatePassword(password)) {
      errors.push('Password does not meet requirements');
    }

    // Name validation
    if (!firstName || firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    return errors;
  }

  static validateUserLogin(data) {
    const errors = [];
    const { email, password } = data;

    if (!email) {
      errors.push('Email is required');
    } else if (!this.validateEmail(email)) {
      errors.push('Invalid email format');
    }

    if (!password) {
      errors.push('Password is required');
    }

    return errors;
  }

  static validatePasswordChange(data) {
    const errors = [];
    const { currentPassword, newPassword } = data;

    if (!currentPassword) {
      errors.push('Current password is required');
    }

    if (!newPassword) {
      errors.push('New password is required');
    } else if (!this.validatePassword(newPassword)) {
      errors.push('New password does not meet requirements');
    }

    return errors;
  }

  static validatePreferences(data) {
    const errors = [];
    const { careerStage, skills, learningGoals, timeAvailability, level } = data;

    if (!careerStage) {
      errors.push('Career stage is required');
    }

    if (!level) {
      errors.push('Learning level is required');
    }

    if (!timeAvailability) {
      errors.push('Time availability is required');
    }

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      errors.push('At least one skill must be selected');
    }

    if (!learningGoals || !Array.isArray(learningGoals) || learningGoals.length === 0) {
      errors.push('At least one learning goal must be selected');
    }

    return errors;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return this.PASSWORD_REQUIREMENTS.every(req => req.test(password));
  }

  static getPasswordStrength(password) {
    const metRequirements = this.PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;
    return (metRequirements / this.PASSWORD_REQUIREMENTS.length) * 100;
  }

  static validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  static validateCodeSubmission(data) {
    const errors = [];
    const { code } = data;

    if (!code || typeof code !== 'string') {
      errors.push('Code is required');
    } else if (code.trim().length === 0) {
      errors.push('Code cannot be empty');
    } else if (code.length > 10000) {
      errors.push('Code is too long (max 10,000 characters)');
    }

    return errors;
  }

  static validateId(id) {
    const numId = parseInt(id);
    return !isNaN(numId) && numId > 0;
  }
}
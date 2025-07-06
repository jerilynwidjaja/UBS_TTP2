export class ValidationService {
  static PASSWORD_REQUIREMENTS = [
    { text: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { text: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { text: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { text: 'Contains number', test: (pwd) => /\d/.test(pwd) },
    { text: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

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
}
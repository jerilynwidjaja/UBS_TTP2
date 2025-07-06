export interface PasswordRequirement {
  text: string;
  test: (password: string) => boolean;
}

export class ValidationService {
  static readonly PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
    { text: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { text: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { text: 'Contains lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { text: 'Contains number', test: (pwd: string) => /\d/.test(pwd) },
    { text: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): boolean {
    return this.PASSWORD_REQUIREMENTS.every(req => req.test(password));
  }

  static getPasswordStrength(password: string): number {
    const metRequirements = this.PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;
    return (metRequirements / this.PASSWORD_REQUIREMENTS.length) * 100;
  }

  static validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ValidationService } from './validationService.js';

export class AuthService {
  static async registerUser(userData) {
    const { email, password, firstName, lastName } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Generate token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasPreferences: false
      }
    };
  }

  static async loginUser(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if user has preferences
    const hasPreferences = !!(user.careerStage && user.level && 
      user.skills?.length > 0 && user.learningGoals?.length > 0);

    // Generate token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        careerStage: user.careerStage,
        skills: user.skills,
        learningGoals: user.learningGoals,
        timeAvailability: user.timeAvailability,
        level: user.level,
        hasPreferences
      }
    };
  }

  static async changePassword(userId, passwordData) {
    const { currentPassword, newPassword } = passwordData;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await user.update({ password: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  static async updateUserPreferences(userId, preferences) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update(preferences);

    const hasPreferences = !!(preferences.careerStage && preferences.level && 
      preferences.skills?.length > 0 && preferences.learningGoals?.length > 0);

    return {
      message: 'Preferences updated successfully',
      user: {
        ...user.toJSON(),
        hasPreferences
      }
    };
  }

  static async getUserProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const hasPreferences = !!(user.careerStage && user.level && 
      user.skills?.length > 0 && user.learningGoals?.length > 0);

    return {
      ...user.toJSON(),
      hasPreferences
    };
  }

  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}
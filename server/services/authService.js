import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from './databaseService.js';

export class AuthService {
  static async registerUser(userData) {
    const { email, password, firstName, lastName } = userData;
    
    const existingUser = await DatabaseService.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await DatabaseService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  }

  static async loginUser(credentials) {
    const { email, password } = credentials;

    const user = await DatabaseService.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasPreferences: !!(user.careerStage && user.level)
      }
    };
  }

  static async getUserProfile(userId) {
    const user = await DatabaseService.findUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userProfile } = user.toJSON();
    return userProfile;
  }

  static async updateUserPreferences(userId, preferences) {
    const { careerStage, skills, learningGoals, timeAvailability, level } = preferences;
    
    const updated = await DatabaseService.updateUser(userId, {
      careerStage,
      skills,
      learningGoals,
      timeAvailability,
      level
    });

    if (!updated) {
      throw new Error('User not found');
    }

    return { message: 'Preferences updated successfully' };
  }

  static async changePassword(userId, passwordData) {
    const { currentPassword, newPassword } = passwordData;
    
    const user = await DatabaseService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await DatabaseService.updateUser(userId, { password: hashedNewPassword });

    return { message: 'Password changed successfully' };
  }

  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
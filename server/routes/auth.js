import express from 'express';
import { AuthService } from '../services/authService.js';
import { ValidationService } from '../services/validationService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const validationErrors = ValidationService.validateUserRegistration(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    const result = await AuthService.registerUser(req.body);
    
    res.status(201).json({
      message: 'User created successfully',
      ...result
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validationErrors = ValidationService.validateUserLogin(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    const result = await AuthService.loginUser(req.body);
    
    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const validationErrors = ValidationService.validatePasswordChange(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    const result = await AuthService.changePassword(req.userId, req.body);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Current password is incorrect') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/preferences', authenticateToken, async (req, res) => {
  try {
    const validationErrors = ValidationService.validatePreferences(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    const result = await AuthService.updateUserPreferences(req.userId, req.body);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await AuthService.getUserProfile(req.userId);
    res.json({ user });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
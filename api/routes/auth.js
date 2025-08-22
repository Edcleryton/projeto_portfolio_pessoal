const express = require('express');
const { UserModel } = require('../models/User');
const AuthMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'All fields are required',
        fields: ['name', 'email', 'password', 'confirmPassword']
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Passwords do not match'
      });
    }

    // Validate name
    if (!UserModel.validateName(name)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name must be between 2 and 50 characters'
      });
    }

    // Validate email
    if (!UserModel.validateEmail(email)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email format'
      });
    }

    // Validate password
    if (!UserModel.validatePassword(password)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
      });
    }

    // Check if user already exists
    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = UserModel.create({ name, email, password });
    const token = AuthMiddleware.generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Check if account is blocked
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Account is blocked due to multiple failed login attempts'
      });
    }

    // Validate password
    if (!user.validatePassword(password)) {
      user.incrementLoginAttempts();
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
        remainingAttempts: Math.max(0, 5 - user.loginAttempts)
      });
    }

    // Reset login attempts on successful login
    user.resetLoginAttempts();
    
    const token = AuthMiddleware.generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login'
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token removal)
 * @access Private
 */
router.post('/logout', AuthMiddleware.verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Logout successful'
  });
});

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', AuthMiddleware.verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Profile retrieved successfully',
    user: req.user.toJSON()
  });
});

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', AuthMiddleware.verifyToken, (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const updateData = {};

    if (name) {
      if (!UserModel.validateName(name)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Name must be between 2 and 50 characters'
        });
      }
      updateData.name = name;
    }

    if (email) {
      if (!UserModel.validateEmail(email)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid email format'
        });
      }

      // Check if email is already taken by another user
      const existingUser = UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Email is already taken'
        });
      }
      updateData.email = email;
    }

    const updatedUser = UserModel.update(userId, updateData);
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update profile'
    });
  }
});

/**
 * @route PUT /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.put('/change-password', AuthMiddleware.verifyToken, (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = req.user;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'New passwords do not match'
      });
    }

    // Validate current password
    if (!user.validatePassword(currentPassword)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    if (!UserModel.validatePassword(newPassword)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'New password must be at least 8 characters with uppercase, lowercase, and number'
      });
    }

    // Update password
    user.updatePassword(newPassword);

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to change password'
    });
  }
});

/**
 * @route POST /api/auth/toggle-theme
 * @desc Toggle user theme (light/dark)
 * @access Private
 */
router.post('/toggle-theme', AuthMiddleware.verifyToken, (req, res) => {
  try {
    const user = req.user;
    user.toggleTheme();

    res.status(200).json({
      message: 'Theme toggled successfully',
      theme: user.theme,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Theme toggle error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to toggle theme'
    });
  }
});

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh JWT token
 * @access Public
 */
router.post('/refresh-token', AuthMiddleware.refreshToken);

module.exports = router;
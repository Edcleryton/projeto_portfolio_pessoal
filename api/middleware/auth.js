const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/User');

// Secret key for JWT (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'gerir-me-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthMiddleware {
  static generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No token provided'
        });
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

      if (!token) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token format'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if user still exists
      const user = UserModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not found'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Account is blocked'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Token expired'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token'
        });
      }

      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Token verification failed'
      });
    }
  }

  static optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        req.user = null;
        return next();
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

      if (!token) {
        req.user = null;
        return next();
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = UserModel.findById(decoded.id);
      
      req.user = user && user.isActive ? user : null;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }

  static refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Refresh token is required'
        });
      }

      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const user = UserModel.findById(decoded.id);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid refresh token'
        });
      }

      const newToken = AuthMiddleware.generateToken(user);
      
      res.status(200).json({
        message: 'Token refreshed successfully',
        token: newToken,
        user: user.toJSON()
      });
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid refresh token'
      });
    }
  }
}

module.exports = AuthMiddleware;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = {
  // Middleware to verify JWT token
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  },

  // Middleware to check if user is admin
  isAdmin: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authMiddleware; 
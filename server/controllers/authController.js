const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  login: async (req, res) => {
    try {
      console.log('Login attempt:', { username: req.body.username });
      
      const { username, password } = req.body;
      
      // Find user by username
      const user = await User.findOne({ username });
      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('User not found:', username);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare passwords
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch ? 'Yes' : 'No');

      if (!isMatch) {
        console.log('Password mismatch for user:', username);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log('Login successful for user:', username);
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          isAdmin: user.isAdmin
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Create new admin user
  createAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Create new admin user
      const newAdmin = new User({
        username,
        password,
        isAdmin: true
      });

      await newAdmin.save();

      console.log('Admin user created successfully:', username);
      res.status(201).json({
        message: 'Admin user created successfully',
        user: {
          id: newAdmin._id,
          username: newAdmin.username,
          isAdmin: newAdmin.isAdmin
        }
      });
    } catch (err) {
      console.error('Create admin error:', err);
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      res.status(500).json({ message: 'Failed to create admin user', error: err.message });
    }
  }
};

module.exports = authController; 
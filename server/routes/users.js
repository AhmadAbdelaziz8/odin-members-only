const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { isAuthenticated, isAdmin, filterUserData } = require('../middleware/auth');

// Validation middleware
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty()
];

// Register new user
router.post('/register', validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    res.status(201).json(filterUserData(user, req.user));
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info);

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json(filterUserData(user, user));
    });
  })(req, res, next);
});

// Logout user
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Error logging out' });
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json(filterUserData(req.user, req.user));
});

// Update membership status (admin only)
router.patch('/membership/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { membershipStatus } = req.body;

    if (!['regular', 'member', 'admin'].includes(membershipStatus)) {
      return res.status(400).json({ message: 'Invalid membership status' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ membershipStatus });
    res.json(filterUserData(user, req.user));
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ message: 'Error updating membership status' });
  }
});

module.exports = router;
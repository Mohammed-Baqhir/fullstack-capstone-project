const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../models/db');

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, username: user.username || user.firstName },
    process.env.JWT_SECRET || 'giftlink_secret_key_change_this',
    { expiresIn: '2h' }
  );
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'giftlink_secret_key_change_this');
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      firstName,
      lastName,
      username: firstName,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    const result = await collection.insertOne(user);
    user._id = result.insertedId;

    const token = createToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        firstName,
        lastName,
        username: firstName,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || user.firstName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// GET /api/auth/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');
    const user = await collection.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username || user.firstName,
      email: user.email
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Unable to fetch profile' });
  }
});

// PUT /api/auth/update
router.put('/update', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');
    const { firstName, lastName, username } = req.body;

    const update = {};
    if (firstName) update.firstName = firstName;
    if (lastName) update.lastName = lastName;
    if (username) update.username = username;
    update.updatedAt = new Date();

    await collection.updateOne({ email: req.user.email }, { $set: update });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Unable to update profile' });
  }
});

module.exports = router;

// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { fullName, phone, username, password, role } = req.body;

  if (!fullName || !phone || !username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!['MANAGER', 'DRIVER'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO `User` (fullName, phone, username, passwordHash, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, phone, username, passwordHash, role]
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Phone or username already exists' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT userId, fullName, phone, username, passwordHash, role FROM `User` WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: user.userId,
      fullName: user.fullName,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        phone: user.phone,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../../sqlite/sqlite.js');

const SALT_ROUNDS = 10;

router.post('/', async (req, res) => {
  try {
    const { userName, Email, Password, Type, Path } = req.body;

    // Basic validation
    if (!userName || !Email || !Password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user with same username or email exists
    const userExistsQuery = `SELECT * FROM transport_users WHERE username = ? OR email = ? LIMIT 1`;
    db.get(userExistsQuery, [userName, Email], async (err, row) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        // User exists
        return res.status(409).json({ error: 'Username or Email already in use' });
      }

      // Hash password securely
      const hashedPassword = await bcrypt.hash(Password, SALT_ROUNDS);

      // Insert new user
      const insertUserQuery = `
        INSERT INTO transport_users (username, type, email, password, balance, path)
        VALUES (?, ?, ?, ?, 0, ?)
      `;

      db.run(insertUserQuery, [userName, Type, Email, hashedPassword, Path], function (err) {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // Successfully created user
        return res.status(201).json({ message: 'User created successfully', userId: this.lastID });
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

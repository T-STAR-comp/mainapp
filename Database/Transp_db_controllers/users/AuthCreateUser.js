const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

router.post('/', async (req, res) => {
  try {
    const { userName, Email, Password, Type, Path, admin_password } = req.body;

    if (!userName || !Email || !Password || !admin_password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = req.app.locals.db;

    // Check if user exists
    const [rows] = await db.execute(
      'SELECT * FROM transport_users WHERE username = ? OR email = ? LIMIT 1',
      [userName, Email]
    );

    if (rows.length > 0) {
      return res.status(409).json({ error: 'Username or Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, SALT_ROUNDS);
    const hashedadmin_password = await bcrypt.hash(admin_password, SALT_ROUNDS);

    // Insert new user
    const [result] = await db.execute(
      `INSERT INTO transport_users (username, type, email, password, balance, path, admin_password)
       VALUES (?, ?, ?, ?, 0, ?)`,
      [userName, Type, Email, hashedPassword, Path, hashedadmin_password]
    );

    return res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

/*
ALTER TABLE accounts
ADD COLUMN admin_password VARCHAR(255) NULL;
*/

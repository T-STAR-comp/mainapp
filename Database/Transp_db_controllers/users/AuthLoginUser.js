const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const { identifier, password } = req.body; // identifier can be username or email

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please provide username/email and password' });
  }

  // Query to find user by username OR email
  const findUserQuery = `
    SELECT * FROM transport_users WHERE username = ? OR email = ? LIMIT 1
  `;

  db.get(findUserQuery, [identifier, identifier], async (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(200).json({ error: 'Invalid username/email or password' });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(200).json({ error: 'Invalid username/email or password' });
      }

      // Successful login - here you can create and send JWT or session info if needed
      return res.status(200).json({ message: 'Login successful', userId: user.id, username: user.username, email: user.email });
    } catch (bcryptErr) {
      console.error('Bcrypt error:', bcryptErr);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

module.exports = router;

/*
{
  "identifier": "user@example.com",
  "password": "yourPassword123"
}
*/

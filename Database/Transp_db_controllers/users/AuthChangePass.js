const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../../../sqlite/sqlite.js');

// Change password route
router.put('/', async (req, res) => {
  const { userName, email, currentPassword, newPassword } = req.body;

  // Validate inputs
  if (!userName || !email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Get existing user
  const sql = `SELECT * FROM transport_users WHERE username = ? AND email = ?`;

  db.get(sql, [userName, email], async (err, user) => {
    if (err) {
      console.error('DB error:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (!user) {
      return res.status(200).json({ error: 'User not found.' });
    }

    // Compare current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(200).json({ error: 'Current password is incorrect.' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in DB
    const updateSql = `UPDATE transport_users SET password = ? WHERE username = ? AND email = ?`;

    db.run(updateSql, [hashedNewPassword, userName, email], function (err) {
      if (err) {
        console.error('DB update error:', err.message);
        return res.status(200).json({ error: 'Failed to update password.' });
      }

      res.status(200).json({ message: 'Password updated successfully.' });
    });
  });
});

module.exports = router;

/*
{
  "userName": "Machawi",
  "email": "machawi@example.com",
  "currentPassword": "oldpass123",
  "newPassword": "newSecurePass456"
}
*/
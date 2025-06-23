const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.put('/', async (req, res) => {
  const { userName, email, currentPassword, newPassword } = req.body;

  if (!userName || !email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = req.app.locals.db;

  try {
    // Fetch user
    const [rows] = await db.execute(
      'SELECT * FROM transport_users WHERE username = ? AND email = ?',
      [userName, email]
    );

    if (rows.length === 0) {
      return res.status(200).json({ error: 'User not found.' });
    }

    const user = rows[0];

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(200).json({ error: 'Current password is incorrect.' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.execute(
      'UPDATE transport_users SET password = ? WHERE username = ? AND email = ?',
      [hashedNewPassword, userName, email]
    );

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

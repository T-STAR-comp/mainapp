const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { identifier, password, loginType } = req.body; // username or email

  if (!identifier || !password || !loginType) {
    return res.status(400).json({ error: 'Please provide username/email, password & loginType' });
  }

  const db = req.app.locals.db;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM transport_users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(200).json({ error: 'Invalid username/email or password' });
    }

    const user = rows[0];

    let match = false;
    if (loginType === 'regular') {
      match = await bcrypt.compare(password, user.password);
    } else if (loginType === 'admin') {
      match = await bcrypt.compare(password, user.admin_password);
    }
    if (!match) {
      return res.status(200).json({ error: 'Invalid username/email or password' });
    }

    // Successful login — send user info or token here
    return res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      username: user.username,
      email: user.email,
      type: loginType === 'regular' ? false : true
    });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

// POST /toggle-status { email }
router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Get current status
    const [rows] = await db.execute(
      'SELECT status FROM transport_users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const currentStatus = rows[0].status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    // Update status
    await db.execute(
      'UPDATE transport_users SET status = ? WHERE email = ?',
      [newStatus, email]
    );

    res.status(200).json({ message: `User status changed to ${newStatus}.`, status: newStatus });
  } catch (err) {
    console.error('Error toggling user status:', err);
    res.status(500).json({ error: 'Failed to toggle user status.' });
  }
});

module.exports = router; 
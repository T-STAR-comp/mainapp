const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const db = req.app.locals.db; // Assumes MySQL connection is here
  const { UID } = req.body;

  if (!UID || typeof UID !== 'string') {
    return res.status(400).json({ error: 'UID is required and must be a string.' });
  }

  try {
    const [rows] = await db.execute('SELECT id, verified FROM ticket_sales WHERE UID_val = ?', [UID.trim()]);

    if (rows.length === 0) {
      return res.status(200).json({ message: 'No ticket found with this UID.' });
    }

    const ticket = rows[0];
    if (ticket.verified === 1) {
      return res.status(200).json({ message: 'Ticket is already verified.' });
    }

    await db.execute('UPDATE ticket_sales SET verified = 1 WHERE id = ?', [ticket.id]);

    return res.status(200).json({ message: 'Ticket successfully verified.' });
  } catch (err) {
    console.error('DB error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

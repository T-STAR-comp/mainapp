const express = require('express');
const router = express.Router();

router.put('/', async (req, res) => {
  const { id, state } = req.body;

  if (!id || !state || !['active', 'inactive'].includes(state)) {
    return res.status(400).json({ error: 'Invalid or missing route id/state.' });
  }

  const db = req.app.locals.db;

  try {
    // Check current state
    const [rows] = await db.execute(
      'SELECT state FROM transport_Routes WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    if (rows[0].state === state) {
      return res.status(200).json({ message: `Route is already "${state}". No changes made.` });
    }

    // Update state
    await db.execute(
      'UPDATE transport_Routes SET state = ? WHERE id = ?',
      [state, id]
    );

    return res.status(200).json({ message: `Route state updated to "${state}".` });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

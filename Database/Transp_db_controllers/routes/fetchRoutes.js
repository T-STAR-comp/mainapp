const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { provider } = req.body;

  if (!provider || typeof provider !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid provider username' });
  }

  const db = req.app.locals.db;

  try {
    // Fetch all routes for the provider (you can add active filtering if needed)
    const [rows] = await db.execute(
      'SELECT * FROM transport_Routes WHERE userName = ?',
      [provider.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active routes found for this provider' });
    }

    console.log(rows);
    return res.status(200).json({ routes: rows });
  } catch (err) {
    console.error('Database error while fetching routes:', err);
    return res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

module.exports = router;

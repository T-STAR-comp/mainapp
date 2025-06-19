const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite');

// POST route to get all *active* routes for a specific provider
router.post('/', (req, res) => {
  const { provider } = req.body;

  if (!provider || typeof provider !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid provider username' });
  }

  // Only fetch active routes
  const query = `SELECT * FROM transport_routes WHERE userName = ?`;

  db.all(query, [provider.trim()], (err, rows) => {
    if (err) {
      console.error('Database error while fetching routes:', err.message);
      return res.status(500).json({ error: 'Failed to fetch routes' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active routes found for this provider' });
    }
    console.log(rows)
    return res.status(200).json({ routes: rows });
  });
});

module.exports = router;

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to the SQLite database
const db = require('../../../sqlite/sqlite');

// GET route to fetch only username and type from transport_users
router.get('/', (req, res) => {
  const query = `
    SELECT username, type, path
    FROM transport_users
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch user data.' });
    }

    res.status(200).json({ users: rows });
  });
});

module.exports = router;

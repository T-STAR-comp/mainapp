const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite.js');

// PATCH to change route state
router.put('/', (req, res) => {
  const { id, state } = req.body;

  if (!id || !state || !['active', 'inactive'].includes(state)) {
    return res.status(400).json({ error: 'Invalid or missing route id/state.' });
  }

  // First, check current state
  const checkSql = `SELECT state FROM transport_Routes WHERE id = ?`;

  db.get(checkSql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    if (row.state === state) {
      return res.status(200).json({ message: `Route is already "${state}". No changes made.` });
    }

    // Update state only if different
    const updateSql = `UPDATE transport_Routes SET state = ? WHERE id = ?`;

    db.run(updateSql, [state, id], function (err) {
      if (err) {
        console.error('DB Error (update):', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
      }

      return res.status(200).json({ message: `Route state updated to "${state}".` });
    });
  });
});

module.exports = router;


/*
{
  "id": 3,
  "state": "inactive"
}
*/
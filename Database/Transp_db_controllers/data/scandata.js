const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite');

router.post('/', (req, res) => {
  const { UID } = req.body;

  if (!UID || typeof UID !== 'string') {
    return res.status(400).json({ error: 'UID is required and must be a string.' });
  }

  const checkQuery = `SELECT id, verified FROM ticket_sales WHERE UID_val = ?`;

  db.get(checkQuery, [UID.trim()], (err, row) => {
    if (err) {
      console.error('DB error during UID lookup:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (!row) {
      return res.status(200).json({ message: 'No ticket found with this UID.' });
    }

    if (row.verified === 1) {
      return res.status(200).json({ message: 'Ticket is already verified.' });
    }

    const updateQuery = `UPDATE ticket_sales SET verified = 1 WHERE id = ?`;

    db.run(updateQuery, [row.id], function (err) {
      if (err) {
        console.error('DB error during verification update:', err.message);
        return res.status(500).json({ error: 'Failed to update verification status.' });
      }

      return res.status(200).json({ message: 'Ticket successfully verified.' });
    });
  });
});

module.exports = router;

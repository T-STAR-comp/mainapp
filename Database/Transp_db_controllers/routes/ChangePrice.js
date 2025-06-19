const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite.js');

// PATCH to change route price
router.put('/', (req, res) => {
  const { id, userName, price } = req.body;

  // Basic validation
  if (!id || !userName || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Invalid or missing id, userName, or price.' });
  }

  // Check if route with the given id and userName exists
  const checkSql = `SELECT price FROM transport_Routes WHERE id = ? AND userName = ?`;

  db.get(checkSql, [id, userName], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Route not found for the given user.' });
    }

    if (row.price === price) {
      return res.status(200).json({ message: `Route already has price ${price}. No update needed.` });
    }

    // Update the price
    const updateSql = `UPDATE transport_Routes SET price = ? WHERE id = ? AND userName = ?`;

    db.run(updateSql, [price, id, userName], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update price.' });
      }

      return res.status(200).json({ message: `Price updated successfully to ${price}.` });
    });
  });
});

module.exports = router;

/*
{
  "id": 2,
  "userName": "Machawi",
  "price": 8500
}
*/
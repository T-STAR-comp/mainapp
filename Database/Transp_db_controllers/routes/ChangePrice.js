const express = require('express');
const router = express.Router();

router.put('/', async (req, res) => {
  const { id, userName, price } = req.body;

  if (!id || !userName || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Invalid or missing id, userName, or price.' });
  }

  const db = req.app.locals.db;

  try {
    // Check if route exists
    const [rows] = await db.execute(
      'SELECT price FROM transport_Routes WHERE id = ? AND userName = ?',
      [id, userName]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Route not found for the given user.' });
    }

    if (rows[0].price === price) {
      return res.status(200).json({ message: `Route already has price ${price}. No update needed.` });
    }

    // Update price
    await db.execute(
      'UPDATE transport_Routes SET price = ? WHERE id = ? AND userName = ?',
      [price, id, userName]
    );

    return res.status(200).json({ message: `Price updated successfully to ${price}.` });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Failed to update price.' });
  }
});

module.exports = router;

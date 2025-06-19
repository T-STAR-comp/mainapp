const express = require('express');
const router = express.Router();

// Connect to SQLite DB
const db = require('../../../sqlite/sqlite'); 

// Basic sanitization
const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9_.-]/g, '').trim();
};

router.post('/', (req, res) => {
  const { provider_username } = req.body;
  if (!provider_username || typeof provider_username !== 'string') {
    return res.status(200).json({ error: 'Missing or invalid provider_username.' });
  }

  const sanitizedUsername = sanitizeText(provider_username);

  const query = `
    SELECT customer_name, customer_email, route, departure, travel_date, total_price, tickets_bought, seat_number
    FROM ticket_sales
    WHERE provider_username = ?
    ORDER BY datetime(travel_date) ASC
  `;

  db.all(query, [sanitizedUsername], (err, rows) => {
    if (err) {
      return res.status(200).json({ error: 'Failed to fetch records.' });
    }

    if (rows.length === 0) {
      return res.status(200).json({ message: 'No records found for this provider.' });
    }
    console.log(rows)
    res.status(200).json({
      provider: sanitizedUsername,
      total_records: rows.length,
      records: rows,
    });
  });
});

module.exports = router;

/*
{
  "provider_username": "Machawi"
}
*/
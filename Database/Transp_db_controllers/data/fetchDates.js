const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite'); 

// Basic input sanitizer
const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9 ,.-]/g, '').trim();
};

router.post('/', (req, res) => {
  const { travel_date, provider_username } = req.body;

  // Basic validation
  if (!travel_date || !provider_username) {
    return res.status(200).json({ error: 'Missing travel_date or provider_username.' });
  }

  const cleanDate = sanitizeText(travel_date);
  const cleanUsername = sanitizeText(provider_username);

  const query = `
    SELECT * FROM ticket_sales
    WHERE travel_date = ? AND provider_username = ?
    ORDER BY seat_number ASC
  `;

  db.all(query, [cleanDate, cleanUsername], (err, rows) => {
    if (err) {
      return res.status(200).json({ error: 'Database error while fetching records.' });
    }
    console.log(rows)
    res.status(200).json({
      message: `Found ${rows.length} record(s) for ${cleanUsername} on ${cleanDate}.`,
      records: rows
    });
  });
});

module.exports = router;

/*
{
  "travel_date": "2025-06-14",
  "provider_username": "Machawi"
}
*/
const express = require('express');
const router = express.Router();

// Basic sanitization
const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  // Remove unwanted characters, but allow spaces
  const cleaned = input.replace(/[^a-zA-Z0-9_.\- ]/g, '').trim();
  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(cleaned)) {
    // Option 1: Reject input
    return ''; // or throw an error, or return a special value

  }
  return cleaned;
};

router.post('/', async (req, res) => {
  const { provider_username } = req.body;
  console.log(provider_username)
  if (!provider_username || typeof provider_username !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid provider_username.' });
  }

  const sanitizedUsername = sanitizeText(provider_username);

  const query = `
    SELECT customer_name, customer_email, route, departure, travel_date, total_price, tickets_bought, seat_number
    FROM ticket_sales
    WHERE provider_username = ?
    ORDER BY travel_date ASC
  `;

  try {
    const db = req.app.locals.db;
    const [rows] = await db.execute(query, [sanitizedUsername]);
    console.log(rows)
    if (rows.length === 0) {
      return res.status(200).json({ message: 'No records found for this provider.' });
    }

    console.log(rows);
    res.status(200).json({
      provider: sanitizedUsername,
      total_records: rows.length,
      records: rows,
    });
  } catch (err) {
    console.error('Error fetching records:', err.message);
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

module.exports = router;

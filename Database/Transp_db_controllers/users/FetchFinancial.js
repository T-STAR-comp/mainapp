const express = require('express');
const router = express.Router();

// Basic sanitization helper
const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9 ,.@-]/g, '').trim(); // allow @ for emails
};

router.post('/', async (req, res) => {
  const { provider_username } = req.body;

  if (!provider_username) {
    return res.status(400).json({ error: 'Missing provider_username.' });
  }

  const cleanUsername = sanitizeText(provider_username);
  const db = req.app.locals.db;

  try {
    // Step 1: Check if provider exists and get their balance
    const [userRows] = await db.execute(
      'SELECT balance FROM transport_users WHERE username = ?',
      [cleanUsername]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Provider not found.' });
    }

    const providerBalance = userRows[0].balance;

    // Step 2: Fetch all paid ticket sales
    const [salesRows] = await db.execute(
      `SELECT travel_date, total_price 
       FROM ticket_sales 
       WHERE provider_username = ? AND payment_state = 1`,
      [cleanUsername]
    );

    res.status(200).json({
      provider: cleanUsername,
      balance: providerBalance,
      paid_sales: salesRows.map(sale => ({
        travel_date: sale.travel_date,
        total_price: sale.total_price
      }))
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

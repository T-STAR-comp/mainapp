const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to SQLite
const db = require('../../../sqlite/sqlite');

// Sanitize input to avoid injection
const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9 ,.@-]/g, '').trim(); // allow @ for emails
};

// POST route to fetch financial details
router.post('/', (req, res) => {
  const { provider_username } = req.body;

  if (!provider_username) {
    return res.status(400).json({ error: 'Missing provider_username.' });
  }

  const cleanUsername = sanitizeText(provider_username);

  // Step 1: Check if provider exists and get their balance
  const userQuery = `SELECT balance FROM transport_users WHERE username = ?`;

  db.get(userQuery, [cleanUsername], (err, userRow) => {
    if (err) {
      console.error('Provider lookup error:', err.message);
      return res.status(500).json({ error: 'Database error while checking provider.' });
    }

    if (!userRow) {
      return res.status(404).json({ error: 'Provider not found.' });
    }

    const providerBalance = userRow.balance;

    // Step 2: Fetch all ticket sales where payment_state = 1
    const salesQuery = `
      SELECT travel_date, total_price 
      FROM ticket_sales 
      WHERE provider_username = ? AND payment_state = 1
    `;

    db.all(salesQuery, [cleanUsername], (err, rows) => {
      if (err) {
        console.error('Sales fetch error:', err.message);
        return res.status(500).json({ error: 'Error fetching ticket sales.' });
      }
      console.log(rows)

      res.status(200).json({
        provider: cleanUsername,
        balance: providerBalance,
        paid_sales: rows.map(sale => ({
          travel_date: sale.travel_date,
          total_price: sale.total_price
        }))
      });
    });
  });
});

module.exports = router;

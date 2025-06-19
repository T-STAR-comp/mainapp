const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite');
require('dotenv').config();

router.post('/', async (req, res) => {
  const fetch = (await import('node-fetch')).default;
  const secretKey = process.env.LIVE_SEC_KEY;

  const { trans_ID, UID } = req.body;

  if (!trans_ID || !UID) {
    return res.status(400).json({ error: "Missing trans_ID or UID" });
  }

  try {
    const resp = await fetch(`https://api.paychangu.com/verify-payment/${trans_ID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      }
    });

    const data = await resp.json();

    if (data?.status === 'success') {
      // Look for the ticket with the given UID
      const selectQuery = `SELECT customer_name, customer_email, provider_username, qrCodeDataURL, route, departure, travel_date, total_price, seat_number 
                           FROM ticket_sales 
                           WHERE UID_val = ?`;

      db.get(selectQuery, [UID], (err, row) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ error: "Database error" });
        }

        if (!row) {
          return res.status(404).json({ error: "No matching ticket found for UID" });
        }

        // Update payment_state to 1
        const updateQuery = `UPDATE ticket_sales SET payment_state = 1 WHERE UID_val = ?`;

        db.run(updateQuery, [UID], function (updateErr) {
          if (updateErr) {
            console.error("Failed to update payment state:", updateErr.message);
            return res.status(500).json({ error: "Failed to update payment status" });
          }

          // Return the selected row
          return res.status(200).json({
            message: "ok",
            ticket: row
          });
        });
      });

    } else {
      return res.status(200).json({ error: "Payment not verified" });
    }

  } catch (err) {
    return res.status(500).json({ error: "Error verifying payment" });
  }
});

module.exports = router;

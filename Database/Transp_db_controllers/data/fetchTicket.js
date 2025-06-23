const express = require('express');
const router = express.Router();
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

    if (data?.status === 'success' && data?.data?.amount) {
      const amountToAdd = parseFloat(data.data.amount);
      const db = req.app.locals.db;

      // Fetch ticket details by UID
      const [ticketRows] = await db.execute(
        `SELECT customer_name, customer_email, provider_username, qrCodeDataURL, route, departure, travel_date, total_price, seat_number, payment_state 
         FROM ticket_sales 
         WHERE UID_val = ?`,
        [UID]
      );

      const ticketRow = ticketRows[0];
      if (!ticketRow) {
        return res.status(404).json({ error: "No matching ticket found for UID" });
      }

      if (ticketRow.payment_state === 1) {
        return res.status(200).json({
          message: "Payment already verified.",
          ticket: ticketRow
        });
      }

      // Get current balance for provider
      const [balanceRows] = await db.execute(
        `SELECT balance FROM transport_users WHERE username = ?`,
        [ticketRow.provider_username]
      );
      if (!balanceRows[0]) {
        return res.status(500).json({ error: "Failed to lookup user balance" });
      }

      const currentBalance = parseFloat(balanceRows[0].balance) || 0;
      const newBalance = currentBalance + amountToAdd;

      // Update user balance
      await db.execute(
        `UPDATE transport_users SET balance = ? WHERE username = ?`,
        [newBalance, ticketRow.provider_username]
      );

      // Update payment state for ticket
      await db.execute(
        `UPDATE ticket_sales SET payment_state = 1 WHERE UID_val = ?`,
        [UID]
      );

      return res.status(200).json({
        message: "ok",
        ticket: ticketRow
      });
    } else {
      return res.status(200).json({ error: "Payment not verified" });
    }
  } catch (err) {
    console.error("Payment verification failed:", err.message);
    return res.status(500).json({ error: "Error verifying payment" });
  }
});

module.exports = router;

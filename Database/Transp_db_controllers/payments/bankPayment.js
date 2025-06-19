const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { amount, email } = req.body;

  // Basic validations
  if (!amount ||  !email) {
    return res.status(400).json({ error: 'Amount, and email are required.' });
  }

  // Validate email format
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  const url = 'https://api.paychangu.com/direct-charge/payments/initialize';
  //const secretKey = process.env.TEST_SECRET_KEY;
  const secretKey = process.env.LIVE_SEC_KEY;

  const charge_id = `PC-${uuidv4()}`; // Generate a unique charge ID

  const payload = {
    amount: amount.toString(),
    currency: "MWK",
    payment_method: 'mobile_bank_transfer',
    charge_id,
    email
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ status: 'success', data: result });
    } else {
      return res.status(400).json({ status: 'failed', error: result.message || 'Unknown error' });
    }
  } catch (error) {
    console.error('Direct charge error:', error.message);
    return res.status(500).json({ error: 'Internal server error during payment initialization.' });
  }
});

module.exports = router;

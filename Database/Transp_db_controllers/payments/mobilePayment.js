const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Allowed operators
const OPERATOR_IDS = {
  TNM: '27494cb5-ba9e-437f-a114-4e7a7686bcca',
  AIRTEL: '20be6c20-adeb-4b5b-a7ba-0769820df4fb',
};

// Utility to validate phone number format
const isValidPhoneNumber = (num) => /^(\+265|265)?\d{9}$/.test(num);

// Utility to validate email (simple RFC regex)
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST /api/secure-pay
router.post('/', async (req, res) => {
  const { mobileNum, operator, amount, email } = req.body;

  // Basic Validation
  if (!mobileNum || !operator || !amount || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidPhoneNumber(mobileNum)) {
    return res.status(400).json({ error: 'Invalid mobile number format' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  const operatorRef = OPERATOR_IDS[operator.toUpperCase()];
  if (!operatorRef) {
    return res.status(400).json({ error: 'Unsupported mobile operator' });
  }

  const secretKey = process.env.TEST_SECRET_KEY;
  //const secretKey = process.env.LIVE_SEC_KEY;
  const PAYCHANGU_URL = process.env.PAYCHANGU_URL || 'https://api.paychangu.com';
  if (!secretKey) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  const charge_id = `PC-${uuidv4()}`;

  const payload = {
    mobile_money_operator_ref_id: operatorRef,
    mobile: mobileNum.trim(),
    amount: parseFloat(amount),
    email: email.trim().toLowerCase(),
    charge_id,
  };

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secretKey}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(`https://api.paychangu.com/mobile-money/payments/initialize`, options);
    const result = await response.json();
    if (result.status === 'success') {
      return res.status(200).json({ message: 'ok', charge_id });
    } else {
      return res.status(502).json({ error: 'Payment processor failed to complete the request' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error during payout request' });
  }
});

module.exports = router;

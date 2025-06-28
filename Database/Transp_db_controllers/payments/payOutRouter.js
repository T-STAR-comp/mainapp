const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {initiatePayout} = require('./payout.js');
const {getPayoutDetails} = require('./payoutState.js');
const {sendWithdrawalEmail} = require('./email.js');

// POST /api/payout
router.post('/', async (req, res) => {
  const { provider_username, bank_name, bank_uuid, password, amount, accountNumber } = req.body;
  console.log(req.body);

  const amountNum = Number(amount);
  if (
    !provider_username ||
    !bank_name ||
    !accountNumber ||
    !bank_uuid ||
    !password ||
    isNaN(amountNum)
  ) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const db = req.app.locals.db;

  try {
    // 1. Find user by username
    const [rows] = await db.execute(
      'SELECT * FROM transport_users WHERE username = ? LIMIT 1',
      [provider_username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found.' });
    }
    const user = rows[0];

    // 2. Check password
    const match = await bcrypt.compare(password, user.admin_password);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    // 3. Check balance
    if (user.balance < amountNum) {
      return res.status(400).json({ error: 'Insufficient balance.' });
    }
    // Extra caution: Prevent negative balance after payout
    if ((user.balance - amountNum) < 0) {
      return res.status(400).json({ error: 'Payout would result in negative balance.' });
    }

    // 4. Log the email (for now, just return it)
    // You can add a payout log table here if needed
    // Example: await db.execute('INSERT INTO payout_logs ...')
    const response = await initiatePayout({
      bank_uuid,
      amount: amountNum,
      bank_account_name: bank_name,
      bank_account_number: accountNumber,
      email: user.email
    });

    if (response.status === 'success') {

        const payoutState = await getPayoutDetails(response.data.transaction.charge_id)

        if (payoutState.data.status === 'success') {
            //db change logic here
            const payoutAmount = Number(payoutState.data.amount);
            const newBalance = user.balance - payoutAmount;
            await db.execute(
                'UPDATE transport_users SET balance = ? WHERE username = ?',
                [newBalance, provider_username]
            )

            await sendWithdrawalEmail(user.email, provider_username, payoutState.data.amount);
            
            return res.status(200).json({
              status: 'ok',
              message: 'Payout request validated.',
              email: user.email,
              provider_username,
              bank_name,
              amount: amountNum
            });
        }
    }
  } catch (err) {
    console.error('Payout error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

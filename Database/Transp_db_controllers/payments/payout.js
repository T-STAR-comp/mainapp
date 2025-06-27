// paychanguService.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function initiatePayout({
  bank_uuid,
  amount,
  bank_account_name,
  bank_account_number,
  email
}) {
  const url = 'https://api.paychangu.com/direct-charge/payouts/initialize';
  const secretKey = process.env.LIVE_SEC_KEY;
  const chargeId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

  const payload = {
    payout_method: 'bank_transfer',
    bank_uuid,
    amount,
    charge_id: chargeId,
    bank_account_name,
    bank_account_number,
    email
  };

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${secretKey}` // Secure via .env
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = { initiatePayout };



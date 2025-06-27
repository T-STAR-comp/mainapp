const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

/**
 * Get payout details from PayChangu by ID
 * @param {string} payoutId - The ID of the payout
 * @returns {Promise<Object>} - Payout details
 */
async function getPayoutDetails(payoutId) {
  const url = `https://api.paychangu.com/direct-charge/payouts/${payoutId}/details`;
  const secretKey = process.env.LIVE_SEC_KEY;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${secretKey}` // Must be set in your .env file
    }
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch payout details');
    }

    console.log('✅ Payout Details:', data);
    return data;
  } catch (err) {
    console.error('❌ Error getting payout details:', err.message);
    throw err;
  }
}

module.exports = { getPayoutDetails };

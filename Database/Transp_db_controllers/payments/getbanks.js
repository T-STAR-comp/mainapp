const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

/**
 * Fetch supported banks from PayChangu (excluding Airtel and TNM)
 * @returns {Promise<Array>} - Filtered list of banks
 */
async function getSupportedBanks() {
  const url = 'https://api.paychangu.com/direct-charge/payouts/supported-banks?currency=MWK';
  const secretKey = process.env.LIVE_SEC_KEY;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${secretKey}`
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.status !== 'success' || !Array.isArray(result.data)) {
      throw new Error('Unexpected response structure');
    }

    // Filter out Airtel Money and TNM Mpamba
    const filteredBanks = result.data.filter(
      bank => !/airtel|tnm/i.test(bank.name)
    );

    return filteredBanks;
  } catch (error) {
    console.error('❌ Failed to fetch banks:', error.message);
    throw error;
  }
}

module.exports = { getSupportedBanks };

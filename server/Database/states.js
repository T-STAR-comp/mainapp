const express = require('express');
const router = express.Router();

// GET Route to Fetch Landing Page Status
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;

    // MySQL query to get the landing page status
    const [rows] = await db.execute('SELECT * FROM landingpage_status');

    if (rows && rows.length > 0) {
      // Send '1' if first record's state is 1
      if (rows[0].landingstate === 1) {
        return res.status(200).send('1');
      }
    }

    // Default fallback response
    return res.status(200).send('0');

  } catch (err) {
    console.error('❌ Error fetching landing state:', err.message);
    return res.status(500).send({ message: `Error occurred: ${err.message}` });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const sql = 'SELECT * FROM customer_records WHERE email = ?';

  try {
    const [rows] = await db.execute(sql, [Email]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'No record found for this email' });
    }
  } catch (err) {
    console.error('❌ Error fetching customer record:', err);
    res.status(500).json({ message: 'Database Error Occurred' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.locals.db; // MySQL connection

  const sql = 'SELECT * FROM customer_records';

  try {
    const [rows] = await db.execute(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No records found', state: 'none' });
    }
  } catch (err) {
    console.error('❌ Error fetching customer records:', err);
    res.status(500).json({ message: 'Database Error Occurred' });
  }
});

module.exports = router;

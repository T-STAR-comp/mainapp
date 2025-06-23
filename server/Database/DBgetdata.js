const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  const sql = 'SELECT * FROM eventdetails';

  try {
    const [rows] = await db.execute(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No event details found', state: 'none' });
    }
  } catch (err) {
    console.error('❌ Error fetching event details:', err.message);
    res.status(500).json({ message: 'Database Error Occurred' });
  }
});

module.exports = router;

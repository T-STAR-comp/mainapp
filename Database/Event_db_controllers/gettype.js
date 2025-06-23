const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { EventName } = req.body;
  const sql = `SELECT * FROM Ticket_type WHERE event_name = ?`;
  const params = [EventName];

  try {
    const db = req.app.locals.db;
    const [rows] = await db.execute(sql, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Query error:', err.message);
    res.status(500).send({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

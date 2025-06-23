const express = require('express');
const router = express.Router();

// Assume you have a function to get the MySQL db connection from the request
// For example: req.app.locals.db
router.post('/', async (req, res) => {
  const { EventName, type, uid, price } = req.body;

  const sql = `
    INSERT INTO Ticket_type (
      event_name,
      type,
      uid,
      price
    ) VALUES (?, ?, ?, ?)
  `;

  try {
    const db = req.app.locals.db; // get mysql connection from express app.locals

    const [result] = await db.execute(sql, [EventName, type, uid, price]);

    // result contains info about affectedRows, insertId, etc.
    res.status(200).send({ message: 'ok', insertId: result.insertId });
  } catch (err) {
    console.error('❌ Insert error:', err.message);
    res.status(500).send({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { tx_ref } = req.body;

  const sql = `SELECT * FROM Ticket_type WHERE tx_ref = ?`;
  const params = [tx_ref];

  try {
    const db = req.app.locals.db; // get MySQL connection
    const [rows] = await db.execute(sql, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Query error:', err.message);
    res.status(500).send({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

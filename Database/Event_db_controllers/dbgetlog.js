const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const { tx_ref } = req.body;

  const sql = `SELECT * FROM Ticket_type WHERE tx_ref = ?`;
  const params = [tx_ref];

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('❌ Query error:', err.message);
      res.status(500).send({ message: `An error occurred: ${err.message}` });
    } else {
      res.status(200).json(rows );
    }
  });
});

module.exports = router;

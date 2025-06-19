const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const {EventName, type, uid, price} = req.body;

  const sql = `
    INSERT INTO Ticket_type (
    event_name,
    type,
    uid,
    price
) VALUES (
    ?, ?, ?
)`;

  const params = [EventName, type, uid, price];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('❌ Insert error:', err.message);
      res.status(500).send({ message: `An error occurred: ${err.message}` });
    } else {
      res.status(200).send({ message: 'ok' });
    }
  });
});

module.exports = router;
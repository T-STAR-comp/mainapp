const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const {
    email,
    first_name,
    last_name,
    amount,
    ticket_UID,
    total_tickets
  } = req.body;

  const sql = `
    INSERT INTO customer_records 
    (email, first_name, surname, num_tickets, total, ticket_UID) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [
    email,
    first_name,
    last_name,
    total_tickets,
    amount-(amount*1/100),
    ticket_UID
  ];

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

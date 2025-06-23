const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
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

  // Calculate total after 1% deduction
  const totalAfterFee = amount - (amount * 1 / 100);

  const params = [
    email,
    first_name,
    last_name,
    total_tickets,
    totalAfterFee,
    ticket_UID
  ];

  try {
    const db = req.app.locals.db; // MySQL connection
    const [result] = await db.execute(sql, params);
    res.status(200).send({ message: 'ok', insertId: result.insertId });
  } catch (err) {
    console.error('❌ Insert error:', err.message);
    res.status(500).send({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

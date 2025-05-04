const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const {
    tx_ref,
    qrCodeDataURL,
    uniqueIdentifier,
    EventName,
    TicketHolder,
    EventTime,
    TicketType,
    EventDate,
    Venue
  } = req.body;

  const sql = `
    INSERT INTO log_table (
    tx_ref,
    url,
    baseIdentifier,
    EventName,
    TicketHolder,
    EventTime,
    TicketType,
    EventDate,
    Venue
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?
)`;

  const params = [
    tx_ref,
    qrCodeDataURL,
    uniqueIdentifier,
    EventName,
    TicketHolder,
    EventTime,
    TicketType,
    EventDate,
    Venue
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
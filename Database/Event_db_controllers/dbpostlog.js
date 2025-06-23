const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

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

  try {
    const db = req.app.locals.db;
    await db.execute(sql, params);
    res.status(200).send({ message: 'ok' });
  } catch (err) {
    console.error('❌ Insert error:', err.message);
    res.status(500).send({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

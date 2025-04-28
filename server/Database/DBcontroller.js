const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const status = 0;

  const {
    eventName,
    imageUrl,
    venue,
    location,
    firstDate,
    secondDate,
    time,
    standardPrice,
    vipPrice,
    QRcodeURL,
    standardBaseId,
    vipBaseId,
    eventUrl,
    eventDescription,
  } = req.body;

  const sql = `
    INSERT INTO eventdetails (
      EventName, ImageURL, Venue, Location, FirstDate, SecondDate, Time,
      StandardPrice, VipPrice, QRcodeURL, StandardBaseID, VipBaseID,
      EventURL, EventDesc, Status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    eventName, imageUrl, venue, location, firstDate, secondDate, time,
    standardPrice, vipPrice, QRcodeURL, standardBaseId, vipBaseId,
    eventUrl, eventDescription, status
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('❌ Insert error:', err.message);
      res.status(500).send({ message: `An error occurred: ${err.message}` });
    } else {
      res.status(200).send({ message: 'Event was successfully created', eventId: this.lastID });
    }
  });
});

module.exports = router;

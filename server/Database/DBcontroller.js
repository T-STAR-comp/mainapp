const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const db = req.app.locals.db;

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

  try {
    const [result] = await db.execute(sql, params);
    res.status(200).json({ message: 'Event was successfully created', eventId: result.insertId });
  } catch (err) {
    console.error('❌ Insert error:', err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

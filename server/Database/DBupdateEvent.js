const express = require('express');
const router = express.Router();

router.put('/', async (req, res) => {
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
    eventDescription,
  } = req.body;

  if (!eventName) {
    return res.status(400).send({ message: 'Missing event name' });
  }

  try {
    const db = req.app.locals.db; // Get MySQL connection

    const sql = `
      UPDATE eventdetails 
      SET 
        ImageURL = ?, 
        Venue = ?, 
        Location = ?, 
        FirstDate = ?, 
        SecondDate = ?, 
        Time = ?, 
        StandardPrice = ?, 
        VipPrice = ?, 
        EventDesc = ?
      WHERE EventName = ?`;

    const [result] = await db.execute(sql, [
      imageUrl,
      venue,
      location,
      firstDate,
      secondDate,
      time,
      standardPrice,
      vipPrice,
      eventDescription,
      eventName
    ]);

    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Event details successfully updated', status: 'ok' });
    } else {
      res.status(200).send({ message: 'No event found with the provided name or no changes made' });
    }
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).send({ message: `Error occurred: ${err.message}` });
  }
});

module.exports = router;

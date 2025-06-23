const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { EventName, NewEventName, NewType, NewPrice } = req.body;

  try {
    const db = req.app.locals.db;

    // Check if event exists
    const [rows] = await db.execute(
      `SELECT * FROM Ticket_type WHERE event_name = ?`,
      [EventName]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: `Event '${EventName}' not found.` });
    }

    // Update the event
    const [updateResult] = await db.execute(
      `UPDATE Ticket_type SET event_name = ?, type = ?, price = ? WHERE event_name = ?`,
      [NewEventName, NewType, NewPrice, EventName]
    );

    res.status(200).send({
      message: `Event '${EventName}' updated successfully.`,
      updated: {
        event_name: NewEventName,
        type: NewType,
        price: NewPrice
      }
    });
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).send({ message: `Update failed: ${err.message}` });
  }
});

module.exports = router;

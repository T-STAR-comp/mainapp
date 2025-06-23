 const express = require('express');
const router = express.Router();

router.delete('/', async (req, res) => {
  const { EventName } = req.body;

  if (!EventName) {
    return res.status(400).send({ message: "EventName is required" });
  }

  try {
    const db = req.app.locals.db;

    // Check if event exists
    const [rows] = await db.execute(`SELECT * FROM Ticket_type WHERE event_name = ?`, [EventName]);

    if (rows.length === 0) {
      return res.status(404).send({ message: `Event '${EventName}' not found.` });
    }

    // Delete the event
    const [deleteResult] = await db.execute(`DELETE FROM Ticket_type WHERE event_name = ?`, [EventName]);

    res.status(200).send({
      message: `Event '${EventName}' deleted successfully.`
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).send({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const { EventName, NewEventName, NewType, NewPrice } = req.body;

  const selectSql = `SELECT * FROM Ticket_type WHERE event_name = ?`;
  const selectParams = [EventName];

  db.get(selectSql, selectParams, (err, row) => {
    if (err) {
      console.error('❌ Query error:', err.message);
      return res.status(500).send({ message: `An error occurred: ${err.message}` });
    }

    if (!row) {
      // If no matching event found
      return res.status(404).send({ message: `Event '${EventName}' not found.` });
    }

    // Event exists — proceed to update
    const updateSql = `UPDATE Ticket_type SET event_name = ?, type = ?, price = ? WHERE event_name = ?`;
    const updateParams = [NewEventName, NewType, NewPrice, EventName];

    db.run(updateSql, updateParams, function (updateErr) {
      if (updateErr) {
        console.error('❌ Update error:', updateErr.message);
        return res.status(500).send({ message: `Update failed: ${updateErr.message}` });
      }

      res.status(200).send({
        message: `Event '${EventName}' updated successfully.`,
        updated: {
          event_name: NewEventName,
          type: NewType,
          price: NewPrice
        }
      });
    });
  });
});

module.exports = router;

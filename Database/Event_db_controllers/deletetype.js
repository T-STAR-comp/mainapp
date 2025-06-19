const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.delete('/', (req, res) => {
  const { EventName } = req.body;

  if (!EventName) {
    return res.status(400).send({ message: "EventName is required" });
  }

  const selectSql = `SELECT * FROM Ticket_type WHERE event_name = ?`;
  db.get(selectSql, [EventName], (err, row) => {
    if (err) {
      console.error('❌ Query error:', err.message);
      return res.status(500).send({ message: `An error occurred: ${err.message}` });
    }

    if (!row) {
      return res.status(404).send({ message: `Event '${EventName}' not found.` });
    }

    const deleteSql = `DELETE FROM Ticket_type WHERE event_name = ?`;
    db.run(deleteSql, [EventName], function (deleteErr) {
      if (deleteErr) {
        console.error('❌ Delete error:', deleteErr.message);
        return res.status(500).send({ message: `Delete failed: ${deleteErr.message}` });
      }

      res.status(200).send({
        message: `Event '${EventName}' deleted successfully.`
      });
    });
  });
});

module.exports = router;

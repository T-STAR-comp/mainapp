const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.delete('/', (req, res) => {
  const { info } = req.body;

  const sql = 'DELETE FROM eventdetails WHERE EventName = ?';

  db.run(sql, [info], function (err) {
    if (err) {
      console.error('❌ Delete error:', err.message);
      return res.status(500).send({ message: `An error occurred: ${err.message}` });
    }

    if (this.changes > 0) {
      res.status(200).send({ message: 'Event successfully deleted', status: 'ok' });
    } else {
      res.status(404).send({ message: 'No event found with that name', status: 'not found' });
    }
  });
});

module.exports = router;

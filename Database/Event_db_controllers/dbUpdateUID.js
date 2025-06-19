const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const { UidValue } = req.body;

  const sql = 'INSERT INTO ticket_uid (UID) VALUES (?)';

  db.run(sql, [UidValue], function (err) {
    if (err) {
      res.status(500).send({ message: 'Database error: ' + err.message });
    } else {
      res.status(200).send({ message: 'success' });
    }
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM eventdetails';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.send({ message: `An error: ${err.message} occurred.` });
    } else {
      res.status(200).json(rows);
    }
  });
});

module.exports = router;

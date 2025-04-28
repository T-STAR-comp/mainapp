const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM landingpage_status';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.send({ message: `An error: ${err.message} occurred.` });
    } else {
      if (rows.length > 0) {
        if (rows[0].landingstate === 1) {
          res.status(200).json(1);
        } 
      }
      if(rows.length < 1) {
        res.status(200).json(0);
      }
    }
  });
});

module.exports = router;

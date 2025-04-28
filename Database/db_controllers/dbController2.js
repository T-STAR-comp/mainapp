const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  console.log(req.body);

  const sql = '/* your SQL query here */';
  const params = []; // add your parameters here

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Database error', error: err.message });
    } else {
      res.status(200).send({ message: 'Success', changes: this.changes });
    }
  });
});

module.exports = router;

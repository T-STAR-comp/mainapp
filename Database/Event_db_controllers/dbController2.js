const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body);

  const sql = '/* your SQL query here */';
  const params = []; // add your parameters here

  try {
    const db = req.app.locals.db; // get MySQL connection

    const [result] = await db.execute(sql, params);

    // result.affectedRows or result.changedRows can be used for changes count
    res.status(200).send({ message: 'Success', affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Database error', error: err.message });
  }
});

module.exports = router;

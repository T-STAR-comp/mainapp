const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM eventdetails';

  try {
    const db = req.app.locals.db; // get MySQL connection
    const [rows] = await db.execute(sql);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send({ message: `An error: ${err.message} occurred.` });
  }
});

module.exports = router;

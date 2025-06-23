const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { UidValue } = req.body;
  const sql = 'INSERT INTO ticket_uid (UID) VALUES (?)';

  try {
    const db = req.app.locals.db;
    await db.execute(sql, [UidValue]);
    res.status(200).send({ message: 'success' });
  } catch (err) {
    res.status(500).send({ message: 'Database error: ' + err.message });
  }
});

module.exports = router;

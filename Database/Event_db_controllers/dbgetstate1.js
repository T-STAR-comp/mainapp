const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM landingpage_status';

  try {
    const db = req.app.locals.db;
    const [rows] = await db.execute(sql);

    if (rows.length > 0) {
      if (rows[0].landingstate === 1) {
        return res.status(200).json(1);
      }
      // If landingstate is not 1, return 0 (or whatever you want)
      return res.status(200).json(0);
    }

    // If no rows
    res.status(200).json(0);
  } catch (err) {
    res.status(500).send({ message: `An error: ${err.message} occurred.` });
  }
});

module.exports = router;

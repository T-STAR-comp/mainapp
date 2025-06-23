const express = require('express');
const router = express.Router();

router.delete('/', async (req, res) => {
  const db = req.app.locals.db;
  const { info } = req.body;

  const sql = 'DELETE FROM eventdetails WHERE EventName = ?';

  try {
    const [result] = await db.execute(sql, [info]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Event successfully deleted', status: 'ok' });
    } else {
      return res.status(404).json({ message: 'No event found with that name', status: 'not found' });
    }
  } catch (err) {
    console.error('❌ Delete error:', err);
    return res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
});

module.exports = router;

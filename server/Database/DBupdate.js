const express = require('express');
const router = express.Router();

router.put('/', async (req, res) => {
  const { V, E } = req.body;

  if (!V || !E) {
    return res.status(400).send({ message: 'Missing V (status) or E (event name)' });
  }

  try {
    const db = req.app.locals.db;

    // Execute the SQL update
    const [result] = await db.execute(
      'UPDATE eventdetails SET Status = ? WHERE EventName = ?',
      [V, E]
    );

    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Status Successfully updated', status: 'ok' });
    } else {
      res.status(200).send({ message: 'No matching event found or status unchanged' });
    }
  } catch (err) {
    console.error('❌ Error updating event status:', err.message);
    res.status(500).send({ message: `Error occurred: ${err.message}` });
  }
});

module.exports = router;

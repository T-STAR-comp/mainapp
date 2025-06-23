const express = require('express');
const router = express.Router();
const CleanUp = require('./DBdeleteUID.js'); // Still works if CleanUp is updated for MySQL too

router.post('/', async (req, res) => {
  const { uniqueData } = req.body;

  if (uniqueData !== '') {
    try {
      const db = req.app.locals.db;

      // Check if UID exists
      const [rows] = await db.execute('SELECT * FROM ticket_uid WHERE UID = ?', [uniqueData]);

      if (rows.length > 0) {
        // UID exists – try to delete
        const cleanup = await CleanUp.DeleteUID(uniqueData);
        if (cleanup === 1) {
          return res.status(200).send({ message: 'VALID' });
        } else {
          return res.status(400).send({ message: 'OFFLOADING UID ERROR, Please Try Again!' });
        }
      } else {
        return res.status(200).send({ message: 'INVALID' });
      }

    } catch (err) {
      console.error('❌ Error verifying UID:', err);
      return res.status(500).send({ message: 'ERROR' });
    }
  } else {
    return res.status(200).send({ message: 'NULL VAL' });
  }
});

module.exports = router;

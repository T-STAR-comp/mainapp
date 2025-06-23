const express = require('express');
const router = express.Router();

// POST Route to Insert Maintenance State
router.post('/', async (req, res) => {
  const { state } = req.body;

  if (!state) {
    return res.status(400).send({ message: 'Missing maintenance state value' });
  }

  try {
    const db = req.app.locals.db;

    const sql = 'INSERT INTO maintainancepage_status (maintainancestate) VALUES (?)';
    const [result] = await db.execute(sql, [state]);

    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Maintenance state successfully added', status: 'ok' });
    } else {
      res.status(500).send({ message: 'Insert failed', status: 'failed' });
    }
  } catch (err) {
    console.error('❌ Insert error:', err.message);
    res.status(500).send({ message: `Error occurred: ${err.message}` });
  }
});

// DELETE Route to Remove Maintenance State
router.delete('/', async (req, res) => {
  const { state } = req.body;

  if (!state) {
    return res.status(400).send({ message: 'Missing maintenance state value' });
  }

  try {
    const db = req.app.locals.db;

    const sql = 'DELETE FROM maintainancepage_status WHERE maintainancestate = ?';
    const [result] = await db.execute(sql, [state]);

    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Maintenance state successfully deleted', status: 'ok' });
    } else {
      res.status(200).send({ message: 'No matching maintenance state found to delete' });
    }
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).send({ message: `Error occurred: ${err.message}` });
  }
});

module.exports = router;

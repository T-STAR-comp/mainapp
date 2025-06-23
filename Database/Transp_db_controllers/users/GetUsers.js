const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.locals.db;

  try {
    const [rows] = await db.execute(`
      SELECT username, type, path
      FROM transport_users
    `);

    res.status(200).json({ users: rows });
  } catch (err) {
    console.error('Database query error:', err);
    return res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

module.exports = router;

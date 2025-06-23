const express = require('express');
const router = express.Router();

router.delete('/', async (req, res) => {
  const { id, userName } = req.body;

  if (!id || !userName) {
    return res.status(400).json({ error: 'Missing route id or userName.' });
  }

  const db = req.app.locals.db;

  try {
    // Check if the route exists for the user
    const [rows] = await db.execute(
      'SELECT * FROM transport_Routes WHERE id = ? AND userName = ?',
      [id, userName]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Route not found or does not belong to user.' });
    }

    // Delete the route
    await db.execute(
      'DELETE FROM transport_Routes WHERE id = ? AND userName = ?',
      [id, userName]
    );

    return res.status(200).json({ message: `Route with ID ${id} deleted successfully.` });
  } catch (err) {
    console.error('DB Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

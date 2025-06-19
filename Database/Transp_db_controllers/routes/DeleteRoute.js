const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite.js');

// DELETE route with userName validation
router.delete('/', (req, res) => {
  const { id, userName } = req.body;

  if (!id || !userName) {
    return res.status(400).json({ error: 'Missing route id or userName.' });
  }

  // First check if the route exists for the user
  const checkSql = `SELECT * FROM transport_Routes WHERE id = ? AND userName = ?`;

  db.get(checkSql, [id, userName], (err, row) => {
    if (err) {
      console.error('DB Error (check):', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Route not found or does not belong to user.' });
    }

    // Proceed with deletion
    const deleteSql = `DELETE FROM transport_Routes WHERE id = ? AND userName = ?`;

    db.run(deleteSql, [id, userName], function (err) {
      if (err) {
        console.error('DB Error (delete):', err.message);
        return res.status(500).json({ error: 'Failed to delete route.' });
      }

      return res.status(200).json({ message: `Route with ID ${id} deleted successfully.` });
    });
  });
});

module.exports = router;

/*
{
  "id": 4,
  "userName": "Machawi"
}
*/
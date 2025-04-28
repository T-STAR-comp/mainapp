const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js'); // Import the SQLite database connection

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM customer_records';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching customer records:', err.message);
            return res.status(500).json({ message: 'Database Error Occurred' });
        }

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'No records found', state: 'none' });
        }
    });
});

module.exports = router;

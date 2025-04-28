const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js'); // Import the SQLite database connection

router.post('/', async (req, res) => {
    const { Email } = req.body;

    const sql = 'SELECT * FROM customer_records WHERE email = ?';

    db.get(sql, [Email], (err, row) => {
        if (err) {
            console.error('❌ Error fetching customer record:', err.message);
            return res.status(500).json({ message: 'Database Error Occurred' });
        }

        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ message: 'No record found for this email' });
        }
    });
});

module.exports = router;

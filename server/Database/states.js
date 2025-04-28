const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js'); // Import SQLite database connection

// GET Route to Fetch Landing Page Status
router.get('/', async (req, res) => {
    try {
        // Prepare the SQL query to fetch all landing page statuses
        const sql = 'SELECT * FROM landingpage_status';

        // Execute the SQL query
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).send({ message: `Error: ${err.message}` });
            }

            if (rows && rows.length > 0) {
                // Check if the first row has the landingstate as 1
                if (rows[0].landingstate === 1) {
                    res.status(200).send('1');
                }
            } else {
                // If no rows are returned, send '0'
                res.status(200).send('0');
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: `Error occurred: ${err.message}` });
    }
});

module.exports = router;

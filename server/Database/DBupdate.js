const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js'); // Import SQLite database connection

router.put('/', async (req, res) => {
    const { V, E } = req.body;

    try {
        // Prepare the SQL query to update the event's status
        const sql = 'UPDATE eventdetails SET Status = ? WHERE EventName = ?';

        // Execute the SQL query
        db.run(sql, [V, E], function(err) {
            if (err) {
                return res.status(500).send({ message: `Error: ${err.message}` });
            }

            // Check if any rows were updated
            if (this.changes > 0) {
                res.status(200).send({ message: 'Status Successfully updated', status: 'ok' });
            } else {
                res.status(200).send({ message: 'No matching event found or status unchanged' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: `Error occurred: ${err.message}` });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js'); // Import SQLite database connection

// POST Route to Insert Maintenance State
router.post('/', async (req, res) => {
    const { state } = req.body;

    try {
        // Prepare the SQL query to insert a new maintenance state
        const sql = 'INSERT INTO maintainancepage_status (maintainancestate) VALUES (?)';

        // Execute the SQL query
        db.run(sql, [state], function (err) {
            if (err) {
                return res.status(500).send({ message: `Error: ${err.message}` });
            }

            // If a row was inserted, send success message
            res.status(200).send({ message: 'Maintenance state successfully added', status: 'ok' });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: `Error occurred: ${err.message}` });
    }
});

// DELETE Route to Remove Maintenance State
router.delete('/', async (req, res) => {
    const { state } = req.body;

    try {
        // Prepare the SQL query to delete a maintenance state
        const sql = 'DELETE FROM maintainancepage_status WHERE maintainancestate = ?';

        // Execute the SQL query
        db.run(sql, [state], function (err) {
            if (err) {
                return res.status(500).send({ message: `Error: ${err.message}` });
            }

            // If rows were affected, send success message
            if (this.changes > 0) {
                res.status(200).send({ message: 'Maintenance state successfully deleted', status: 'ok' });
            } else {
                res.status(200).send({ message: 'No matching maintenance state found to delete' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: `Error occurred: ${err.message}` });
    }
});

module.exports = router;

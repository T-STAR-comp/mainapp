const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js'); // Import SQLite database connection
const CleanUp = require('./DBdeleteUID.js');

router.post('/', async (req, res) => {
    const { uniqueData } = req.body;

    if (uniqueData !== '') {
        try {
            // Query to check if the UID exists
            const sql = 'SELECT * FROM ticket_uid WHERE UID = ?';
            db.get(sql, [uniqueData], async (err, row) => {
                if (err) {
                    return res.status(500).send({ message: 'Database Error' });
                }

                if (row) {
                    // If UID exists, attempt to delete
                    const cleanup = await CleanUp.DeleteUID(uniqueData);
                    if (cleanup === 1) {
                        res.status(200).send({ message: 'VALID' });
                    } else {
                        res.status(400).send({ message: 'OFFLOADING UID ERROR, Please Try Again!' });
                    }
                } else {
                    // If UID does not exist
                    res.status(200).send({ message: 'INVALID' });
                }
            });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).send({ message: 'ERROR' });
        }
    } else {
        res.status(200).send({ message: 'NULL VAL' });
    }
});

module.exports = router;

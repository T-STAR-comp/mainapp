const express = require('express');
const router = express.Router();
const db = require('../../sqlite/sqlite.js'); // Import SQLite database connection

router.put('/', async (req, res) => {
    const {
        eventName,
        imageUrl,
        venue,
        location,
        firstDate,
        secondDate,
        time,
        standardPrice,
        vipPrice,
        eventDescription,
    } = req.body;

    try {
        // Prepare the SQL query to update event details
        const sql = `
            UPDATE eventdetails 
            SET 
                ImageURL = ?, 
                Venue = ?, 
                Location = ?, 
                FirstDate = ?, 
                SecondDate = ?, 
                Time = ?, 
                StandardPrice = ?, 
                VipPrice = ?, 
                EventDesc = ?
            WHERE EventName = ?`;

        // Execute the SQL query
        db.run(sql, [
            imageUrl,
            venue,
            location,
            firstDate,
            secondDate,
            time,
            standardPrice,
            vipPrice,
            eventDescription,
            eventName
        ], function (err) {
            if (err) {
                return res.status(500).send({ message: `Error: ${err.message}` });
            }

            // Check if any rows were updated
            if (this.changes > 0) {
                res.status(200).send({ message: 'Event details successfully updated', status: 'ok' });
            } else {
                res.status(200).send({ message: 'No event found with the provided name or no changes made' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: `Error occurred: ${err.message}` });
    }
});

module.exports = router;

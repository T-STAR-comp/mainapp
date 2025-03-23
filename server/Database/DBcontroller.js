const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js');

router.post('/', async (req, res) => {
    const status = 0;
    //console.log(req.body);
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
        QRcodeURL,
        standardBaseId,
        vipBaseId,
        eventUrl,
        eventDescription,
    } = req.body;

    const connection = await CreateDBConnection();

    try {
        const [result] = await connection.execute(
          'INSERT INTO eventdetails (EventName, ImageURL, Venue, Location, FirstDate, SecondDate, Time, StandardPrice, VipPrice, QRcodeURL, StandardBaseID, VipBaseID, EventURL, EventDesc,Status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            eventName, imageUrl, venue, location, firstDate, secondDate, time,
            standardPrice, vipPrice, QRcodeURL, standardBaseId, vipBaseId,
            eventUrl, eventDescription,status
          ]
        );

        if (result.affectedRows > 0) {
            //console.log('Database Updated!!');
            res.status(200).send({ message: 'Event Was Successfully Created' });
        }
    } catch (err) {
        //console.log(`Error: ${err}`);
        res.status(500).send({ message: `An Error Occurred: ${err}. A relational Database Error` });
    } finally {
        await connection.end();  // Ensure connection is closed
    }
});

module.exports = router;

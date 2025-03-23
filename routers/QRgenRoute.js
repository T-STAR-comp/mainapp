const express = require('express');
const router = express.Router();
const QRcontroller = require('../CONTROLLERS/QRcontroller.js');

// QR code generation route
router.post('/', async (req, res) => {
    const { numQRcodes, baseIdentifier,EventName,TicketHolder,EventTime,TicketType,EventDate,Venue } = req.body;

    // Input validation
    if (!numQRcodes || isNaN(numQRcodes) || numQRcodes <= 0) {
        return res.status(400).json({ error: 'Invalid Number Of Tickets' });
    }

    if (!baseIdentifier) {
        return res.status(400).json({ error: 'Base identifier is required' });
    }

    // Actual QR code creation
    try {
        const qrcodes = await QRcontroller.generateMultipleQRCodes(parseInt(numQRcodes), baseIdentifier,EventName,TicketHolder,EventTime,TicketType,EventDate,Venue);
     
        res.status(201).json(qrcodes);
        
    } catch (error) {
        //console.error('An error happened:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Server Error' });
        }
    }
});

module.exports = router;

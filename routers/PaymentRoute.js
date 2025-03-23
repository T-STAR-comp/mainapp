const express = require('express');
const router = express.Router();
require('dotenv').config();

let exportedPaymentData = null; // Variable to hold payment data

router.post('/', async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    const secretKey = process.env.LIVE_SEC_KEY;
    const paychanguURL = process.env.PAYCHANGU_URL;
    const randomTxRef = Math.floor(Math.random() * 1000000000) + 1;

    const paymentData = {
        amount: req.body.amount,
        currency: req.body.currency,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        callback_url: req.body.callback_url,
        return_url: req.body.return_url,
        tx_ref: randomTxRef.toString(),
        customization: {
            title: req.body.customization.title,
            description: req.body.customization.description
        },
        meta: {
            uuid: req.body.meta.uuid,
            response: req.body.meta.response
        }
    };

    try {
        const response = await fetch(paychanguURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        res.json(responseData);
        res.status(200);

    } catch (error) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

module.exports = router;
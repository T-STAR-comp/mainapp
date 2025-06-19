const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    const secretKey = process.env.LIVE_SEC_KEY;
    const paychanguURL = process.env.PAYCHANGU_URL;
    const randomTxRef = Math.floor(Math.random() * 1000000000) + 1;
    const fullName = req.body.FullName;
    const [firstName, lastName] = fullName.trim().split(" ");

    const paymentData = {
        amount: req.body.amount,
        currency: 'MWK',
        email: req.body.email,
        first_name: firstName,
        last_name: lastName,
        callback_url: req.body.callback_url,
        return_url: req.body.return_url,
        tx_ref: randomTxRef.toString(),
        customization: {
            title: req.body.tittle,
            description: "Payment For Transport Service"
        },
        meta: {
            uuid: "uuid",
            response: "success"
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
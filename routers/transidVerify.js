const express = require('express');
const router = express.Router();
require('dotenv').config();
const UpdateDB = require('../Database/db_controllers/dbeventupdate.js');

router.post('/', async (req,res)=>{
    const fetch = (await import('node-fetch')).default;
    const secretKey = process.env.SECRET_KEY; //process.env.LIVE_SEC_KEY; 
    const {trans_ID} = req.body;

    try{
        const resp = await fetch(`https://api.paychangu.com/verify-payment/${trans_ID}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${secretKey}`,
            }
        })

        const data = await resp.json();

        if(data){
            if(data.status === 'success'){

                const EventName = data.data.customization.title;
                const amount = data.data.amount;

                const response = await UpdateDB.UpdateDatabase(amount,EventName);

                response === 'ok' ? res.status(200).json({status:'ok'}) : null;
            }
        }
    }
    catch(err){
        null
    }
})


module.exports = router;
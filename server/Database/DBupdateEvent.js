const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js');


router.put('/',async(req,res)=>{
    const connection = await CreateDBConnection();
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

    try{
        const [results] = await connection.execute(
            `UPDATE eventdetails 
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
             WHERE EventName = ?`,
            [
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
            ]
        );
        
        if(results.affectedRows>0){
            res.status(200).send({message:'status Successfully updated',status:"ok"});
        }
    }
    catch(err){
        if(err){
            res.send({message:`an error :${err} occured.`});
        }
    }
});

module.exports = router;
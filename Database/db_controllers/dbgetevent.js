const express = require('express');
const router = express.Router();
const CreateDBConnection = require('../db_router.js');


router.get('/',async(req,res)=>{
    const connection = await CreateDBConnection();

    try{
        const [results] = await connection.execute(
            'SELECT * FROM eventdetails'
        );
        if(results){
            //console.log(results[0]);
            //const {Event_ID,EventName,TicketsSold,DailyRev,TotalRev} = results[0];
            res.status(200).json(results);
        }
    }
    catch(err){
        if(err){
            res.send({message:`an error :${err} occured.`});
        }
    }
});

module.exports = router;
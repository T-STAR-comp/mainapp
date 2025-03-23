const express = require('express');
const router = express.Router();
const CreateDBConnection = require('../db_router.js');


router.get('/',async(req,res)=>{
    const connection = await CreateDBConnection();

    try{
        const [results] = await connection.execute(
            'SELECT * FROM landingpage_status'
        );
        if (results.length > 0) {
            // Handle case where rows are returned
            if (results[0].landingstate === 1) {
                res.status(200).send('1');
            } else {
                res.status(200).send('Landing state is not 1');
            }
        } else {
            // Handle empty table (results = [])
            res.status(200).send('0');
        }
    }
    catch(err){
        if(err){
            res.send({message:`an error :${err} occured.`});
        }
    }
});

module.exports = router;
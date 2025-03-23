const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js');


router.get('/',async(req,res)=>{
    const connection = await CreateDBConnection();

    try{
        const [results] = await connection.execute(
            'SELECT * FROM landingpage_status'
        );
        if(results){
            if(results[0].landingstate === 1){
                res.status(200).send('1');
            }
        }
        else if([]) {
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
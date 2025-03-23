const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js');


router.delete('/',async(req,res)=>{
    const connection = await CreateDBConnection();
    const {info} = req.body;

    try{
        const [results] = await connection.execute(
            'DELETE FROM eventdetails WHERE EventName = ?',
            [info]
        );
        if(results.affectedRows>0){

            res.status(200).send({message:'Event Successfully deleted',status:"ok"});
        }
    }
    catch(err){
        if(err){
            res.send({message:`an error :${err} occured.`});
        }
    }
});

module.exports = router;
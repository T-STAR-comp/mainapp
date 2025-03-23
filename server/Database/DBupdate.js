const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js');


router.put('/',async(req,res)=>{
    const connection = await CreateDBConnection();
    const {V,E} = req.body;

    try{
        const [results] = await connection.execute(
            'UPDATE eventdetails SET Status = ? WHERE EventName = ?',
            [V,E]
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
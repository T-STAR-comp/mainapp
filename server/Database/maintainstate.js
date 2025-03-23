const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js');

router.post('/',async(req,res)=>{
    const connection = await CreateDBConnection();
    const {state} = req.body;
    console.log(req.body);

    try{
        const [results] = await connection.execute(
        'INSERT INTO maintainancepage_status (maintainancestate) VALUES  (?) ',
            [state]
        );
        console.log(results);
        if(results.affectedRows>0){

            res.status(200).send({message:'ok'});
        }
    }
    catch(err){
        if(err){
            res.send({message:`an error :${err} occured.`});
        }
    }
});

router.delete('/',async(req,res)=>{
    const connection = await CreateDBConnection();
    const {state} = req.body;

    try{
        const [results] = await connection.execute(
            'DELETE FROM maintainancepage_status WHERE maintainancestate = ?',
            [state]
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
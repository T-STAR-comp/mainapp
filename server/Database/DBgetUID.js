const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js');
const CleanUp = require('./DBdeleteUID.js');

//still needs work, it does not fntion properly
router.post('/',async(req,res)=>{
    const {uniqueData} = req.body;

    if (uniqueData != '') {

        try{
            const connection = await CreateDBConnection();
            const [results] = await connection.execute(
                'SELECT * FROM ticket_uid WHERE UID = (?)',[uniqueData]
            );
    
            if(results.length>0) {
                const cleanup = await CleanUp.DeleteUID(uniqueData);
                if(cleanup === 1) {
                    res.status(200).send({message:'VALID'});
                }
                if(cleanup != 1) {
                    res.status(200).send({message:'OFFLOADING UID ERROR, Please Try Again!'});
                }
            }
            else if(results.length===0){
                res.status(200).send({message:'INVALID'});
            }
    
        }
        catch(err){
            if(err){
                res.send({message:`ERROR`});
            }
        };
    };

    if (uniqueData === '') {
        res.status(200).send({message:'NULL VAL'});
    }
});

module.exports = router;
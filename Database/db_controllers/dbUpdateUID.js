const express = require('express');
const router = express.Router();
const createDBConnection = require('../db_router.js');

router.post('/',async (req,res) => {
    const {UidValue} = req.body;

    const conn = await createDBConnection();

    try {
        const [result] = await conn.execute(
            'INSERT INTO ticket_uid (UID) VALUES (?)',[UidValue]
        );

        if(result.affectedRows>0){
            res.status(200).send({message:'success'});
        }
    }
    catch(err) {
        res.status(500);
    }
    
});

module.exports = router;
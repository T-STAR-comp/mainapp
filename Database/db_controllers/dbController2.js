const express = require('express');
const router = express.Router();
const createDBConnection = require('../db_router.js');

router.post('/', async (req,res) => {
    console.log(req.body);

    const conn = createDBConnection();
    
    try{
        const [result] = await conn.execute(
            null
        );
    }
    catch(err){
        console.log(err);
    }

});

module.exports = router;
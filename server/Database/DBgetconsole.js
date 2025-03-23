const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js'); 

router.get('/', async (req,res)=>{

    const connection = await CreateDBConnection();

    try {
        const [results] = await connection.execute(
            'SELECT * FROM customer_records'
        );

        if (results) {
            res.status(200).json(results);
        }
    }
    catch (err) {
        res.status(200).json({message: 'Database Error Occured'});
    }
});

module.exports = router;
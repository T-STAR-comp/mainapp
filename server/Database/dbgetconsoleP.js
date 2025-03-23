const express = require('express');
const router = express.Router();
const CreateDBConnection = require('./dbRouter.js'); 

router.post('/', async (req,res)=>{

    const {Email} = req.body;

    const connection = await CreateDBConnection();

    try {
        const [results] = await connection.execute(
            'SELECT * FROM customer_records WHERE email = (?)',
            [Email]
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
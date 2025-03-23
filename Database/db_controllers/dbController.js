const express = require('express');
const router = express.Router();
const createDBConnection = require('../db_router.js');

router.post('/',async (req,res) => {

    const {email,
        first_name,
        last_name,
        amount,
        ticket_UID,
        total_tickets} = req.body;
    
    const conn = await createDBConnection();
    try{
        const [result] = await conn.execute(

            'INSERT INTO customer_records (email,first_name,surname,num_tickets,total,ticket_UID) VALUES (?,?,?,?,?,?)',
            [email,
            first_name,
            last_name,
            total_tickets,
            amount,
            ticket_UID]
        )
        /* This script enters the above data into the database . data that is
        obtained front the client through the body of the client request then fed to the MYSQL DB 
         */

        if(result.affectedRows > 0){
            res.status(200).send({message:'ok'});
        }
    }
    catch(err){
        //console.log(`database manipulation error occurred/${err.errno}/${err.code}/${err.sqlMessage}`);
    }
    //this error message will be used in the admin app 
    
})

module.exports = router;
const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/',(req,res) => {
    const ptn_code = process.env.PTN_CODE;
    const password = process.env.ADMIN_LOG_PASSWORD;  
    
    const code_valid = ptn_code === req.body.ptncode;
    const pass_valid = password === req.body.password;

    const code_Notvalid = ptn_code != req.body.ptncode;
    const pass_Notvalid = password != req.body.password;
    
    if(code_valid && pass_valid){
        res.json({response:'success'});
        res.status(200);
    }
    else if(code_Notvalid || pass_Notvalid){
        res.json({response:'failed'});
        res.status(500);
    }
});

module.exports = router;
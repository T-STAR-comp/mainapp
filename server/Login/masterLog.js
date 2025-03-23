const express = require('express');
const router = express.Router();

router.post('/',async (req,res)=>{
    const {info} = req.body;
    if(info === process.env.PIN){
        res.status(200).json('valid');
    }
    else{
        res.status(200).json('invalid');
    }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const {EventData} = require('../EventInfo/eventData.js');

router.get('/', (req, res) => {
    res.status(201).json(EventData);  //sending data to client//
})

module.exports = router;
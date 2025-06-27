const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userName, from, to, departures, adult_price, minor_price } = req.body;

  if (!userName || !from || !to || !departures || !adult_price) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!Array.isArray(departures)) {
    return res.status(400).json({ error: 'Departures must be an array.' });
  }

  const departuresJSON = JSON.stringify(departures);

  const db = req.app.locals.db;

  try {
    const [result] = await db.execute(
      `INSERT INTO transport_Routes (userName, origin, destination, departures, adult_price, minor_price) 
       VALUES (?, ?, ?, ?, ? ,?)`,
      [userName, from, to, departuresJSON, adult_price, minor_price||0]
    );

    res.status(201).json({
      message: 'Route created successfully.',
      routeId: result.insertId,
    });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;


/**
 * 
 * ALTER TABLE routes
  DROP COLUMN price,
  ADD COLUMN adult_price DECIMAL(10,2) NULL,
  ADD COLUMN minor_price DECIMAL(10,2) NULL;

 */
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userName, from, to, departures, price } = req.body;

  if (!userName || !from || !to || !departures || !price) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!Array.isArray(departures)) {
    return res.status(400).json({ error: 'Departures must be an array.' });
  }

  const departuresJSON = JSON.stringify(departures);

  const db = req.app.locals.db;

  try {
    const [result] = await db.execute(
      `INSERT INTO transport_Routes (userName, origin, destination, departures, price) 
       VALUES (?, ?, ?, ?, ?)`,
      [userName, from, to, departuresJSON, price]
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

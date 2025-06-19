const express = require('express');
const router = express.Router();
const db = require('../../../sqlite/sqlite.js');

router.post('/', (req, res) => {
  const { userName, from, to, departures, price } = req.body;

  // Basic validation
  if (!userName || !from || !to || !departures || !price) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate departures is an array
  if (!Array.isArray(departures)) {
    return res.status(400).json({ error: 'Departures must be an array.' });
  }

  // Convert departures to JSON string
  const departuresJSON = JSON.stringify(departures);

  // Insert into database
  const sql = `
    INSERT INTO transport_Routes (userName, origin, destination, departures, price)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [userName, from, to, departuresJSON, price], function (err) {
    if (err) {
      console.error('DB Error:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    return res.status(201).json({
      message: 'Route created successfully.',
      routeId: this.lastID
    });
  });
});

module.exports = router;

/*
{
  "userName": "Machawi",
  "from": "Blantyre",
  "to": "Lilongwe",
  "departures": ["Morning", "Afternoon"],
  "price": 7000
}
*/
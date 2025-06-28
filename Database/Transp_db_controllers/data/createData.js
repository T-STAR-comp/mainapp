const express = require('express');
const router = express.Router();
const { generateQRCodeFromEmail } = require('../processing/QRprocessing.js');

// Sanitize to prevent basic injection
const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9 ,.@-]/g, '').trim(); // allow @ for emails
};

router.post('/', async (req, res) => {
  const {
    email, // only email required to generate UID_val
    customerName,
    route,
    departure,
    travel_date,
    total_price,
    tickets_bought,
    provider_username,
  } = req.body;

  if (
    !email || !route || !departure || !travel_date ||
    typeof total_price !== 'number' ||
    typeof tickets_bought !== 'number' ||
    !provider_username
  ) {
    return res.status(400).json({ error: 'Invalid or incomplete data.' });
  }

  try {
    const db = req.app.locals.db;

    // Generate QR and UID_val
    const { qrCodeDataURL, identifier } = await generateQRCodeFromEmail(email);

    // Lowercase route and departure if they are strings
    const routeLower = typeof route === 'string' ? route.toLowerCase() : route;
    const departureLower = typeof departure === 'string' ? departure.toLowerCase() : departure;

    const cleanUID = sanitizeText(identifier);
    const cleanCustomerName = sanitizeText(customerName);
    const cleanCustomerEmail = sanitizeText(email);
    const cleanRoute = sanitizeText(routeLower);
    const cleanDeparture = sanitizeText(departureLower);
    const cleanTravelDate = sanitizeText(travel_date);
    const cleanUsername = sanitizeText(provider_username);

    // Step 1: Check if UID already exists (prevent duplicate bookings)
    const [existingRows] = await db.execute(
      `SELECT id FROM ticket_sales WHERE UID_val = ?`,
      [cleanUID]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({ error: 'Duplicate booking detected for this email/UID.' });
    }

    // Step 2: Find last seat number for the same date, provider, and departure
    const [seatRows] = await db.execute(
      `SELECT seat_number FROM ticket_sales WHERE travel_date = ? AND provider_username = ? AND departure = ? ORDER BY id DESC LIMIT 1`,
      [cleanTravelDate, cleanUsername, cleanDeparture]
    );

    let nextSeat = 1;
    if (seatRows.length > 0 && seatRows[0].seat_number) {
      nextSeat = parseInt(seatRows[0].seat_number, 10) + 1;
      if (nextSeat > 30) {
        return res.status(409).json({ error: `All seats are booked for ${provider_username} on this date.` });
      }
    }

    // Step 3: Insert into database
    const [insertResult] = await db.execute(
      `INSERT INTO ticket_sales (
        customer_name, customer_email, UID_val, qrCodeDataURL, route, departure, travel_date,
        total_price, tickets_bought, seat_number, provider_username
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanCustomerName,
        cleanCustomerEmail,
        cleanUID,
        qrCodeDataURL,
        cleanRoute,
        cleanDeparture,
        cleanTravelDate,
        total_price,
        tickets_bought,
        String(nextSeat),
        cleanUsername
      ]
    );

    res.status(201).json({
      message: 'Ticket sale recorded successfully.',
      ticket: {
        id: insertResult.insertId,
        customerName: cleanCustomerName,
        customerEmail: cleanCustomerEmail,
        UID_val: cleanUID,
        qrCode: qrCodeDataURL,
        route: cleanRoute,
        departure: cleanDeparture,
        travel_date: cleanTravelDate,
        total_price,
        tickets_bought,
        seat_number: String(nextSeat),
        provider_username: cleanUsername
      }
    })
  } catch (err) {
    console.error('❌ Error processing ticket sale:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

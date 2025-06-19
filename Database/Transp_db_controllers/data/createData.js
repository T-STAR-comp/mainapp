const express = require('express');
const router = express.Router();
const { generateQRCodeFromEmail } = require('../processing/QRprocessing.js');

// Connect to SQLite
const db = require('../../../sqlite/sqlite');

// Sanitize to prevent basic injection
const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9 ,.@-]/g, '').trim(); // allow @ for emails
};

// POST route to insert ticket sale
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
    return res.status(200).json({ error: 'Invalid or incomplete data.' });
  }

  try {
    // Generate QR and UID_val
    const { qrCodeDataURL, identifier } = await generateQRCodeFromEmail(email);

    const cleanUID = sanitizeText(identifier);
    const cleanCustomerName = sanitizeText(customerName);
    const cleanCustomerEmail = sanitizeText(email);
    const cleanRoute = sanitizeText(route);
    const cleanDeparture = sanitizeText(departure);
    const cleanTravelDate = sanitizeText(travel_date);
    const cleanUsername = sanitizeText(provider_username);

    // Step 1: Check if UID already exists (prevent duplicate bookings)
    const duplicateQuery = `SELECT id FROM ticket_sales WHERE UID_val = ?`;

    db.get(duplicateQuery, [cleanUID], (err, existingRow) => {
      if (err) {
        
        return res.status(200).json({ error: 'Error checking for duplicates.' });
      }

      if (existingRow) {
        return res.status(200).json({ error: 'Duplicate booking detected for this email/UID.' });
      }

      // Step 2: Find last seat number for the same date and provider
      const seatQuery = `
        SELECT seat_number FROM ticket_sales
        WHERE travel_date = ? AND provider_username = ?
        ORDER BY id DESC LIMIT 1
      `;

      db.get(seatQuery, [cleanTravelDate, cleanUsername], (err, row) => {
        if (err) {
          
          return res.status(200).json({ error: 'Internal error during seat number check.' });
        }

        let nextSeat = 1;
        if (row && row.seat_number) {
          nextSeat = parseInt(row.seat_number, 10) + 1;

          if (nextSeat > 30) {
            return res.status(200).json({ error: 'All seats are booked for this provider on this date.' });
          }
        }

        // Step 3: Insert into database
        const insertQuery = `
          INSERT INTO ticket_sales (
            customer_name, customer_email, UID_val, qrCodeDataURL, route, departure, travel_date,
            total_price, tickets_bought, seat_number, provider_username
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
          insertQuery,
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
          ],
          function (err) {
            if (err) {
              return res.status(200).json({ error: 'Failed to insert ticket record.' });
            }

            res.status(200).json({
              message: 'Ticket sale recorded successfully.',
              ticket: {
                id: this.lastID,
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
            });
          }
        );
      });
    });
  } catch (err) {
    return res.status(500).json({ error: 'QR generation failed.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const {sendTicketEmail} = require('./email.js');

router.post('/', async (req, res) => {
  const {
    customer_name,
    customer_email,
    route,
    departure,
    travel_date,
    total_price,
    seat_number,
    qrCodeDataURL,
    provider_username
  } = req.body;

  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${(customer_name || 'ticket').replace(/\s+/g, '_')}_ticket.pdf`,
      'Content-Length': pdfData.length,
    });
    res.send(pdfData);

    sendTicketEmail(customer_email, customer_name, provider_username, pdfData)
    .then(() => console.log('Ticket email sent successfully'))
    .catch(err => console.error('Error sending ticket email:', err));

  });

  // Try loading logo
  try {
    const logoResp = await fetch('https://i.postimg.cc/dV11cwfD/logo-tkm.png');
    const logoBuffer = await logoResp.buffer();
    doc.image(logoBuffer, 50, 30, { width: 80 });
  } catch (err) {
    console.warn("⚠️ Logo fetch failed:", err.message);
  }

  // Header
  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .fillColor('#1E3A8A')
    .text('Ticket Malawi', 0, 40, { align: 'center' })
    .moveDown(0.5)
    .fontSize(14)
    .text(`${provider_username} Travel Ticket`, { align: 'center' })
    .moveDown(2);

  // Main box
  const boxTop = doc.y;
  const boxHeight = 230;

  doc
    .lineWidth(1)
    .strokeColor('#1E3A8A')
    .roundedRect(40, boxTop, 520, boxHeight, 10)
    .stroke();

  const startX = 60;
  let currentY = boxTop + 15;

  const printDetail = (label, value) => {
    doc.font('Helvetica').fontSize(12).text(`${label}: `, startX, currentY, { continued: true });
    doc.font('Helvetica-Bold').text(value);
    currentY = doc.y + 5;
  };

  printDetail('Name', customer_name);
  printDetail('Email', customer_email);
  printDetail('Route', route);
  printDetail('Departure', departure);
  printDetail('Travel Date', travel_date);
  printDetail('Seat Number', seat_number);
  printDetail('Total Price', `MWK ${Number(total_price).toLocaleString()}`);

  // QR Code
  if (qrCodeDataURL && qrCodeDataURL.startsWith('data:image')) {
    const base64Image = qrCodeDataURL.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    doc.image(imageBuffer, 400, boxTop + 30, { width: 120 });
    doc
      .fontSize(10)
      .fillColor('#444')
      .text('Scan to Verify', 400, boxTop + 160, { align: 'center', width: 120 });
  }

  // Footer
  doc
    .fontSize(10)
    .fillColor('gray')
    .text('Thank you for choosing Ticket Malawi!', 0, 720, { align: 'center' });

  doc
    .fontSize(9)
    .fillColor('#1E3A8A')
    .text('Powered by OASIS', 0, 735, { align: 'center' });

  doc.end();
});

module.exports = router;

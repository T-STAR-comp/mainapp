const QRcode = require('qrcode');

// Function to generate a unique random number
const generateUniqueRandomNumber = (existingNumbers, min = 1, max = 1000000) => {
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (existingNumbers.has(randomNumber));
    existingNumbers.add(randomNumber);
    return randomNumber;
};

// Function to start QR code generation
const generateMultipleQRCodes = async (numQRcodes, baseIdentifier,EventName,TicketHolder,EventTime,TicketType,EventDate,Venue) => {
    const qrcodes = [];
    const existingNumbers = new Set();

    for (let i = 0; i < numQRcodes; i++) {
        const uniqueNumber = generateUniqueRandomNumber(existingNumbers);
        const uniqueIdentifier = `${baseIdentifier}-${uniqueNumber}`;
        const qrContent = `${uniqueIdentifier}`;

        try {
            const qrCodeDataURL = await QRcode.toDataURL(qrContent);
            //console.log('Unique Identifier:', uniqueIdentifier);

            qrcodes.push({ qrCodeDataURL, uniqueIdentifier, EventName,TicketHolder,EventTime,TicketType,EventDate,Venue}); // Adds the QR code to the array
        } catch (error) {
            null//console.error('Error generating QR code:', error);
        }
    }
    /* QRcodes are made in here, using the second function. the number of qr codes to create and
     base identifier is passed in, the first function creates a random number on every request
     to make each ticket ID unique. after the qr code has been made using the specified contents
     we return the qr codes array as done below */

    return qrcodes;
};

module.exports = {
    generateMultipleQRCodes,
};

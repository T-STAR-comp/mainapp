// emailService.js
require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "mail.spacemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a ticket confirmation email
 * @param {string} to - Recipient email address
 * @param {Object} ticketData - Dynamic content like name, origin, destination, etc.
 * @returns {Promise} - Resolves when the email is sent
 */
async function sendTicketEmail(customer_email, customer_name, provider_username, pdf) {

  const mailOptions = {
    from: `"Ticket Malawi" <${process.env.EMAIL_USER}>`,
    to: customer_email,
    subject: "Your Ticket Confirmation – Ticket Malawi",
    html: `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center;">
        <h2 style="color: #1E3A8A;">Travel Ticket Confirmation</h2>
        <p style="font-size: 16px; color: #000000;">Hi ${customer_name},</p>
        <p style="font-size: 15px; color: #000000;">
          Thank you for booking with <strong>Ticket Malawi</strong>! Your travel ticket from <strong>${provider_username}</strong> is attached to this email.
        </p>
      </div>
  
      <div style="margin-top: 30px;">
        <p style="font-size: 14px; color: #333;">Please keep this email for your records. Show your ticket (PDF) when boarding.</p>
      </div>
  
      <div style="margin-top: 40px; text-align: center; font-size: 13px; color: #1E3A8A;">
        Powered by <strong>Oasis</strong>
      </div>
    </div>
  `,
  
  
  
    attachments: [
      {
        filename: "ticket.pdf",
        content: pdf,
      }
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

module.exports = { sendTicketEmail };

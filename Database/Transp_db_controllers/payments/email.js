// emailService.js
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.spacemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER_CFO,
    pass: process.env.EMAIL_PASS_CFO,
  },
});

/**
 * Send a withdrawal confirmation email
 * @param {string} customer_email - Recipient email address
 * @param {string} customer_name - Recipient's name
 * @param {number|string} amount - Amount withdrawn
 */
async function sendWithdrawalEmail(customer_email, customer_name, amount) {
  const formattedAmount = `MWK ${Number(amount).toLocaleString()}`;

  const mailOptions = {
    from: `"Ticket Malawi" <${process.env.EMAIL_USER_CFO}>`,
    to: customer_email,
    subject: "Withdrawal Confirmation – Ticket Malawi",
    html: `
      <div style="background-color: #ffffff; font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center;">
          <h2 style="color: #1E3A8A;">Withdrawal Successful</h2>
          <p style="font-size: 16px; color: #000;">Hi ${customer_name},</p>
          <p style="font-size: 15px; color: #000;">
            You have successfully withdrawn <strong>${formattedAmount}</strong> from your Ticket Malawi wallet.
          </p>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <a href="https://ticketmalawi.com/memberspage" target="_blank"
            style="display: inline-block; padding: 12px 24px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Visit Dashboard
          </a>
        </div>

        <div style="margin-top: 30px;">
          <p style="font-size: 14px; color: #333;">
            Please allow a few minutes for the funds to reflect in your linked bank account. If you do not see the funds after some time, kindly contact your bank directly.
          </p>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 13px; color: #1E3A8A;">
          Powered by <strong>Oasis</strong>
        </div>
      </div>
    `
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

module.exports = { sendWithdrawalEmail };

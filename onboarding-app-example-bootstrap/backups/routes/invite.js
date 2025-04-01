// routes/invite.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');

const upload = multer(); // No storage is specified; we only need to parse text fields.

// In-memory storage for demonstration; replace with a persistent store as needed.
const invitationStore = {}; // { email: { code: '123456', expiresAt: Date } }

router.post('/', upload.none(), async (req, res) => {
  const { email, name, company, phone, location, about } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Email and name are required.' });
  }

  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // Set expiration for 24 hours from now
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  // Save code and expiration in your store (e.g., database)
  invitationStore[email] = { code, expiresAt };



  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, //sTLS will be used via STARTTLS
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY      
    },
  });

  

  const frontendUrl = process.env.FRONTEND_URL || 'https://vbi-demo-dev.azurewebsites.net';

    const emailTemplate = `
    <html>
    <head>…</head>
    <body>
      <div class="container">
        <div class="header">Your Invitation Code</div>
        <p>Hi ${name},</p>
        <p>Your invitation code is:</p>
        <div class="code">${code}</div>
        <p>
          <a href="${frontendUrl}/redeem-invitation?code=${code}" target="_blank" rel="noopener noreferrer">
            Follow this link to redeem your invitation
          </a>
        </p>
        <p>This code will expire in 24 hours.</p>
        <p>Thank you,<br>The Team</p>
        <div class="footer">If you did not request this invitation, please ignore this email.</div>
      </div>
    </body>
    </html>`;


  // Set up mail options
  const mailOptions = {
    from: 'fpearson613@gmail.com',      // Replace with your email
    to: email,
    subject: 'Your Invitation Code',
    html: emailTemplate
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false });
    }
    console.log('Email sent: ' + info.response);
    res.json({ success: true });
  });
});

module.exports = router;

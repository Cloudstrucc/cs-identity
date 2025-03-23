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

  // Configure nodemailer transporter (example uses Gmail; adjust for your SMTP service)
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'fpearson613@gmail.com',    // Replace with your email
  //     pass: 'Gaby613$'        // Replace with your email password or app password
  //   }
  // });

  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // TLS will be used via STARTTLS
    auth: {
      user: "apikey",
      pass: "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"
    },
    // tls: {
    //   ciphers: 'SSLv3'
    // }
  });
  
  

  // Create the HTML email template
  const emailTemplate = `
  <html>
    <head>
      <style>
        body {
          font-family: sans-serif;
          background-color: #f8f9fa;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          margin: auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          font-size: 24px;
          margin-bottom: 10px;
          color: #343a40;
        }
        .code {
          font-size: 20px;
          color: #17a2b8;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #6c757d;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Your Invitation Code</div>
        <p>Hi ${name},</p>
        <p>Your invitation code is:</p>
        <div class="code">${code}</div>
        <p>This code will expire in 24 hours.</p>
        <p>Thank you,<br>The Team</p>
        <div class="footer">
          If you did not request this invitation, please ignore this email.
        </div>
      </div>
    </body>
  </html>
  `;

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


const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');

const upload = multer(); // No storage is specified; we only need to parse text fields.

// In-memory store for demonstration
const invitationStore = {}; // { email: { code: '123456', expiresAt: Date } }

router.post('/', upload.none(), async (req, res) => {
  const { email, name, company, phone, location, about } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Email and name are required.' });
  }

  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  invitationStore[email] = { code, expiresAt };

  // Generate an Ethereal test account
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create test account:', err);
      return res.status(500).json({ success: false, error: 'Failed to create test email account.' });
    }

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://vbi-demo-dev.azurewebsites.net';

    const emailTemplate = `
      <html>
      <head><style>.code { font-size: 24px; font-weight: bold; }</style></head>
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

    const mailOptions = {
      from: 'DevApp <no-reply@example.com>',
      to: email,
      subject: 'Your Invitation Code',
      html: emailTemplate
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false });
      }

      console.log('Email sent (simulated): ' + info.messageId);
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));

      res.json({
        success: true,
        previewUrl: nodemailer.getTestMessageUrl(info)
      });
    });
  });
});

module.exports = router;

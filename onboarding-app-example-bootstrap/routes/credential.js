const express = require('express');
const router = express.Router();
const axios = require('axios');
const QRCode = require('qrcode');

// Endpoint to request a credential from the Identus Wallet
router.post('/request-credential', async (req, res) => {
  try {
    const userData = req.body;
    
    // Generate a unique session ID for this credential request
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    // Call the Identus Wallet API to create a credential
    const walletResponse = await axios.post('http://localhost:3001/api/create-credential', {
      subject: userData,
      sessionId: sessionId,
      callbackUrl: `https://vbi-dev.cloudstrucc.com/api/credential-callback`,
    });
    
    if (!walletResponse.data || !walletResponse.data.credentialOffer) {
      throw new Error('Invalid response from wallet service');
    }
    
    // Generate QR code for the credential offer URL
    const credentialOfferUrl = walletResponse.data.credentialOffer;
    const qrCodeDataUrl = await QRCode.toDataURL(credentialOfferUrl);
    
    // Store the session in your database or temporary storage
    // This is important for tracking the credential issuance status
    
    // Return the QR code URL to the frontend
    res.json({
      success: true,
      qrCodeUrl: qrCodeDataUrl,
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Credential request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate credential'
    });
  }
});

// Callback endpoint for the Identus Wallet to notify when credentials are issued
router.post('/credential-callback', async (req, res) => {
  try {
    const { sessionId, status, credentialId } = req.body;
    
    // Update your database or session storage with the credential status
    
    res.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ success: false, error: 'Failed to process callback' });
  }
});

module.exports = router;

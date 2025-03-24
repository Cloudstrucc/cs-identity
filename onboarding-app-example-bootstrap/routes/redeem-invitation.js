// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/newpage'
router.get('/redeem-invitation', (req, res) => {
  res.render('redeem-invitation', { title: 'Redeem invitation' });
});

module.exports = router;

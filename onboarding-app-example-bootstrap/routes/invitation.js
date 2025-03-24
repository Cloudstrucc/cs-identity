// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/invitation'
router.get('/invitation', (req, res) => {
  res.render('invitation', { title: 'New Invitation' });
});

module.exports = router;

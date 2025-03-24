// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/newpage'
router.get('/setup-identity', (req, res) => {
  res.render('setup-identity', { title: 'Setup identity' });
});

module.exports = router;

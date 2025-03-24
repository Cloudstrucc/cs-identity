// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/newpage'
router.get('/user-details', (req, res) => {
  res.render('user-details', { title: 'User details' });
});

module.exports = router;
// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/newpage'
router.get('/', (req, res) => {
  res.render('invitation', { title: 'New Invitation' });
});

module.exports = router;

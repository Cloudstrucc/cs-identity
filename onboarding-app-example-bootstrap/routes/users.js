// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/newpage'
router.get('/users', (req, res) => {
  res.render('users', { title: 'All users' });
});

module.exports = router;

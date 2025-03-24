// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/admin-dashboard'
router.get('/admin-dashboard', (req, res) => {
  res.render('admin-dashboard', { title: 'Administrator dashboard' });
});

module.exports = router;
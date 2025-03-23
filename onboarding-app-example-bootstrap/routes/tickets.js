// routes/newpage.js
const express = require('express');
const router = express.Router();

// GET route for '/newpage'
router.get('/', (req, res) => {
  res.render('tickets', { title: 'Ticket workspace' });
});

module.exports = router;

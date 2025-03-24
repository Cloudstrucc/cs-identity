// routes/sign-in.js
const express = require('express');
const router = express.Router();

// GET route for '/sign-in (home)'
router.get('/', (req, res) => {
  res.render('home', { layout:false, title: 'Setup identity' });
});

module.exports = router;

// routes/sign-in.js
const express = require('express');
const router = express.Router();

// GET route for '/sign-in (home)'
router.get('/sign-in', (req, res) => {
  res.render('sign-in', { layout:false, title: 'Sign in' });
});

module.exports = router;

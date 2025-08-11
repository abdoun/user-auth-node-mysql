// login.js
require('dotenv').config();
const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  res.json({
    message: 'This is your profile',
    user: req.user
  });
});

module.exports = router;

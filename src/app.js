// src/app.js
require('dotenv').config({ quiet: true }); // suppress .env logs in test
const express = require('express');

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const profileRoute = require('./routes/profile');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

// Mount routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);

module.exports = app;

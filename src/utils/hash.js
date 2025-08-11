// utils/hash.js
const bcrypt = require('bcrypt');
module.exports.hashPassword = (password) => bcrypt.hash(password, 10);

const mysql = require('mysql2/promise');

// Create pool (adjust config as needed)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '!z34567B',
  database: 'testdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


const express = require('express');
const app = express();
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const pool = require('./db'); // import the pool
const { body, validationResult } = require('express-validator');

require('dotenv').config({ quiet: true }); // suppress .env logs in test

const cors = require('cors');

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const profileRoute = require('./routes/profile');


const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header (curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow configured frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

// Mount routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);




// ✅ CREATE
app.post(
  '/users',
  [
    body('name').isLength({ min: 2 }),
    body('email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
      );
      res.json({ id: result.insertId, name, email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// ✅ READ (all)
app.get('/users', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // defaults: page 1, 10 users per page
    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Page and limit must be positive integers' });
    }

    const offset = (page - 1) * limit;

    const [rows] = await pool.query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM users');

    res.json({
      page,
      limit,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      users: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// ✅ READ (one)
app.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ✅ UPDATE
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, req.params.id]
    );
    res.json({ message: 'User updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ✅ DELETE
app.delete('/users/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

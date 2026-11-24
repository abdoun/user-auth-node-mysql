
const express = require('express');
const app = express();
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'test'
  ? '.env.test'
  : process.env.NODE_ENV === 'production'
    ? '.env.docker'
    : '.env';
dotenv.config({ path: envFile, quiet: true });

const pool = require('./db'); // import the pool
const { body, validationResult } = require('express-validator');

const cors = require('cors');

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const profileRoute = require('./routes/profile');
const authenticateToken = require('./middleware/auth');


const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

// Log requests and validate their origins
app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    'Origin:', origin
  );

  if (!origin || allowedOrigins.includes(origin)) {
    return next();
  }

  console.log('Blocked CORS origin:', origin);

  return res.status(403).json({
    error: 'Origin not allowed'
  });
});

// Configure CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

// Mount routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);

// ✅ READ (all)
app.get('/users', authenticateToken, async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // defaults: page 1, 10 users per page
    page = parseInt(page);
    limit = parseInt(limit);

    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'Page and limit must be positive integers' });
    }

    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ? LIMIT ? OFFSET ?',
      [req.user.id, limit, offset]
    );
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE id = ?',
      [req.user.id]
    );

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
app.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ✅ UPDATE
app.put(
  '/users/:id',
  authenticateToken,
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').trim().normalizeEmail().isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (Number(req.params.id) !== Number(req.user.id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

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
  }
);

// ✅ DELETE
app.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/db'); // ✅ import the DB connection


describe('Auth API', () => {
  test('POST /register should create user', async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'secret' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /login should return token', async () => {
    // Register first
    await request(app)
      .post('/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'secret' });

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'secret' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('GET /profile should return 401 without token', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(401);
  });
});

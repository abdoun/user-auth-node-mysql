// tests/unit/hash.test.js
const { hashPassword } = require('../../src/utils/hash');
const bcrypt = require('bcrypt');

test('hashPassword should return a hashed string', async () => {
  const hash = await hashPassword('secret');
  expect(typeof hash).toBe('string');
  const match = await bcrypt.compare('secret', hash);
  expect(match).toBe(true);
});

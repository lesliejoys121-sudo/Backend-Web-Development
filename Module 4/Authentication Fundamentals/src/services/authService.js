const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const DUMMY_PASSWORD_HASH =
  '$2b$12$C6UzMDM.H6dfI/f/IKcEe.5J7J2J8J4N9lVwD3w7W9J6b8V9Q7M2e';
const GENERIC_CREDENTIAL_ERROR = {
  statusCode: 401,
  code: 'INVALID_CREDENTIALS',
  message: 'Invalid email or password',
};

function assertString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, 'INVALID_INPUT', `${field} is required`);
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function safeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function invalidCredentials() {
  return new AppError(
    GENERIC_CREDENTIAL_ERROR.statusCode,
    GENERIC_CREDENTIAL_ERROR.code,
    GENERIC_CREDENTIAL_ERROR.message,
  );
}

async function register(input) {
  assertString(input && input.name, 'name');
  assertString(input.email, 'email');
  assertString(input.password, 'password');

  const email = normalizeEmail(input.email);
  const passwordHash = await bcrypt.hash(
    input.password,
    Number(process.env.BCRYPT_COST || 12),
  );

  try {
    const user = await userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });
    return safeUser(user);
  } catch (error) {
    if (error && error.code === 'P2002') {
      throw new AppError(
        409,
        'EMAIL_EXISTS',
        'An account with this email already exists',
      );
    }
    throw error;
  }
}

async function login(input) {
  assertString(input && input.email, 'email');
  assertString(input.password, 'password');

  const user = await userRepository.findByEmail(normalizeEmail(input.email));
  const passwordHash = user ? user.passwordHash : DUMMY_PASSWORD_HASH;
  const valid = await bcrypt.compare(input.password, passwordHash);

  if (!user || !valid) {
    throw invalidCredentials();
  }

  return safeUser(user);
}

module.exports = { register, login };

const express = require('express');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');
const AppError = require('../utils/AppError');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true',
  signed: true,
  path: '/',
  maxAge: Number(process.env.SESSION_TTL_MS || 3600000),
};

function safeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function invalidCredentials() {
  return new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
}

function validateCredentials(input) {
  if (
    !input ||
    typeof input.email !== 'string' ||
    input.email.trim() === '' ||
    typeof input.password !== 'string' ||
    input.password.trim() === ''
  ) {
    throw new AppError(400, 'INVALID_INPUT', 'Email and password are required');
  }
}

router.post('/login', async (req, res, next) => {
  try {
    validateCredentials(req.body);
    const email = req.body.email.trim().toLowerCase();
    const user = await userRepository.findByEmail(email);
    const valid = await bcrypt.compare(
      req.body.password,
      user ? user.passwordHash : userRepository.dummyPasswordHash,
    );

    if (!user || !valid) throw invalidCredentials();

    const session = sessionStore.create(user.id);
    res.cookie('sid', session.id, cookieOptions);
    return res.status(200).json({ data: safeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    await requireSession(req, res, async () => {
      return res.status(200).json({ data: safeUser(req.user) });
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const sid = req.signedCookies.sid;
    if (sid) sessionStore.destroy(sid);
    res.clearCookie('sid', cookieOptions);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

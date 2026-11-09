require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

if (!process.env.COOKIE_SECRET) throw new Error('COOKIE_SECRET is required');

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/auth', authRoutes);
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.body) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Request body must be valid JSON' },
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code || 'REQUEST_ERROR',
        message: error.message,
      },
    });
  }

  console.error('Internal server error');
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API listening on ${port}`));

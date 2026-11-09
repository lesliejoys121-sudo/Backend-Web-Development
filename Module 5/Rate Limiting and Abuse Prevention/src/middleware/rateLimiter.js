'use strict';

const rateLimit = require('express-rate-limit');

// The default MemoryStore is suitable for one local process only. In a
// multi-instance deployment, rate-limit-redis can replace it with a shared
// RedisStore so a load-balanced client cannot get a separate limit per server.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const resetTime = req.rateLimit && req.rateLimit.resetTime;
    const retryAfter = resetTime instanceof Date
      ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
      : 1;

    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
      },
    });
  },
});

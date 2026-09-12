import rateLimit from 'express-rate-limit';


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please take a cozy breath and try again in 15 minutes.',
  },
});

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';

// Auth endpoints — strict
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: { error: 'Too many attempts. Try again in 15 minutes.' },
  store: new RedisStore({ client: redisClient })
});

// General API — moderate
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  store: new RedisStore({ client: redisClient })
});

// AI endpoints — generous but controlled (API costs money)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  store: new RedisStore({ client: redisClient })
});

// Admin endpoints — moderate
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  store: new RedisStore({ client: redisClient })
});

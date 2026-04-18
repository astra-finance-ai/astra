import Redis from 'ioredis';
import { env } from './env';

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

process.on('SIGINT', () => {
  redisClient.quit();
  console.log('📦 Redis connection closed');
});

export default redisClient;

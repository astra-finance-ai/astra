import Redis from 'ioredis';
import { getEnv } from './env';

const env = getEnv();

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redisClient;

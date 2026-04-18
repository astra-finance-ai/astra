import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('4000'),
  BACKEND_URL: z.string().url(),
  MONGODB_URI: z.string(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  GEMINI_API_KEY: z.string().min(1),
  NEWS_API_KEY: z.string().min(1),
  AI_SCORE_TTL_HOURS: z.string().transform(Number).default('24'),
  MARKET_SUMMARY_TTL_HOURS: z.string().transform(Number).default('6'),
  WORLD_BANK_CACHE_DAYS: z.string().transform(Number).default('7'),
  SCORE_QUEUE_CONCURRENCY: z.string().transform(Number).default('3'),
  MAX_CHAT_HISTORY_MESSAGES: z.string().transform(Number).default('50'),
  USE_MOCK_AI: z.string().transform((v) => v === 'true').default('false')
});

export type Env = z.infer<typeof envSchema>;

let env: Env | null = null;

export function getEnv(): Env {
  if (env) return env;
  
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  
  env = result.data;
  return env;
}

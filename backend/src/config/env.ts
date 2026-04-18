import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  FRONTEND_URL: z.string().url(),
  
  // Database
  MONGODB_URI: z.string().startsWith('mongodb'),
  REDIS_URL: z.string().startsWith('redis'),
  
  // Auth
  JWT_SECRET: z.string().min(64),
  JWT_EXPIRY: z.string().default('7d'),
  REFRESH_TOKEN_EXPIRY: z.string().default('30d'),
  ADMIN_JWT_SECRET: z.string().min(64),
  ADMIN_JWT_EXPIRY: z.string().default('8h'),
  
  // Email
  SENDGRID_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  EMAIL_FROM_NAME: z.string().default('Astra'),
  
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  
  // AI
  GEMINI_API_KEY: z.string().min(1),
  NEWS_API_KEY: z.string().min(1),
  
  // Blockchain
  SOLANA_NETWORK: z.enum(['devnet', 'testnet', 'mainnet-beta']).default('devnet'),
  SOLANA_RPC_URL: z.string().url(),
  ASTRA_REGISTRY_PROGRAM_ID: z.string().min(1),
  ASTRA_POOL_PROGRAM_ID: z.string().min(1),
  ASTRA_YIELD_PROGRAM_ID: z.string().min(1),
  SQUADS_MULTISIG_ADDRESS: z.string().min(1),
  PLATFORM_SIGNER_1_KEYPAIR: z.string().min(1),
  PLATFORM_SIGNER_2_KEYPAIR: z.string().min(1),
  SWITCHBOARD_SOL_USD_FEED: z.string().min(1),
  USDC_MINT: z.string().min(1).default('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  
  // Security
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
  CORS_ORIGIN: z.string().url()
});

export type Env = z.infer<typeof envSchema>;

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', envVars.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = envVars.data;

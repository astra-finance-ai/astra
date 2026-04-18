export const REGIONS = ['africa', 'north_america', 'europe', 'middle_east', 'oceania', 'asia'] as const;
export const ASSET_TYPES = ['real_estate', 'invoice', 'agricultural'] as const;
export const RISK_TOLERANCE = ['conservative', 'balanced', 'aggressive'] as const;
export const INVESTMENT_GOALS = ['capital_growth', 'passive_income', 'diversification'] as const;

export const ASSET_STATUS = ['draft', 'pending_review', 'active', 'paused', 'funded', 'closed'] as const;
export const INVESTMENT_STATUS = ['pending', 'confirmed', 'failed', 'withdrawn'] as const;

export const NOTIFICATION_TYPES = [
  'investment_confirmed',
  'yield_available',
  'yield_claimed',
  'ai_score_updated',
  'new_asset_listed',
  'security_alert',
  'lock_period_expiring',
  'position_withdrawn',
  'system_update'
] as const;

export const ADMIN_ROLES = ['super_admin', 'asset_manager', 'analyst'] as const;

export const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  asset_manager: [
    'asset.read', 'asset.create', 'asset.update', 'asset.publish',
    'pool.read', 'pool.initialize', 'pool.pause',
    'yield.read', 'yield.record',
    'user.read'
  ],
  analyst: [
    'asset.read', 'pool.read', 'yield.read',
    'user.read', 'analytics.read'
  ]
};

export const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
export const PASSWORD_RESET_EXPIRY_HOURS = 1;
export const JWT_EXPIRY = '7d';
export const REFRESH_TOKEN_EXPIRY = '30d';
export const ADMIN_JWT_EXPIRY = '8h';

export const MAX_FILE_SIZE_IMAGE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE_DOCUMENT = 20 * 1024 * 1024; // 20MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

export const SUPABASE_BUCKETS = {
  ASSET_IMAGES: 'asset-images',
  ASSET_DOCUMENTS: 'asset-documents',
  USER_AVATARS: 'user-avatars'
};

export const RATE_LIMITS = {
  AUTH_WINDOW_MS: 15 * 60 * 1000,
  AUTH_MAX: 10,
  API_WINDOW_MS: 60 * 1000,
  API_MAX: 100,
  AI_WINDOW_MS: 60 * 1000,
  AI_MAX: 20,
  ADMIN_WINDOW_MS: 15 * 60 * 1000,
  ADMIN_MAX: 200
};

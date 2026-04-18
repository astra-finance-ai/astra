import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  country: string;
  avatarUrl: string | null;
  
  // Wallet
  walletPublicKey: string | null;
  walletRegisteredAt: Date | null;
  walletRegistryTxSignature: string | null;
  
  // Investment preferences
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  investmentGoals: Array<'capital_growth' | 'passive_income' | 'diversification'>;
  preferredRegions: string[];
  preferredAssetTypes: string[];
  
  // Auth state
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiry: Date | null;
  passwordResetToken: string | null;
  passwordResetExpiry: Date | null;
  
  // Onboarding
  onboardingCompleted: boolean;
  onboardingCompletedAt: Date | null;
  
  // Account state
  isActive: boolean;
  isSuspended: boolean;
  suspendedReason: string | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  
  // Notification preferences
  notificationPreferences: {
    emailInvestmentConfirmations: boolean;
    emailYieldAlerts: boolean;
    emailAiScoreUpdates: boolean;
    emailNewAssets: boolean;
    emailSecurityAlerts: boolean;
    inAppAll: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    
    // Wallet
    walletPublicKey: {
      type: String,
      default: null,
      sparse: true,
    },
    walletRegisteredAt: {
      type: Date,
      default: null,
    },
    walletRegistryTxSignature: {
      type: String,
      default: null,
    },
    
    // Investment preferences
    riskTolerance: {
      type: String,
      enum: ['conservative', 'balanced', 'aggressive'],
      default: 'balanced',
    },
    investmentGoals: [
      {
        type: String,
        enum: ['capital_growth', 'passive_income', 'diversification'],
      },
    ],
    preferredRegions: [{ type: String }],
    preferredAssetTypes: [{ type: String }],
    
    // Auth state
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    
    // Onboarding
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingCompletedAt: {
      type: Date,
      default: null,
    },
    
    // Account state
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendedReason: {
      type: String,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginIp: {
      type: String,
      default: null,
      select: false,
    },
    
    // Notification preferences
    notificationPreferences: {
      emailInvestmentConfirmations: { type: Boolean, default: true },
      emailYieldAlerts: { type: Boolean, default: true },
      emailAiScoreUpdates: { type: Boolean, default: false },
      emailNewAssets: { type: Boolean, default: true },
      emailSecurityAlerts: { type: Boolean, default: true },
      inAppAll: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ walletPublicKey: 1 }, { sparse: true });
UserSchema.index({ country: 1 });
UserSchema.index({ createdAt: -1 });

export const User = models.User || model<IUser>('User', UserSchema);

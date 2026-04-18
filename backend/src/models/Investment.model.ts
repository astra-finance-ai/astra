import { Schema, model, Document } from 'mongoose';

export interface IInvestment extends Document {
  user: Schema.Types.ObjectId;
  asset: Schema.Types.ObjectId;
  amountUsd: number;
  amountOnChain: number;
  currency: 'usdc' | 'sol';
  solUsdPriceAtInvestment?: number;
  txSignature: string;
  positionTokens: number;
  investorPositionPda: string;
  walletPublicKey: string;
  status: 'pending' | 'confirmed' | 'failed' | 'withdrawn';
  confirmedAt?: Date;
  lockExpiresAt: Date;
  isLocked: boolean;
  totalYieldEarnedUsd: number;
  totalYieldClaimedUsd: number;
  lastYieldClaimAt?: Date;
  lastYieldClaimTxSignature?: string;
}

const InvestmentSchema = new Schema<IInvestment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    amountUsd: { type: Number, required: true },
    amountOnChain: { type: Number, required: true },
    currency: { type: String, enum: ['usdc', 'sol'], required: true },
    solUsdPriceAtInvestment: { type: Number, default: null },
    txSignature: { type: String, required: true, unique: true },
    positionTokens: { type: Number, required: true },
    investorPositionPda: { type: String, required: true },
    walletPublicKey: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'withdrawn'],
      default: 'pending',
    },
    confirmedAt: { type: Date, default: null },
    lockExpiresAt: { type: Date, required: true },
    isLocked: { type: Boolean, default: true },
    totalYieldEarnedUsd: { type: Number, default: 0 },
    totalYieldClaimedUsd: { type: Number, default: 0 },
    lastYieldClaimAt: { type: Date, default: null },
    lastYieldClaimTxSignature: { type: String, default: null },
  },
  { timestamps: true }
);

InvestmentSchema.index({ user: 1, asset: 1 });
InvestmentSchema.index({ user: 1, status: 1 });
InvestmentSchema.index({ asset: 1, status: 1 });
InvestmentSchema.index({ txSignature: 1 }, { unique: true });
InvestmentSchema.index({ lockExpiresAt: 1 });

export const Investment = model<IInvestment>('Investment', InvestmentSchema);

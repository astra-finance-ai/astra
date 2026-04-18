import mongoose from 'mongoose';

const AIDeepDiveSchema = new mongoose.Schema({
  assetId: { type: String, required: true },
  userId: { type: String, required: true },
  summary: { type: String, required: true },
  riskBreakdown: [{
    category: String,
    score: Number,
    explanation: String
  }],
  yieldAnalysis: String,
  regionalContext: String,
  investorFitScore: Number,
  investorFitReason: String,
  comparableAssets: [String],
  macroDataSnapshot: mongoose.Schema.Types.Mixed,
  newsHeadlinesUsed: [String],
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

AIDeepDiveSchema.index({ assetId: 1, userId: 1 });
AIDeepDiveSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AIDeepDiveModel = mongoose.model('AIDeepDive', AIDeepDiveSchema);

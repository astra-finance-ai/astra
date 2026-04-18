import mongoose from 'mongoose';

const AIScoreSchema = new mongoose.Schema({
  assetId: { type: String, required: true },
  userId: { type: String, default: null },
  riskScore: { type: Number, required: true, min: 1, max: 10 },
  roiPrediction: { type: Number, required: true },
  confidenceScore: { type: Number, required: true, min: 0, max: 1 },
  reasoning: { type: String, required: true },
  whyInvest: [{ type: String }],
  warnings: [{ type: String }],
  marketContext: { type: String },
  toolsUsed: [{ type: String }],
  enrichmentSources: [{ type: String }],
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  version: { type: Number, default: 1 }
});

AIScoreSchema.index({ assetId: 1, userId: 1 });
AIScoreSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AIScoreModel = mongoose.model('AIScore', AIScoreSchema);

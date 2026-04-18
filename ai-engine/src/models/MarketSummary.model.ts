import mongoose from 'mongoose';

const MarketSummarySchema = new mongoose.Schema({
  region: { type: String, required: true },
  summary: { type: String, required: true },
  keyIndicators: [{
    label: String,
    value: String,
    trend: { type: String, enum: ['up', 'down', 'stable'] }
  }],
  trendingAssetIds: [String],
  newsHeadlinesUsed: [String],
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

MarketSummarySchema.index({ region: 1 });
MarketSummarySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const MarketSummaryModel = mongoose.model('MarketSummary', MarketSummarySchema);

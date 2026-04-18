import mongoose from 'mongoose';

const ChatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  conversationId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    assetContext: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ChatHistorySchema.index({ userId: 1, conversationId: 1 });
ChatHistorySchema.index({ createdAt: -1 });

export const ChatHistoryModel = mongoose.model('ChatHistory', ChatHistorySchema);

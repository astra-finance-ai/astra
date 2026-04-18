import { Schema, model, Document } from 'mongoose';

export type NotificationType =
  | 'investment_confirmed'
  | 'yield_available'
  | 'yield_claimed'
  | 'ai_score_updated'
  | 'new_asset_listed'
  | 'security_alert'
  | 'lock_period_expiring'
  | 'position_withdrawn'
  | 'system_update';

export interface INotification extends Document {
  user: Schema.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'investment_confirmed',
        'yield_available',
        'yield_claimed',
        'ai_score_updated',
        'new_asset_listed',
        'security_alert',
        'lock_period_expiring',
        'position_withdrawn',
        'system_update',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: null },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 day TTL

export const Notification = model<INotification>('Notification', NotificationSchema);

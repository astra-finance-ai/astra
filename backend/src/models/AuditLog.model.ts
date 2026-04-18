import { Schema, model, Document } from 'mongoose';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface IAuditLog extends Document {
  actor: Schema.Types.ObjectId;
  actorModel: 'User' | 'AdminUser';
  actorEmail: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: any;
  ipAddress: string;
  userAgent?: string;
  severity: AuditSeverity;
  flagged: boolean;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, refPath: 'actorModel', required: true },
    actorModel: { type: String, enum: ['User', 'AdminUser'], required: true },
    actorEmail: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, default: null },
    resourceId: { type: String, default: null },
    details: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, default: null },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AuditLogSchema.index({ actor: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ flagged: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);

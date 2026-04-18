import { Schema, model, Document } from 'mongoose';

export type AdminRole = 'super_admin' | 'asset_manager' | 'analyst';

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  role: AdminRole;
  totpSecret?: string;
  isTotpEnabled: boolean;
  totpEnabledAt?: Date;
  isActive: boolean;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdBy?: Schema.Types.ObjectId;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'asset_manager', 'analyst'],
      required: true,
    },
    totpSecret: { type: String, default: null, select: false },
    isTotpEnabled: { type: Boolean, default: false },
    totpEnabledAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: null, select: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  { timestamps: true }
);

export const AdminUser = model<IAdminUser>('AdminUser', AdminUserSchema);

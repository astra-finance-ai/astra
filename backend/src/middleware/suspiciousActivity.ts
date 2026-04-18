import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog.model';

export const detectSuspiciousActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || 'unknown';
  const userId = req.user?._id?.toString();

  // Pattern 1: Multiple failed logins from same IP would be tracked in auth controller
  // This middleware runs on successful requests to flag anomalies
  
  // Pattern 2: Investment from new device/IP
  if (req.path.includes('/invest') && userId) {
    const user = req.user;
    if (user && user.lastLoginIp && user.lastLoginIp !== ip) {
      // Log suspicious activity
      await AuditLog.create({
        actor: userId,
        actorModel: 'User',
        actorEmail: user.email,
        action: 'security.investment_from_new_ip',
        ipAddress: ip,
        userAgent: req.headers['user-agent'] || null,
        severity: 'info',
        flagged: false
      });
      
      // In a real implementation, we'd trigger a notification here
      console.log(`Security alert: Investment from new IP ${ip} for user ${userId}`);
    }
  }

  next();
};

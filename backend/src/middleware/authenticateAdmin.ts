import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { AdminUser } from '../models/AdminUser.model';
import { AdminJwtPayload } from '../types/api.types';

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as AdminJwtPayload;
    const admin = await AdminUser.findById(decoded.adminId);
    
    if (!admin || !admin.isActive || !admin.isTotpEnabled) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired admin token' });
  }
};

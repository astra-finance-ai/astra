import { Request, Response, NextFunction } from 'express';

type Role = 'super_admin' | 'asset_manager' | 'analyst';

const rolePermissions: Record<Role, string[]> = {
  super_admin: ['*'],
  asset_manager: [
    'asset.read', 'asset.create', 'asset.update', 'asset.publish',
    'pool.read', 'pool.initialize', 'pool.pause',
    'yield.read', 'yield.record',
    'user.read'
  ],
  analyst: [
    'asset.read', 'pool.read', 'yield.read',
    'user.read', 'analytics.read'
  ]
};

export const authorize = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.admin?.role as Role;
    if (!role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    if (role === 'super_admin') {
      return next();
    }
    
    const allowed = rolePermissions[role] || [];
    const hasPermission = permissions.every(p => allowed.includes(p));
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

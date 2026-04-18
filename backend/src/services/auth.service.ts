import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis';
import { User } from '../models/User.model';

export const authService = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  generateAccessToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email, role: 'user' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
  },

  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' }
    );
  },

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    const tokenHash = await bcrypt.hash(token, 10);
    const key = `refresh_token:${userId}`;
    // Store with 30 day expiry
    await redisClient.setEx(key, 30 * 24 * 60 * 60, tokenHash);
  },

  async verifyRefreshToken(token: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const key = `refresh_token:${decoded.userId}`;
      const storedHash = await redisClient.get(key);
      
      if (!storedHash) {
        return null;
      }

      const isValid = await bcrypt.compare(token, storedHash);
      return isValid ? decoded.userId : null;
    } catch {
      return null;
    }
  },

  async rotateRefreshToken(userId: string, oldToken: string, newToken: string): Promise<void> {
    await this.invalidateRefreshToken(oldToken);
    await this.storeRefreshToken(userId, newToken);
  },

  async invalidateRefreshToken(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const key = `refresh_token:${decoded.userId}`;
      await redisClient.del(key);
    } catch {
      // Token invalid, ignore
    }
  },

  async invalidateAllRefreshTokens(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await redisClient.del(key);
  },

  async createUser(data: any) {
    const passwordHash = await this.hashPassword(data.password);
    
    const user = await User.create({
      ...data,
      passwordHash
    });

    return user;
  }
};

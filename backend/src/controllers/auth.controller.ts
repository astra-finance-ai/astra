import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { authService } from '../services/auth.service';
import { emailService } from '../services/email.service';
import { AuditLog } from '../models/AuditLog.model';

export const authController = {
  async signUp(req: Request, res: Response) {
    try {
      const { email, password, fullName, country } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await authService.createUser({
        email,
        password,
        fullName,
        country,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry
      });

      // Send verification email
      await emailService.sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        message: 'Check your email to verify your account'
      });
    } catch (error: any) {
      throw error;
    }
  },

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Verification token is required' });
      }

      const user = await User.findOne({
        emailVerificationToken: token as string,
        emailVerificationExpiry: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpiry = null;
      await user.save();

      res.json({ message: 'Email verified. You can now sign in.' });
    } catch (error: any) {
      throw error;
    }
  },

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user with password hash
      const user = await User.findOne({ email }).select('+passwordHash');
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(401).json({ error: 'Please verify your email before signing in' });
      }

      // Check if user is suspended
      if (user.isSuspended) {
        return res.status(401).json({ error: 'Account suspended. Contact support.' });
      }

      // Verify password
      const isPasswordValid = await authService.verifyPassword(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      user.lastLoginAt = new Date();
      user.lastLoginIp = req.ip || 'unknown';
      await user.save();

      // Generate tokens
      const accessToken = authService.generateAccessToken(user._id.toString(), user.email);
      const refreshToken = authService.generateRefreshToken(user._id.toString());

      // Store refresh token in Redis
      await authService.storeRefreshToken(user._id.toString(), refreshToken);

      // Log audit
      await AuditLog.create({
        actor: user._id,
        actorModel: 'User',
        actorEmail: user.email,
        action: 'auth.sign_in',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || null,
        severity: 'info'
      });

      // Return safe user object
      const { passwordHash, ...safeUser } = user.toObject();

      res.json({
        accessToken,
        refreshToken,
        user: safeUser
      });
    } catch (error: any) {
      throw error;
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      // Verify refresh token and get user ID
      const userId = await authService.verifyRefreshToken(refreshToken);
      
      if (!userId) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }

      // Generate new access token
      const user = await User.findById(userId);
      if (!user || !user.isActive || user.isSuspended) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const newAccessToken = authService.generateAccessToken(user._id.toString(), user.email);
      const newRefreshToken = authService.generateRefreshToken(user._id.toString());

      // Rotate refresh token
      await authService.rotateRefreshToken(userId.toString(), refreshToken, newRefreshToken);

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error: any) {
      throw error;
    }
  },

  async signOut(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await authService.invalidateRefreshToken(refreshToken);
      }

      res.json({ message: 'Signed out' });
    } catch (error: any) {
      throw error;
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Always return success to prevent email enumeration
      const user = await User.findOne({ email });
      
      if (user && user.isActive && !user.isSuspended) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.passwordResetToken = resetToken;
        user.passwordResetExpiry = resetExpiry;
        await user.save();

        await emailService.sendPasswordResetEmail(email, resetToken);
      }

      res.json({ message: 'If that email exists, a reset link was sent' });
    } catch (error: any) {
      throw error;
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpiry: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Hash new password
      const passwordHash = await authService.hashPassword(password);
      
      user.passwordHash = passwordHash;
      user.passwordResetToken = null;
      user.passwordResetExpiry = null;
      await user.save();

      // Invalidate all refresh tokens for this user
      await authService.invalidateAllRefreshTokens(user._id.toString());

      res.json({ message: 'Password updated. Please sign in.' });
    } catch (error: any) {
      throw error;
    }
  }
};

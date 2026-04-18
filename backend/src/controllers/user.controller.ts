import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { storageService } from '../services/storage.service';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      const user = req.user;
      res.json({ user });
    } catch (error: any) {
      throw error;
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const { fullName, country } = req.body;
      const user = req.user;

      if (fullName) user.fullName = fullName;
      if (country) user.country = country;

      await user.save();

      res.json({ user });
    } catch (error: any) {
      throw error;
    }
  },

  async updatePreferences(req: Request, res: Response) {
    try {
      const { riskTolerance, investmentGoals, preferredRegions, preferredAssetTypes } = req.body;
      const user = req.user;

      if (riskTolerance) user.riskTolerance = riskTolerance;
      if (investmentGoals) user.investmentGoals = investmentGoals;
      if (preferredRegions) user.preferredRegions = preferredRegions;
      if (preferredAssetTypes) user.preferredAssetTypes = preferredAssetTypes;

      await user.save();

      res.json({ user, message: 'Preferences updated' });
    } catch (error: any) {
      throw error;
    }
  },

  async updateNotificationPrefs(req: Request, res: Response) {
    try {
      const { notificationPreferences } = req.body;
      const user = req.user;

      if (notificationPreferences) {
        user.notificationPreferences = {
          ...user.notificationPreferences,
          ...notificationPreferences
        };
      }

      await user.save();

      res.json({ user, message: 'Notification preferences updated' });
    } catch (error: any) {
      throw error;
    }
  },

  async uploadAvatar(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const user = req.user;
      const avatarUrl = await storageService.uploadUserAvatar(user._id.toString(), req.file);

      user.avatarUrl = avatarUrl;
      await user.save();

      res.json({ user, message: 'Avatar uploaded successfully' });
    } catch (error: any) {
      throw error;
    }
  },

  async deleteAccount(req: Request, res: Response) {
    try {
      const user = req.user;
      
      // Soft delete
      user.isActive = false;
      await user.save();

      res.json({ message: 'Account deleted successfully' });
    } catch (error: any) {
      throw error;
    }
  }
};

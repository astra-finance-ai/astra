import { Notification, INotification } from '../models/Notification.model';
import { EmailService } from './email.service';
import { User } from '../models/User.model';

export type NotificationType = INotification['type'];

interface NotifyParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  sendEmail?: boolean;
}

export class NotificationService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async notify(params: NotifyParams): Promise<void> {
    const { userId, type, title, message, data, sendEmail = false } = params;

    // Create notification in MongoDB
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data: data || null,
    });

    // Send email if requested and user preferences allow
    if (sendEmail) {
      const user = await User.findById(userId).select(
        'email notificationPreferences'
      );

      if (user && this.shouldSendEmail(user, type)) {
        await this.emailService.sendNotificationEmail(user.email, {
          title,
          message,
          type,
          data,
        });

        await Notification.findByIdAndUpdate(notification._id, {
          emailSent: true,
          emailSentAt: new Date(),
        });
      }
    }
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ user: userId }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ user: userId, isRead: false });
  }

  async markAsRead(userId: string, notificationId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async deleteNotification(userId: string, notificationId: string) {
    const result = await Notification.deleteOne({
      _id: notificationId,
      user: userId,
    });
    return result.deletedCount > 0;
  }

  // Specific notification methods
  async notifyInvestmentConfirmed(userId: string, investment: any): Promise<void> {
    await this.notify({
      userId,
      type: 'investment_confirmed',
      title: 'Investment Confirmed',
      message: `Your investment of $${investment.amountUsd} has been confirmed.`,
      data: { investmentId: investment._id, assetId: investment.asset },
      sendEmail: true,
    });
  }

  async notifyYieldAvailable(investors: string[], assetId: string, amount: number): Promise<void> {
    for (const userId of investors) {
      await this.notify({
        userId,
        type: 'yield_available',
        title: 'Yield Available to Claim',
        message: `You have yield available to claim from your investment.`,
        data: { assetId, amount },
        sendEmail: true,
      });
    }
  }

  async notifyAiScoreUpdated(assetId: string, investors: string[]): Promise<void> {
    for (const userId of investors) {
      await this.notify({
        userId,
        type: 'ai_score_updated',
        title: 'AI Score Updated',
        message: 'The AI score for one of your assets has been updated.',
        data: { assetId },
        sendEmail: false,
      });
    }
  }

  async notifyNewAssetListed(asset: any, interestedUsers: string[]): Promise<void> {
    for (const userId of interestedUsers) {
      await this.notify({
        userId,
        type: 'new_asset_listed',
        title: 'New Investment Opportunity',
        message: `A new asset "${asset.name}" matching your preferences is now available.`,
        data: { assetId: asset._id, assetName: asset.name },
        sendEmail: true,
      });
    }
  }

  async notifyLockPeriodExpiring(investment: any): Promise<void> {
    await this.notify({
      userId: investment.user.toString(),
      type: 'lock_period_expiring',
      title: 'Lock Period Expiring Soon',
      message: 'Your investment lock period will expire in 14 days.',
      data: { investmentId: investment._id, assetId: investment.asset },
      sendEmail: true,
    });
  }

  async notifySecurityAlert(userId: string, detail: string): Promise<void> {
    await this.notify({
      userId,
      type: 'security_alert',
      title: 'Security Alert',
      message: detail,
      sendEmail: true, // Always send email for security alerts
    });
  }

  private shouldSendEmail(user: any, type: NotificationType): boolean {
    const prefs = user.notificationPreferences;
    if (!prefs) return true;

    switch (type) {
      case 'investment_confirmed':
        return prefs.emailInvestmentConfirmations ?? true;
      case 'yield_available':
      case 'yield_claimed':
        return prefs.emailYieldAlerts ?? true;
      case 'ai_score_updated':
        return prefs.emailAiScoreUpdates ?? false;
      case 'new_asset_listed':
        return prefs.emailNewAssets ?? true;
      case 'security_alert':
        return prefs.emailSecurityAlerts ?? true;
      default:
        return true;
    }
  }
}

export const notificationService = new NotificationService();

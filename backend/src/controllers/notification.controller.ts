import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // GET /api/notifications - Get user's notifications
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.notificationService.getUserNotifications(
        userId,
        page,
        limit
      );

      res.json({
        success: true,
        data: result.notifications,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/notifications/unread-count - Get unread count
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const count = await this.notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/notifications/:id/read - Mark as read
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const notificationId = req.params.id;

      const notification = await this.notificationService.markAsRead(
        userId,
        notificationId
      );

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/notifications/read-all - Mark all as read
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      await this.notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/notifications/:id - Delete notification
  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const notificationId = req.params.id;

      const deleted = await this.notificationService.deleteNotification(
        userId,
        notificationId
      );

      if (!deleted) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({
        success: true,
        message: 'Notification deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();

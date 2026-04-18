import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { userController } from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);
router.patch('/me/preferences', userController.updatePreferences);
router.patch('/me/notification-prefs', userController.updateNotificationPrefs);
router.post('/me/avatar', userController.uploadAvatar);
router.delete('/me', userController.deleteAccount);

export const userRoutes = router;

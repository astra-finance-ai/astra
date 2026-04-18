import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { authLimiter } from '../middleware/rateLimiter';
import { authSchemas } from '../schemas/auth.schema';

const router = Router();

// Public routes
router.post('/sign-up', authLimiter, validateRequest(authSchemas.signUp), authController.signUp);
router.get('/verify-email', authLimiter, authController.verifyEmail);
router.post('/sign-in', authLimiter, validateRequest(authSchemas.signIn), authController.signIn);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/sign-out', authLimiter, authController.signOut);
router.post('/forgot-password', authLimiter, validateRequest(authSchemas.forgotPassword), authController.forgotPassword);
router.post('/reset-password', authLimiter, validateRequest(authSchemas.resetPassword), authController.resetPassword);

export const authRoutes = router;

import { z } from 'zod';

export const authSchemas = {
  signUp: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(2, 'Full name is required').max(100),
    country: z.string().min(2, 'Country is required')
  }),

  signIn: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  }),

  forgotPassword: z.object({
    email: z.string().email('Invalid email address')
  }),

  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  }),

  verifyEmail: z.object({
    token: z.string().min(1, 'Verification token is required')
  })
};

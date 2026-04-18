import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@astra.finance';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Astra';

export const emailService = {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const msg = {
      to: email,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: 'Verify Your Email - Astra',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 8px;">
              <h1 style="color: #fbbf24;">Welcome to Astra</h1>
              <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #fbbf24; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">Verify Email</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #94a3b8;">${verificationUrl}</p>
              <p style="color: #94a3b8; font-size: 14px;">This link will expire in 24 hours.</p>
              <hr style="border-color: #334155; margin: 20px 0;">
              <p style="color: #94a3b8; font-size: 12px;">© 2024 Astra Finance. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    };

    await sgMail.send(msg);
  },

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const msg = {
      to: email,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: 'Reset Your Password - Astra',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 8px;">
              <h1 style="color: #fbbf24;">Reset Your Password</h1>
              <p>You requested to reset your password. Click the button below to proceed:</p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #fbbf24; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #94a3b8;">${resetUrl}</p>
              <p style="color: #94a3b8; font-size: 14px;">This link will expire in 1 hour.</p>
              <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, please ignore this email.</p>
              <hr style="border-color: #334155; margin: 20px 0;">
              <p style="color: #94a3b8; font-size: 12px;">© 2024 Astra Finance. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    };

    await sgMail.send(msg);
  },

  async sendNotificationEmail(
    email: string,
    notification: { title: string; message: string; type: string; data?: any }
  ): Promise<void> {
    const msg = {
      to: email,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: `${notification.title} - Astra`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 8px;">
              <h1 style="color: #fbbf24;">${notification.title}</h1>
              <p>${notification.message}</p>
              <hr style="border-color: #334155; margin: 20px 0;">
              <p style="color: #94a3b8; font-size: 12px;">© 2024 Astra Finance. All rights reserved.</p>
            </div>
          </body>
        </html>
      `
    };

    await sgMail.send(msg);
  }
};

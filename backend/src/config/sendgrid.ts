import nodemailer from 'nodemailer';
import { env } from './env';

export const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: env.SENDGRID_API_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SendGrid verification failed:', error);
  } else {
    console.log('✅ SendGrid ready to send emails');
  }
});

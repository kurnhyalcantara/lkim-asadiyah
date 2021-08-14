import * as admin from 'firebase-admin';
import { scheduleWrite, sessionsWrite, pengurusWrite } from './generate-sessions-pengurus-schedule';
import { mailchimpSubscribe } from './mailchimp-subscribe';
import { sendGeneralNotification } from './notifications';
import { optimizeImages } from './optimize-images';
import { prerender } from './prerender';
import { scheduleNotifications } from './schedule-notifications';

// TODO: Update `tsconfig.json`
// - "noImplicitReturns": true,
// - "strict": true,

admin.initializeApp();

export {
  sendGeneralNotification,
  scheduleNotifications,
  optimizeImages,
  mailchimpSubscribe,
  prerender,
  scheduleWrite,
  sessionsWrite,
  pengurusWrite,
};

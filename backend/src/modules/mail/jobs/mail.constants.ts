export const MAIL_QUEUE = 'mail';

export enum MailJob {
  EmailVerification = 'email-verification',
  Welcome = 'welcome',
  PasswordReset = 'password-reset',
}

export interface MailJobData {
  to: string;
  name: string;
  token?: string;
}

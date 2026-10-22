import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MAIL_QUEUE, MailJob, MailJobData } from './mail.constants';

@Injectable()
export class MailQueue {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly queue: Queue<MailJobData>) {}

  async sendEmailVerification(to: string, name: string, token: string) {
    await this.queue.add(MailJob.EmailVerification, { to, name, token });
  }

  async sendWelcome(to: string, name: string) {
    await this.queue.add(MailJob.Welcome, { to, name });
  }

  async sendPasswordReset(to: string, name: string, token: string) {
    await this.queue.add(MailJob.PasswordReset, { to, name, token });
  }
}

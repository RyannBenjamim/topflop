import { BadRequestException, Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { MailService } from '../mail.service';
import { MAIL_QUEUE, MailJob, MailJobData } from './mail.constants';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailJobData>): Promise<void> {
    const { to, name, token } = job.data;

    try {
      switch (job.name as MailJob) {
        case MailJob.EmailVerification:
          await this.mailService.sendEmailVerification(to, name, token!);
          break;
        case MailJob.Welcome:
          await this.mailService.sendWelcome(to, name);
          break;
        case MailJob.PasswordReset:
          await this.mailService.sendPasswordReset(to, name, token!);
          break;
        default:
          throw new UnrecoverableError(`Unknown e-mail type: ${job.name}`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw new UnrecoverableError(error.message);
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<MailJobData>, error: Error) {
    this.logger.warn(`E-mail "${job.name}" to ${job.data.to} failed (attempt ${job.attemptsMade}): ${error.message}`);
  }
}

import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AUTH_TOKENS_QUEUE, CLEANUP_EXPIRED_TOKENS_JOB } from './auth-tokens.constants';

@Processor(AUTH_TOKENS_QUEUE)
export class AuthTokensProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(AuthTokensProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(AUTH_TOKENS_QUEUE) private readonly queue: Queue,
  ) {
    super();
  }

  async onModuleInit() {
    await this.queue.upsertJobScheduler(
      CLEANUP_EXPIRED_TOKENS_JOB,
      { pattern: '0 3 * * *' },
      { name: CLEANUP_EXPIRED_TOKENS_JOB },
    );
  }

  async process(): Promise<{ verification: number; passwordReset: number }> {
    const now = new Date();

    const [verification, passwordReset] = await this.prisma.$transaction([
      this.prisma.emailVerificationToken.deleteMany({ where: { expiresAt: { lt: now } } }),
      this.prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    ]);

    this.logger.log(`Expired tokens removed: ${verification.count} verification, ${passwordReset.count} password reset.`);

    return { verification: verification.count, passwordReset: passwordReset.count };
  }
}

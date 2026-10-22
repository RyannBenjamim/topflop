import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue, UnrecoverableError } from 'bullmq';
import { NotificationsService } from '../notifications.service';
import { NOTIFICATIONS_QUEUE, NotificationJob, NotificationJobData } from './notifications.constants';

@Processor(NOTIFICATIONS_QUEUE)
export class NotificationsProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectQueue(NOTIFICATIONS_QUEUE) private readonly queue: Queue<NotificationJobData>,
  ) {
    super();
  }

  async onModuleInit() {
    await this.queue.upsertJobScheduler(
      NotificationJob.CleanupRead,
      { pattern: '30 3 * * *' },
      { name: NotificationJob.CleanupRead },
    );
  }

  async process(job: Job<NotificationJobData>): Promise<unknown> {
    const { actorId, recipientId, reviewId, commentId } = job.data;

    switch (job.name as NotificationJob) {
      case NotificationJob.Follow:
        return this.notificationsService.notifyFollow(actorId!, recipientId!);
      case NotificationJob.ReviewLike:
        return this.notificationsService.notifyReviewLike(actorId!, reviewId!);
      case NotificationJob.CommentLike:
        return this.notificationsService.notifyCommentLike(actorId!, commentId!);
      case NotificationJob.ReviewComment:
        return this.notificationsService.notifyReviewComment(commentId!);
      case NotificationJob.NewReview:
        return this.notificationsService.notifyNewReview(reviewId!);
      case NotificationJob.CleanupRead: {
        const count = await this.notificationsService.removeOldRead();
        this.logger.log(`Old read notifications removed: ${count}.`);
        return count;
      }
      default:
        throw new UnrecoverableError(`Unknown notification type: ${job.name}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<NotificationJobData>, error: Error) {
    this.logger.warn(`Notification "${job.name}" failed (attempt ${job.attemptsMade}): ${error.message}`);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATIONS_QUEUE, NotificationJob, NotificationJobData } from './notifications.constants';

@Injectable()
export class NotificationsQueue {
  private readonly logger = new Logger(NotificationsQueue.name);

  constructor(@InjectQueue(NOTIFICATIONS_QUEUE) private readonly queue: Queue<NotificationJobData>) {}

  follow(actorId: string, recipientId: string) {
    this.enqueue(NotificationJob.Follow, { actorId, recipientId });
  }

  reviewLike(actorId: string, reviewId: string) {
    this.enqueue(NotificationJob.ReviewLike, { actorId, reviewId });
  }

  commentLike(actorId: string, commentId: string) {
    this.enqueue(NotificationJob.CommentLike, { actorId, commentId });
  }

  reviewComment(commentId: string) {
    this.enqueue(NotificationJob.ReviewComment, { commentId });
  }

  newReview(reviewId: string) {
    this.enqueue(NotificationJob.NewReview, { reviewId });
  }

  private enqueue(name: NotificationJob, data: NotificationJobData) {
    this.queue.add(name, data).catch((error: Error) => {
      this.logger.warn(`Notification "${name}" could not be queued: ${error.message}`);
    });
  }
}

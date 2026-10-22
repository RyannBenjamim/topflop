export const NOTIFICATIONS_QUEUE = 'notifications';

export enum NotificationJob {
  Follow = 'follow',
  ReviewLike = 'review-like',
  CommentLike = 'comment-like',
  ReviewComment = 'review-comment',
  NewReview = 'new-review',
  CleanupRead = 'cleanup-read',
}

export interface NotificationJobData {
  actorId?: string;
  recipientId?: string;
  reviewId?: string;
  commentId?: string;
}

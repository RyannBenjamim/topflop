import type { UserSummary } from './users';

export type NotificationType = 'FOLLOW' | 'REVIEW_LIKE' | 'REVIEW_COMMENT' | 'COMMENT_LIKE' | 'NEW_REVIEW';

export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actor: UserSummary;
  review: {
    id: string;
    title: string;
    movieTmdbId: number;
  } | null;
  comment: {
    id: string;
    excerpt: string;
  } | null;
}

export interface UnreadCount {
  count: number;
}

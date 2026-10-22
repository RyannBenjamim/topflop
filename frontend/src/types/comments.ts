import type { UserSummary } from './users';

export interface Comment {
  id: string;
  content: string;
  reviewId: string;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
}

export interface CreateComment {
  content: string;
  reviewId: string;
}

export type UpdateComment = Partial<CreateComment>;

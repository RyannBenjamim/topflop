import type { UserSummary } from './users';

export interface Like {
  createdAt: string;
  user: UserSummary;
}

export interface LikeStatus {
  isLiked: boolean;
}

export interface ToggleLike {
  targetId: string;
}

export interface ActionResult {
  success: boolean;
}

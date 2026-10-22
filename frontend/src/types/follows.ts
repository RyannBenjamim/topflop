import type { UserSummary } from './users';

export interface Follower {
  createdAt: string;
  follower: UserSummary;
}

export interface Following {
  createdAt: string;
  following: UserSummary;
}

export interface FollowStatus {
  isFollowing: boolean;
}

export interface FollowAction {
  followingId: string;
}

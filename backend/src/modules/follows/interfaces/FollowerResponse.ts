import { UserSummary } from "../../users/interfaces/UserSummary";

export interface FollowerResponse {
  createdAt: string;
  follower: UserSummary;
}
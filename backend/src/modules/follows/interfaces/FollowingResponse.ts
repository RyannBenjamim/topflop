import { UserSummary } from "../../users/interfaces/UserSummary";

export interface FollowingResponse {
  createdAt: string;
  following: UserSummary;
}
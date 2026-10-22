import { UserSummary } from "../../users/interfaces/UserSummary";

export interface LikeResponse {
  createdAt: string;
  user: UserSummary;
}
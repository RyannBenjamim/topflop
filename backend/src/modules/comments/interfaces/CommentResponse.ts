import { UserSummary } from "../../users/interfaces/UserSummary";

export interface CommentResponse {
  id: string;
  content: string;
  reviewId: string;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
}
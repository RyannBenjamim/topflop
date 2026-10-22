import { NotificationType } from "@prisma/client";
import { UserSummary } from "../../users/interfaces/UserSummary";

export interface NotificationResponse {
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

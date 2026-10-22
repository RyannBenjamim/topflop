import { NotificationFromPrisma } from "../prisma/notifications.types";
import { NotificationResponse } from "../interfaces/NotificationResponse";

const EXCERPT_LENGTH = 120;

const toExcerpt = (content: string): string => {
  const text = content.replace(/\s+/g, " ").trim();
  return text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;
};

export class NotificationMapper {
  static toResponse(notification: NotificationFromPrisma): NotificationResponse {
    return {
      id: notification.id,
      type: notification.type,
      read: notification.readAt !== null,
      createdAt: notification.createdAt.toISOString(),
      actor: {
        id: notification.actor.id,
        username: notification.actor.username,
        email: notification.actor.email,
        name: notification.actor.name,
      },
      review: notification.review,
      comment: notification.comment
        ? { id: notification.comment.id, excerpt: toExcerpt(notification.comment.content) }
        : null,
    };
  }
}

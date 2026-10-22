import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationType, Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { notificationResponseSelect } from "./prisma/notifications.selects";
import { NotificationFromPrisma } from "./prisma/notifications.types";

const LIST_LIMIT = 50;
const READ_RETENTION_DAYS = 90;

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByRecipient(recipientId: string): Promise<NotificationFromPrisma[]> {
    return this.prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: "desc" },
      take: LIST_LIMIT,
      select: notificationResponseSelect,
    });
  }

  async countUnread(recipientId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { recipientId, readAt: null },
    });
  }

  async markAsRead(id: string, recipientId: string): Promise<NotificationFromPrisma> {
    const notification = await this.prisma.notification.findFirst({
      where: { id, recipientId },
      select: notificationResponseSelect,
    });

    if (!notification) {
      throw new NotFoundException("Notification not found.");
    }

    if (notification.readAt) return notification;

    return this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
      select: notificationResponseSelect,
    });
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    const { count } = await this.prisma.notification.updateMany({
      where: { recipientId, readAt: null },
      data: { readAt: new Date() },
    });

    return count;
  }

  async notifyFollow(followerId: string, followingId: string): Promise<void> {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (!follow) return;

    await this.createOnce({
      type: NotificationType.FOLLOW,
      recipientId: followingId,
      actorId: followerId,
    });
  }

  async notifyReviewLike(userId: string, reviewId: string): Promise<void> {
    const like = await this.prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
      select: { review: { select: { authorId: true } } },
    });
    if (!like) return;

    await this.createOnce({
      type: NotificationType.REVIEW_LIKE,
      recipientId: like.review.authorId,
      actorId: userId,
      reviewId,
    });
  }

  async notifyCommentLike(userId: string, commentId: string): Promise<void> {
    const like = await this.prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
      select: { comment: { select: { userId: true, reviewId: true } } },
    });
    if (!like) return;

    await this.createOnce({
      type: NotificationType.COMMENT_LIKE,
      recipientId: like.comment.userId,
      actorId: userId,
      reviewId: like.comment.reviewId,
      commentId,
    });
  }

  async notifyReviewComment(commentId: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, reviewId: true, review: { select: { authorId: true } } },
    });
    if (!comment || comment.userId === comment.review.authorId) return;

    await this.prisma.notification.create({
      data: {
        type: NotificationType.REVIEW_COMMENT,
        recipientId: comment.review.authorId,
        actorId: comment.userId,
        reviewId: comment.reviewId,
        commentId,
      },
    });
  }

  async notifyNewReview(reviewId: string): Promise<number> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { authorId: true },
    });
    if (!review) return 0;

    const followers = await this.prisma.follow.findMany({
      where: { followingId: review.authorId },
      select: { followerId: true },
    });

    const { count } = await this.prisma.notification.createMany({
      data: followers.map(({ followerId }) => ({
        type: NotificationType.NEW_REVIEW,
        recipientId: followerId,
        actorId: review.authorId,
        reviewId,
      })),
    });

    return count;
  }

  async removeOldRead(): Promise<number> {
    const limit = new Date(Date.now() - READ_RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const { count } = await this.prisma.notification.deleteMany({
      where: { readAt: { lt: limit } },
    });

    return count;
  }

  private async createOnce(data: Prisma.NotificationUncheckedCreateInput): Promise<void> {
    if (data.recipientId === data.actorId) return;

    const existing = await this.prisma.notification.findFirst({
      where: {
        type: data.type,
        recipientId: data.recipientId,
        actorId: data.actorId,
        reviewId: data.reviewId ?? null,
        commentId: data.commentId ?? null,
      },
      select: { id: true },
    });
    if (existing) return;

    await this.prisma.notification.create({ data });
  }
}

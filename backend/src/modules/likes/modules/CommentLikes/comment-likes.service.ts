import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma.service";
import { commentLikeResponseSelect } from "./prisma/comment-likes.selects";
import { CommentLikeFromPrisma } from "./prisma/comment-likes.types";
import { NotificationsQueue } from "../../../notifications/jobs/notifications.queue";

@Injectable()
export class CommentLikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsQueue: NotificationsQueue
  ) {}

  async like(userId: string, commentId: string): Promise<{ success: boolean }> {
    await this.prisma.commentLike.upsert({
      where: {
        userId_commentId: { userId, commentId },
      },
      update: {}, 
      create: { userId, commentId },
    });

    this.notificationsQueue.commentLike(userId, commentId);

    return { success: true };
  }

  async unlike(userId: string, commentId: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.commentLike.delete({
        where: {
          userId_commentId: { userId, commentId },
        },
      });
      return { success: true };
    } catch {
      throw new NotFoundException("You haven't liked this comment yet.");
    }
  }

  async findManyByComment(commentId: string): Promise<CommentLikeFromPrisma[]> {
    return this.prisma.commentLike.findMany({
      where: { commentId },
      orderBy: { createdAt: "desc" },
      select: commentLikeResponseSelect,
    });
  }

  async checkLikeStatus(userId: string, commentId: string): Promise<boolean> {
    const like = await this.prisma.commentLike.findUnique({
      where: {
        userId_commentId: { userId, commentId },
      },
    });
    return !!like;
  }
}
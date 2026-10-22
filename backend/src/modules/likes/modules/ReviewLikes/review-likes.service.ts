import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma.service";
import { reviewLikeResponseSelect } from "./prisma/review-likes.selects";
import { ReviewLikeFromPrisma } from "./prisma/review-likes.types";
import { NotificationsQueue } from "../../../notifications/jobs/notifications.queue";

@Injectable()
export class ReviewLikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsQueue: NotificationsQueue
  ) {}

  async like(userId: string, reviewId: string): Promise<{ success: boolean }> {
    await this.prisma.reviewLike.upsert({
      where: {
        userId_reviewId: { userId, reviewId },
      },
      update: {}, 
      create: { userId, reviewId },
    });

    this.notificationsQueue.reviewLike(userId, reviewId);

    return { success: true };
  }

  async unlike(userId: string, reviewId: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.reviewLike.delete({
        where: {
          userId_reviewId: { userId, reviewId },
        },
      });
      return { success: true };
    } catch {
      throw new NotFoundException("You haven't liked this review yet.");
    }
  }

  async findManyByReview(reviewId: string): Promise<ReviewLikeFromPrisma[]> {
    return this.prisma.reviewLike.findMany({
      where: { reviewId },
      orderBy: { createdAt: "desc" },
      select: reviewLikeResponseSelect,
    });
  }

  async checkLikeStatus(userId: string, reviewId: string): Promise<boolean> {
    const like = await this.prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: { userId, reviewId },
      },
    });
    return !!like;
  }
}
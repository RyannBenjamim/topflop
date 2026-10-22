import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { commentResponseSelect } from "./prisma/comments.selects";
import { CommentResponseFromPrisma } from "./prisma/comments.types";
import { NotificationsQueue } from "../notifications/jobs/notifications.queue";

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsQueue: NotificationsQueue
  ) {}

  async create(
    userId: string,
    createCommentDto: CreateCommentDto
  ): Promise<CommentResponseFromPrisma> {
    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        reviewId: createCommentDto.reviewId,
        userId: userId,
      },
      select: commentResponseSelect,
    });

    this.notificationsQueue.reviewComment(comment.id);

    return comment;
  }

  async findManyByReview(reviewId: string): Promise<CommentResponseFromPrisma[]> {
    return this.prisma.comment.findMany({
      where: { reviewId },
      orderBy: { createdAt: "asc" },
      select: commentResponseSelect,
    });
  }

  async update(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto
  ): Promise<CommentResponseFromPrisma> {
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
    });

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can only update your own comments.");
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content: updateCommentDto.content },
      select: commentResponseSelect,
    });
  }

  async remove(commentId: string, userId: string): Promise<CommentResponseFromPrisma> {
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
    });

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can only delete your own comments.");
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
      select: commentResponseSelect,
    });
  }
}
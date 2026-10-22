import { CommentResponseFromPrisma } from "../prisma/comments.types";
import { CommentResponse } from "../interfaces/CommentResponse";

export class CommentMapper {
  static toResponse(comment: CommentResponseFromPrisma): CommentResponse {
    return {
      id: comment.id,
      content: comment.content,
      reviewId: comment.reviewId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      user: {
        id: comment.user.id,
        username: comment.user.username,
        email: comment.user.email,
        name: comment.user.name,
      },
    };
  }
}
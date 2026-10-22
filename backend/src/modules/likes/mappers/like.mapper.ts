import { ReviewLikeFromPrisma } from "../modules/ReviewLikes/prisma/review-likes.types";
import { LikeResponse } from "../interfaces/LikeResponse";

export class LikeMapper {
  static toResponse(data: ReviewLikeFromPrisma): LikeResponse {
    return {
      createdAt: data.createdAt.toISOString(),
      user: {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        name: data.user.name,
      },
    };
  }
}
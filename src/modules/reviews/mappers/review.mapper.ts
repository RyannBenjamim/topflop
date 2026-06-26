import { Review } from "@prisma/client";

import { ReviewResponse } from "../interfaces/ReviewResponse";
import { ReviewSummary } from "../interfaces/ReviewSummary";

export class ReviewMapper {

  static toResponse(
    review: Review
  ): ReviewResponse {
    return {
      id: review.id,
      title: review.title,
      content: review.content,
      topPercentage: review.topPercentage,
      authorId: review.authorId,
      movieTmdbId: review.movieTmdbId,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  static toSummary(
    review: Pick<Review, "id" | "title" | "topPercentage" | "authorId" | "movieTmdbId">
  ): ReviewSummary {

    return {
      id: review.id,
      title: review.title,
      topPercentage: review.topPercentage,
      authorId: review.authorId,
      movieTmdbId: review.movieTmdbId,
    };
  }
}
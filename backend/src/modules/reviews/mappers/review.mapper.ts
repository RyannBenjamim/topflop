import { Review } from "@prisma/client";

import { ReviewResponse } from "../interfaces/ReviewResponse";
import { ReviewSummary } from "../interfaces/ReviewSummary";

const EXCERPT_LENGTH = 200;

const toExcerpt = (content: string): string => {
  const text = content.replace(/\s+/g, " ").trim();
  return text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;
};

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
    review: Pick<Review, "id" | "title" | "content" | "topPercentage" | "authorId" | "movieTmdbId" | "createdAt">
  ): ReviewSummary {

    return {
      id: review.id,
      title: review.title,
      excerpt: toExcerpt(review.content),
      topPercentage: review.topPercentage,
      authorId: review.authorId,
      movieTmdbId: review.movieTmdbId,
      createdAt: review.createdAt.toISOString(),
    };
  }
}
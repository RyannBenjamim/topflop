import { Movie } from "@prisma/client";
import { MovieResponse } from "../interfaces/MovieResponse";

export class MovieMapper {
  static toResponse(user: Movie): MovieResponse {
    return {
      tmdbId: user.tmdbId,
      reviewCount: user.reviewCount,
      topSum: user.topSum,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
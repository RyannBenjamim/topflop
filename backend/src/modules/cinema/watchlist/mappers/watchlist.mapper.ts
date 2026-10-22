import { Watchlist } from "@prisma/client";
import { WatchlistResponse } from "../interfaces/WatchlistResponse";

export class WatchlistMapper {
  static toResponse(watchlist: Watchlist): WatchlistResponse {
    return {
      userId: watchlist.userId,
      movieTmdbId: watchlist.movieTmdbId,
      createdAt: watchlist.createdAt.toISOString(),
    };
  }
}
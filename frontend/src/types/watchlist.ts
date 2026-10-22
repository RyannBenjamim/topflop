export interface WatchlistItem {
  userId: string;
  movieTmdbId: number;
  createdAt: string;
}

export interface AddToWatchlist {
  movieTmdbId: number;
}

import type { ApiResponse } from "../../types/ApiResponse";
import type { WatchlistItem } from "../../types/watchlist";
import { genericRequest } from "../../utils/genericRequest";

export function add(movieTmdbId: number) {
  return genericRequest<ApiResponse<WatchlistItem>>('/watchlist', 'POST', { movieTmdbId });
}

export function findAllByUser(userId: string) {
  return genericRequest<ApiResponse<WatchlistItem[]>>(`/watchlist/user/${userId}`, 'GET');
}

export function remove(movieTmdbId: number) {
  return genericRequest<ApiResponse<WatchlistItem>>(`/watchlist/movie/${movieTmdbId}`, 'DELETE');
}

import type { ApiResponse } from "../../types/ApiResponse";
import type { Movie } from "../../types/movies";
import { genericRequest } from "../../utils/genericRequest";

export function findOne(tmdbId: number) {
  return genericRequest<ApiResponse<Movie>>(`/movies/${tmdbId}`, 'GET');
}

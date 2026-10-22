import type { ApiResponse } from "../types/ApiResponse";
import type { CreateReview, Review, ReviewSummary, UpdateReview } from "../types/reviews";
import { genericRequest } from "../utils/genericRequest";

export function create(data: CreateReview) {
  return genericRequest<ApiResponse<Review>>('/reviews', 'POST', data);
}

export function findAll() {
  return genericRequest<ApiResponse<ReviewSummary[]>>('/reviews', 'GET');
}

export function findOne(id: string) {
  return genericRequest<ApiResponse<Review>>(`/reviews/${id}`, 'GET');
}

export function findByMovie(tmdbId: number) {
  return genericRequest<ApiResponse<ReviewSummary[]>>(`/reviews/movie/${tmdbId}`, 'GET');
}

export function findByAuthor(userId: string) {
  return genericRequest<ApiResponse<ReviewSummary[]>>(`/reviews/user/${userId}`, 'GET');
}

export function update(id: string, data: UpdateReview) {
  return genericRequest<ApiResponse<Review>>(`/reviews/${id}`, 'PATCH', data);
}

export function remove(id: string) {
  return genericRequest<ApiResponse<Review>>(`/reviews/${id}`, 'DELETE');
}

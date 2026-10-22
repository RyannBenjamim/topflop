import type { ApiResponse } from "../types/ApiResponse";
import type { Comment, CreateComment } from "../types/comments";
import { genericRequest } from "../utils/genericRequest";

export function create(data: CreateComment) {
  return genericRequest<ApiResponse<Comment>>('/comments', 'POST', data);
}

export function findManyByReview(reviewId: string) {
  return genericRequest<ApiResponse<Comment[]>>(`/comments/review/${reviewId}`, 'GET');
}

export function update(id: string, content: string) {
  return genericRequest<ApiResponse<Comment>>(`/comments/${id}`, 'PATCH', { content });
}

export function remove(id: string) {
  return genericRequest<ApiResponse<Comment>>(`/comments/${id}`, 'DELETE');
}

import type { ApiResponse } from "../../types/ApiResponse";
import type { ActionResult, Like, LikeStatus } from "../../types/likes";
import { genericRequest } from "../../utils/genericRequest";

export function like(reviewId: string) {
  return genericRequest<ApiResponse<ActionResult>>('/review-likes', 'POST', { targetId: reviewId });
}

export function unlike(reviewId: string) {
  return genericRequest<ApiResponse<ActionResult>>(`/review-likes/${reviewId}`, 'DELETE');
}

export function findManyByReview(reviewId: string) {
  return genericRequest<ApiResponse<Like[]>>(`/review-likes/review/${reviewId}`, 'GET');
}

export function checkStatus(reviewId: string) {
  return genericRequest<ApiResponse<LikeStatus>>(`/review-likes/status/${reviewId}`, 'GET');
}

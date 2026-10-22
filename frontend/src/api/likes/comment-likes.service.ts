import type { ApiResponse } from "../../types/ApiResponse";
import type { ActionResult, Like, LikeStatus } from "../../types/likes";
import { genericRequest } from "../../utils/genericRequest";

export function like(commentId: string) {
  return genericRequest<ApiResponse<ActionResult>>('/comment-likes', 'POST', { targetId: commentId });
}

export function unlike(commentId: string) {
  return genericRequest<ApiResponse<ActionResult>>(`/comment-likes/${commentId}`, 'DELETE');
}

export function findManyByComment(commentId: string) {
  return genericRequest<ApiResponse<Like[]>>(`/comment-likes/comment/${commentId}`, 'GET');
}

export function checkStatus(commentId: string) {
  return genericRequest<ApiResponse<LikeStatus>>(`/comment-likes/status/${commentId}`, 'GET');
}

import type { ApiResponse } from "../types/ApiResponse";
import type { Follower, Following, FollowStatus } from "../types/follows";
import type { ActionResult } from "../types/likes";
import { genericRequest } from "../utils/genericRequest";

export function follow(userId: string) {
  return genericRequest<ApiResponse<ActionResult>>('/follows', 'POST', { followingId: userId });
}

export function unfollow(userId: string) {
  return genericRequest<ApiResponse<ActionResult>>(`/follows/${userId}`, 'DELETE');
}

export function getFollowers(userId: string) {
  return genericRequest<ApiResponse<Follower[]>>(`/follows/followers/${userId}`, 'GET');
}

export function getFollowing(userId: string) {
  return genericRequest<ApiResponse<Following[]>>(`/follows/following/${userId}`, 'GET');
}

export function checkStatus(userId: string) {
  return genericRequest<ApiResponse<FollowStatus>>(`/follows/status/${userId}`, 'GET');
}

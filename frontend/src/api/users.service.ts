import type { ApiResponse } from "../types/ApiResponse";
import type { User, UserProfilePicture, UserSummary } from "../types/users";
import { genericRequest } from "../utils/genericRequest";

export function findAll() {
  return genericRequest<ApiResponse<UserSummary[]>>('/users', 'GET');
}

export function findOne(id: string) {
  return genericRequest<ApiResponse<User>>(`/users/${id}`, 'GET');
}

export function getProfilePicture(id: string) {
  return genericRequest<ApiResponse<UserProfilePicture>>(`/users/${id}`, 'GET');
}

export function updateUsername(username: string) {
  return genericRequest<ApiResponse<{ username: string }>>('/users/username', 'PATCH', { username });
}

export function updateName(name: string) {
  return genericRequest<ApiResponse<{ name: string | null }>>('/users/name', 'PATCH', { name });
}

export function updateBio(bio: string) {
  return genericRequest<ApiResponse<{ bio: string | null }>>('/users/bio', 'PATCH', { bio });
}

export function remove(id: string) {
  return genericRequest<ApiResponse<User>>(`/users/${id}`, 'DELETE');
}

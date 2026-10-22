import type { ApiResponse } from "../types/ApiResponse";
import type { Notification, UnreadCount } from "../types/notifications";
import { genericRequest } from "../utils/genericRequest";

export function findAll() {
  return genericRequest<ApiResponse<Notification[]>>('/notifications', 'GET');
}

export function getUnreadCount() {
  return genericRequest<ApiResponse<UnreadCount>>('/notifications/unread-count', 'GET');
}

export function markAsRead(id: string) {
  return genericRequest<ApiResponse<Notification>>(`/notifications/${id}/read`, 'PATCH');
}

export function markAllAsRead() {
  return genericRequest<ApiResponse<UnreadCount>>('/notifications/read-all', 'PATCH');
}

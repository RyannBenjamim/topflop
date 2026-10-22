import type { ApiResponse } from "../../types/ApiResponse";
import type { Highlight, UpsertHighlight } from "../../types/highlights";
import { genericRequest } from "../../utils/genericRequest";

export function upsertCurrentYear(data: UpsertHighlight) {
  return genericRequest<ApiResponse<Highlight>>('/highlights', 'PUT', data);
}

export function findAllByUser(userId: string) {
  return genericRequest<ApiResponse<Highlight[]>>(`/highlights/user/${userId}`, 'GET');
}

export function findByUserAndYear(userId: string, year: number) {
  return genericRequest<ApiResponse<Highlight>>(`/highlights/user/${userId}/year/${year}`, 'GET');
}

export function removeCurrentYear() {
  return genericRequest<ApiResponse<Highlight>>('/highlights', 'DELETE');
}

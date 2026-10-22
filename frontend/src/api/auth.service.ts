import type { ApiMessage } from "../types/ApiResponse";
import type { RegisterDto, SigninResponse } from "../types/auth";
import type { User } from "../types/users";
import { genericRequest } from "../utils/genericRequest";

export function signin(email: string, password: string) {
  return genericRequest<SigninResponse>('/auth/signin', 'POST', { email, password });
}

export function register(data: RegisterDto) {
  return genericRequest<User>('/auth/register', 'POST', data);
}

export function verifyEmail(token: string) {
  const params = new URLSearchParams({ token });
  return genericRequest<ApiMessage>(`/auth/verify-email?${params.toString()}`, 'GET');
}

export function resendVerification(email: string) {
  return genericRequest<ApiMessage>('/auth/resend-verification', 'POST', { email });
}

export function forgotPassword(email: string) {
  return genericRequest<ApiMessage>('/auth/forgot-password', 'POST', { email });
}

export function resetPassword(token: string, password: string) {
  return genericRequest<ApiMessage>('/auth/reset-password', 'POST', { token, password });
}

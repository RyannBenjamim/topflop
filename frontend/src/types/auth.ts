import type { UserRole } from './users'

export type JwtPayload = {
  id: string
  role: UserRole
  exp?: number
}

export interface SigninDto {
  email: string;
  password: string;
}

export interface SigninResponse {
  access_token: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  name: string;
}

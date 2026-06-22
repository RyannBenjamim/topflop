import { UserRole } from "@prisma/client";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  name: string | null;
  bio: string | null;
  email_verified: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
import { User } from "@prisma/client";
import { UserResponse } from "../interfaces/UserResponse";
import { UserSummary } from "../interfaces/UserSummary";

export class UserMapper {
  static toResponse(
    user: Omit<User, 'password' | 'avatarUrl' | 'avatarPath'>
  ): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      email_verified: user.emailVerified,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  static toSummary(
    user: Pick<User, "id" | "username" | "email" | "name">
  ): UserSummary {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name
    };
  }
}
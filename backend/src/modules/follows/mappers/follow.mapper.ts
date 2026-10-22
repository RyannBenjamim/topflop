import { FollowerFromPrisma, FollowingFromPrisma } from "../prisma/follows.types";
import { FollowerResponse } from "../interfaces/FollowerResponse";
import { FollowingResponse } from "../interfaces/FollowingResponse";

export class FollowMapper {
  static toFollowerResponse(data: FollowerFromPrisma): FollowerResponse {
    return {
      createdAt: data.createdAt.toISOString(),
      follower: {
        id: data.follower.id,
        username: data.follower.username,
        email: data.follower.email,
        name: data.follower.name,
      },
    };
  }

  static toFollowingResponse(data: FollowingFromPrisma): FollowingResponse {
    return {
      createdAt: data.createdAt.toISOString(),
      following: {
        id: data.following.id,
        username: data.following.username,
        email: data.following.email,
        name: data.following.name,
      },
    };
  }
}
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { followerSelect, followingSelect } from "./prisma/follows.selects";
import { FollowerFromPrisma, FollowingFromPrisma } from "./prisma/follows.types";
import { NotificationsQueue } from "../notifications/jobs/notifications.queue";

@Injectable()
export class FollowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsQueue: NotificationsQueue
  ) {}

  async follow(followerId: string, followingId: string): Promise<{ success: boolean }> {
    if (followerId === followingId) {
      throw new BadRequestException("You cannot follow yourself.");
    }

    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId, followingId },
      },
      update: {},
      create: { followerId, followingId },
    });

    this.notificationsQueue.follow(followerId, followingId);

    return { success: true };
  }

  async unfollow(followerId: string, followingId: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      });
      return { success: true };
    } catch {
      throw new NotFoundException("You are not following this user.");
    }
  }

  async getFollowers(userId: string): Promise<FollowerFromPrisma[]> {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: "desc" },
      select: followerSelect,
    });
  }

  async getFollowing(userId: string): Promise<FollowingFromPrisma[]> {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: "desc" },
      select: followingSelect,
    });
  }

  async checkFollowStatus(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    return !!follow;
  }
}
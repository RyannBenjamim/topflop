import { Prisma } from "@prisma/client";
import { userSummarySelect } from "../../users/prisma/users.selects";

export const followerSelect = 
  Prisma.validator<Prisma.FollowSelect>()({
    createdAt: true,
    follower: {
      select: userSummarySelect,
    },
});

export const followingSelect = 
  Prisma.validator<Prisma.FollowSelect>()({
    createdAt: true,
    following: {
      select: userSummarySelect,
    },
});
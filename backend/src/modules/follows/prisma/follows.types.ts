import { Prisma } from "@prisma/client";
import { followerSelect, followingSelect } from "./follows.selects";

export type FollowerFromPrisma = Prisma.FollowGetPayload<{
  select: typeof followerSelect;
}>;

export type FollowingFromPrisma = Prisma.FollowGetPayload<{
  select: typeof followingSelect;
}>;
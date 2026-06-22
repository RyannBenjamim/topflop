import { Prisma } from "@prisma/client";

import {
  userResponseSelect,
  userSummarySelect,
  profilePictureSelect
} from "./users.selects";

export type UserResponseFromPrisma =
  Prisma.UserGetPayload<{
    select: typeof userResponseSelect;
  }>;

export type UserSummaryFromPrisma =
  Prisma.UserGetPayload<{
    select: typeof userSummarySelect;
  }>;

export type ProfilePictureFromPrisma =
  Prisma.UserGetPayload<{
    select: typeof profilePictureSelect;
  }>;
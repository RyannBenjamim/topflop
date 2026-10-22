import { Prisma } from "@prisma/client";

import {
  userResponseWithPasswordSelect,
  userResponseSelect,
  userSummarySelect,
  profilePictureSelect
} from "./users.selects";

export type UserResponseWithPasswordFromPrisma =
  Prisma.UserGetPayload<{
    select: typeof userResponseWithPasswordSelect;
  }>;

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
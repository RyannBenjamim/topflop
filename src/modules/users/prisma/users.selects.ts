import { Prisma } from "@prisma/client";

export const userResponseSelect =
  Prisma.validator<Prisma.UserSelect>()({
    id: true,
    username: true,
    email: true,
    name: true,
    bio: true,
    emailVerified: true,
    role: true,
    createdAt: true,
    updatedAt: true,
});

export const userSummarySelect =
  Prisma.validator<Prisma.UserSelect>()({
    id: true,
    username: true,
    email: true,
    name: true,
});

export const profilePictureSelect =
  Prisma.validator<Prisma.UserSelect>()({
    avatarUrl: true,
    avatarPath: true,
});
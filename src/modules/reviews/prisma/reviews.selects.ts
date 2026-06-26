import { Prisma } from "@prisma/client";

export const reviewResponseSelect =
  Prisma.validator<Prisma.ReviewSelect>()({
    id: true,
    title: true,
    content: true,
    topPercentage: true,
    authorId: true,
    movieTmdbId: true,
    createdAt: true,
    updatedAt: true,
});

export const reviewSummarySelect =
  Prisma.validator<Prisma.ReviewSelect>()({
    id: true,
    title: true,
    topPercentage: true,
    authorId: true,
    movieTmdbId: true,
});
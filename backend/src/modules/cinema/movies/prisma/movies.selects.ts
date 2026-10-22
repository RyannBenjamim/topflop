import { Prisma } from "@prisma/client";

export const movieResponseSelect =
  Prisma.validator<Prisma.MovieSelect>()({
    tmdbId: true,
    reviewCount: true,
    topSum: true,
    createdAt: true,
    updatedAt: true,
});

export const movieMetricsSelect =
  Prisma.validator<Prisma.MovieSelect>()({
    reviewCount: true,
    topSum: true,
});
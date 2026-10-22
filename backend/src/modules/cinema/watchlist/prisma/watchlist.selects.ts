import { Prisma } from "@prisma/client";

export const watchlistResponseSelect =
  Prisma.validator<Prisma.WatchlistSelect>()({
    userId: true,
    movieTmdbId: true,
    createdAt: true,
  });
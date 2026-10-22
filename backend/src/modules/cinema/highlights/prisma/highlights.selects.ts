import { Prisma } from "@prisma/client";

export const highlightResponseSelect =
  Prisma.validator<Prisma.AnnualHighlightSelect>()({
    id: true,
    userId: true,
    year: true,
    topMovieId: true,
    flopMovieId: true,
    createdAt: true,
    updatedAt: true,
  });
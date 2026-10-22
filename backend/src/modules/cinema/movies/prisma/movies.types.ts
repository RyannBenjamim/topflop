import { Prisma } from "@prisma/client";

import {
  movieResponseSelect,
  movieMetricsSelect
} from "./movies.selects";

export type MovieResponseFromPrisma =
  Prisma.MovieGetPayload<{
    select: typeof movieResponseSelect;
  }>;

export type MovieMetricsFromPrisma =
  Prisma.MovieGetPayload<{
    select: typeof movieMetricsSelect;
  }>;
import { Prisma } from "@prisma/client";
import { watchlistResponseSelect } from "./watchlist.selects";

export type WatchlistResponseFromPrisma =
  Prisma.WatchlistGetPayload<{
    select: typeof watchlistResponseSelect;
  }>;
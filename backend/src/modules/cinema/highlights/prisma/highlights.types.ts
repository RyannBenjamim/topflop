import { Prisma } from "@prisma/client";
import { highlightResponseSelect } from "./highlights.selects";

export type HighlightResponseFromPrisma =
  Prisma.AnnualHighlightGetPayload<{
    select: typeof highlightResponseSelect;
  }>;
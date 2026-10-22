import { Prisma } from "@prisma/client";

import {
  reviewResponseSelect,
  reviewSummarySelect
}
from "./reviews.selects";

export type ReviewResponseFromPrisma =
  Prisma.ReviewGetPayload<{
    select: typeof reviewResponseSelect
  }>;

export type ReviewSummaryFromPrisma =
  Prisma.ReviewGetPayload<{
    select: typeof reviewSummarySelect
  }>;
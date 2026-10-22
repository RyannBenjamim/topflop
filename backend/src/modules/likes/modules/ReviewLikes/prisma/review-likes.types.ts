import { Prisma } from "@prisma/client";
import { reviewLikeResponseSelect } from "./review-likes.selects";

export type ReviewLikeFromPrisma = Prisma.ReviewLikeGetPayload<{
  select: typeof reviewLikeResponseSelect;
}>;
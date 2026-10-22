import { Prisma } from "@prisma/client";
import { userSummarySelect } from "../../../../users/prisma/users.selects";

export const reviewLikeResponseSelect =
  Prisma.validator<Prisma.ReviewLikeSelect>()({
    createdAt: true,
    user: {
      select: userSummarySelect,
    },
});
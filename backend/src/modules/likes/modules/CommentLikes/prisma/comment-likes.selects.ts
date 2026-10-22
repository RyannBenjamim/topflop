import { Prisma } from "@prisma/client";
import { userSummarySelect } from "../../../../users/prisma/users.selects";

export const commentLikeResponseSelect =
  Prisma.validator<Prisma.CommentLikeSelect>()({
    createdAt: true,
    user: {
      select: userSummarySelect,
    },
});
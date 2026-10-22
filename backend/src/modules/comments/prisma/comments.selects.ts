import { Prisma } from "@prisma/client";
import { userSummarySelect } from "../../users/prisma/users.selects";

export const commentResponseSelect =
  Prisma.validator<Prisma.CommentSelect>()({
    id: true,
    content: true,
    reviewId: true,
    createdAt: true,
    updatedAt: true,
    user: {
      select: userSummarySelect,
    },
});
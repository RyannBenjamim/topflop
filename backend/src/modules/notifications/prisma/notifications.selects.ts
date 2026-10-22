import { Prisma } from "@prisma/client";
import { userSummarySelect } from "../../users/prisma/users.selects";

export const notificationResponseSelect =
  Prisma.validator<Prisma.NotificationSelect>()({
    id: true,
    type: true,
    readAt: true,
    createdAt: true,
    actor: {
      select: userSummarySelect,
    },
    review: {
      select: { id: true, title: true, movieTmdbId: true },
    },
    comment: {
      select: { id: true, content: true },
    },
});

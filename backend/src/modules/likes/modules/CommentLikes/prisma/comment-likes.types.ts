import { Prisma } from "@prisma/client";
import { commentLikeResponseSelect } from "./comment-likes.selects";

export type CommentLikeFromPrisma = Prisma.CommentLikeGetPayload<{
  select: typeof commentLikeResponseSelect;
}>;
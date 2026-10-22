import { Prisma } from "@prisma/client";
import { commentResponseSelect } from "./comments.selects";

export type CommentResponseFromPrisma =
  Prisma.CommentGetPayload<{
    select: typeof commentResponseSelect;
  }>;
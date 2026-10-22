import { Prisma } from "@prisma/client";
import { notificationResponseSelect } from "./notifications.selects";

export type NotificationFromPrisma = Prisma.NotificationGetPayload<{
  select: typeof notificationResponseSelect;
}>;

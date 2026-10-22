import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { NotificationsQueue } from "./jobs/notifications.queue";
import { NotificationsProcessor } from "./jobs/notifications.processor";
import { NOTIFICATIONS_QUEUE } from "./jobs/notifications.constants";

@Module({
  imports: [BullModule.registerQueue({ name: NOTIFICATIONS_QUEUE })],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsQueue, NotificationsProcessor],
  exports: [NotificationsQueue],
})
export class NotificationsModule {}

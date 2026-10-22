import { Module } from "@nestjs/common";
import { ReviewLikesController } from "./review-likes.controller";
import { ReviewLikesService } from "./review-likes.service";
import { NotificationsModule } from "../../../notifications/notifications.module";

@Module({
  imports: [NotificationsModule],
  controllers: [ReviewLikesController],
  providers: [ReviewLikesService],
  exports: [ReviewLikesService],
})
export class ReviewLikesModule {}
import { Module } from "@nestjs/common";
import { CommentLikesController } from "./comment-likes.controller";
import { CommentLikesService } from "./comment-likes.service";
import { NotificationsModule } from "../../../notifications/notifications.module";

@Module({
  imports: [NotificationsModule],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
  exports: [CommentLikesService],
})
export class CommentLikesModule {}
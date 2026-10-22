import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { MoviesModule } from "../cinema/movies/movies.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [MoviesModule, NotificationsModule],
  exports: [ReviewsService],
})
export class ReviewsModule {}
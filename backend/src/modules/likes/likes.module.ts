import { Module } from '@nestjs/common';
import { ReviewLikesModule } from './modules/ReviewLikes/review-likes.module';
import { CommentLikesModule } from './modules/CommentLikes/comment-likes.module';

@Module({
  imports: [
    ReviewLikesModule,
    CommentLikesModule
  ],
})
export class LikesModule {}
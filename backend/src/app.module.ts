import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MailModule } from './modules/mail/mail.module';
import { CinemaModule } from './modules/cinema/cinema.module';
import { FollowsModule } from './modules/follows/follows.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: { url: configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379' },
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MailModule,
    PrismaModule,
    ReviewsModule,
    CinemaModule,
    FollowsModule,
    CommentsModule,
    LikesModule,
    NotificationsModule
  ],
})
export class AppModule {}

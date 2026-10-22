import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { MovieMetricsQueue } from "./jobs/movie-metrics.queue";
import { MovieMetricsProcessor } from "./jobs/movie-metrics.processor";
import { MOVIE_METRICS_QUEUE } from "./jobs/movie-metrics.constants";

@Module({
  imports: [BullModule.registerQueue({ name: MOVIE_METRICS_QUEUE })],
  controllers: [MoviesController],
  providers: [MoviesService, MovieMetricsQueue, MovieMetricsProcessor],
  exports: [MoviesService, MovieMetricsQueue],
})
export class MoviesModule {}

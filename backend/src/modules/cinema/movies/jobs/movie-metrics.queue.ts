import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MOVIE_METRICS_QUEUE, MovieMetricsJobData, RECALCULATE_METRICS_JOB } from './movie-metrics.constants';

@Injectable()
export class MovieMetricsQueue {
  constructor(@InjectQueue(MOVIE_METRICS_QUEUE) private readonly queue: Queue<MovieMetricsJobData>) {}

  async recalculate(...tmdbIds: number[]) {
    const uniqueIds = [...new Set(tmdbIds)];

    await this.queue.addBulk(
      uniqueIds.map(tmdbId => ({ name: RECALCULATE_METRICS_JOB, data: { tmdbId } }))
    );
  }
}

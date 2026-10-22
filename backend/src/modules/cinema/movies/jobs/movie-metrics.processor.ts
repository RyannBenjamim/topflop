import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MoviesService } from '../movies.service';
import { MOVIE_METRICS_QUEUE, MovieMetricsJobData } from './movie-metrics.constants';

@Processor(MOVIE_METRICS_QUEUE)
export class MovieMetricsProcessor extends WorkerHost {
  constructor(private readonly moviesService: MoviesService) {
    super();
  }

  async process(job: Job<MovieMetricsJobData>) {
    return this.moviesService.recalculateMetrics(job.data.tmdbId);
  }
}

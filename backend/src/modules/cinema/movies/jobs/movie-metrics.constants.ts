export const MOVIE_METRICS_QUEUE = 'movie-metrics';

export const RECALCULATE_METRICS_JOB = 'recalculate';

export interface MovieMetricsJobData {
  tmdbId: number;
}

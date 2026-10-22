import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

import {
  reviewResponseSelect,
  reviewSummarySelect
} from "./prisma/reviews.selects";

import {
  ReviewResponseFromPrisma,
  ReviewSummaryFromPrisma
} from "./prisma/reviews.types";
import { MoviesService } from "../cinema/movies/movies.service";
import { MovieMetricsQueue } from "../cinema/movies/jobs/movie-metrics.queue";
import { NotificationsQueue } from "../notifications/jobs/notifications.queue";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moviesService: MoviesService,
    private readonly movieMetricsQueue: MovieMetricsQueue,
    private readonly notificationsQueue: NotificationsQueue
  ) {}

  async create(
    authorId: string,
    createReviewDto: CreateReviewDto
  ): Promise<ReviewResponseFromPrisma> {
    const review = await this.prisma.$transaction(async (tx) => {
      await this.moviesService.upsertMetrics(
        createReviewDto.movieTmdbId,
        createReviewDto.topPercentage,
        tx
      );

      return tx.review.create({
        data: {
          ...createReviewDto,
          authorId,
        },
        select: reviewResponseSelect,
      });
    });

    this.notificationsQueue.newReview(review.id);

    return review;
  }

  async findAll(): Promise<ReviewSummaryFromPrisma[]> {
    return this.prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      select: reviewSummarySelect,
    });
  }

  async findOne(id: string): Promise<ReviewResponseFromPrisma> {
    return this.prisma.review.findUniqueOrThrow({
      where: { id },
      select: reviewResponseSelect,
    });
  }

  async findByMovie(movieTmdbId: number): Promise<ReviewSummaryFromPrisma[]> {
    return this.prisma.review.findMany({
      where: { movieTmdbId },
      orderBy: { createdAt: "desc" },
      select: reviewSummarySelect,
    });
  }

  async findByAuthor(authorId: string): Promise<ReviewSummaryFromPrisma[]> {
    return this.prisma.review.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
      select: reviewSummarySelect,
    });
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto
  ): Promise<ReviewResponseFromPrisma> {
    const previous = await this.prisma.review.findUniqueOrThrow({
      where: { id },
      select: { movieTmdbId: true },
    });

    const review = await this.prisma.$transaction(async (tx) => {
      if (updateReviewDto.movieTmdbId !== undefined) {
        await this.moviesService.ensureExists(updateReviewDto.movieTmdbId, tx);
      }

      return tx.review.update({
        where: { id },
        data: updateReviewDto,
        select: reviewResponseSelect,
      });
    });

    if (updateReviewDto.topPercentage !== undefined || updateReviewDto.movieTmdbId !== undefined) {
      await this.movieMetricsQueue.recalculate(previous.movieTmdbId, review.movieTmdbId);
    }

    return review;
  }

  async remove(id: string): Promise<ReviewResponseFromPrisma> {
    const review = await this.prisma.review.delete({
      where: { id },
      select: reviewResponseSelect,
    });

    await this.movieMetricsQueue.recalculate(review.movieTmdbId);

    return review;
  }
}


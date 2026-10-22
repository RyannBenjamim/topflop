import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../database/prisma.service";

import { 
  movieResponseSelect, 
  movieMetricsSelect 
} from './prisma/movies.selects'

import {
  MovieResponseFromPrisma,
  MovieMetricsFromPrisma
} from './prisma/movies.types'

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMetrics(
    tmdbId: number,
    rating: number,
    client: Prisma.TransactionClient = this.prisma
  ): Promise<MovieMetricsFromPrisma> {
    return await client.movie.upsert({
      where: { tmdbId },
      update: {
        reviewCount: { increment: 1 },
        topSum: { increment: rating }
      },
      create: {
        tmdbId,
        reviewCount: 1,
        topSum: rating
      },
      select: movieMetricsSelect
    });
  }

  async ensureExists(
    tmdbId: number,
    client: Prisma.TransactionClient = this.prisma
  ): Promise<void> {
    await client.movie.upsert({
      where: { tmdbId },
      update: {},
      create: { tmdbId, reviewCount: 0, topSum: 0 },
    });
  }

  async recalculateMetrics(tmdbId: number): Promise<MovieMetricsFromPrisma> {
    const { _count, _sum } = await this.prisma.review.aggregate({
      where: { movieTmdbId: tmdbId },
      _count: true,
      _sum: { topPercentage: true },
    });

    return await this.prisma.movie.update({
      where: { tmdbId },
      data: {
        reviewCount: _count,
        topSum: _sum.topPercentage ?? 0,
      },
      select: movieMetricsSelect
    });
  }

  async findOne(tmdbId: number): Promise<MovieResponseFromPrisma> {
    return await this.prisma.movie.findUniqueOrThrow({ 
      where: { tmdbId },
      select: movieResponseSelect
    });
  }
}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service";
import { AddToWatchlistDto } from "./dto/add-to-watchlist.dto";
import { watchlistResponseSelect } from "./prisma/watchlist.selects";
import { WatchlistResponseFromPrisma } from "./prisma/watchlist.types";

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async add(
    userId: string,
    dto: AddToWatchlistDto
  ): Promise<WatchlistResponseFromPrisma> {
    return this.prisma.watchlist.create({
      data: {
        userId,
        movieTmdbId: dto.movieTmdbId,
      },
      select: watchlistResponseSelect,
    });
  }

  async findAllByUser(userId: string): Promise<WatchlistResponseFromPrisma[]> {
    return this.prisma.watchlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: watchlistResponseSelect,
    });
  }

  async remove(
    userId: string,
    movieTmdbId: number
  ): Promise<WatchlistResponseFromPrisma> {
    return this.prisma.watchlist.delete({
      where: {
        userId_movieTmdbId: {
          userId,
          movieTmdbId,
        },
      },
      select: watchlistResponseSelect,
    });
  }
}
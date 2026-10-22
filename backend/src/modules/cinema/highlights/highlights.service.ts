import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service";
import { CreateHighlightDto } from "./dto/create-highlight.dto";
import { highlightResponseSelect } from "./prisma/highlights.selects";
import { HighlightResponseFromPrisma } from "./prisma/highlights.types";

@Injectable()
export class HighlightsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertCurrentYear(
    userId: string,
    dto: CreateHighlightDto
  ): Promise<HighlightResponseFromPrisma> {
    const currentYear = new Date().getFullYear();

    return this.prisma.annualHighlight.upsert({
      where: {
        userId_year: {
          userId,
          year: currentYear,
        },
      },
      update: {
        topMovieId: dto.topMovieId ?? null,
        flopMovieId: dto.flopMovieId ?? null,
      },
      create: {
        userId,
        year: currentYear,
        topMovieId: dto.topMovieId ?? null,
        flopMovieId: dto.flopMovieId ?? null,
      },
      select: highlightResponseSelect,
    });
  }

  async findByUserAndYear(
    userId: string,
    year: number
  ): Promise<HighlightResponseFromPrisma> {
    return await this.prisma.annualHighlight.findUniqueOrThrow({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
      select: highlightResponseSelect,
    });
  }

  async findAllByUser(userId: string): Promise<HighlightResponseFromPrisma[]> {
    return this.prisma.annualHighlight.findMany({
      where: { userId },
      orderBy: { year: "desc" },
      select: highlightResponseSelect,
    });
  }

  async removeCurrentYear(userId: string): Promise<HighlightResponseFromPrisma> {
    const currentYear = new Date().getFullYear();

    return this.prisma.annualHighlight.delete({
      where: {
        userId_year: {
          userId,
          year: currentYear,
        },
      },
      select: highlightResponseSelect,
    });
  }
}
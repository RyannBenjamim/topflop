import { AnnualHighlight } from "@prisma/client";
import { HighlightResponse } from "../interfaces/HighlightResponse";

export class HighlightMapper {
  static toResponse(highlight: AnnualHighlight): HighlightResponse {
    return {
      id: highlight.id,
      userId: highlight.userId,
      year: highlight.year,
      topMovieId: highlight.topMovieId,
      flopMovieId: highlight.flopMovieId,
      createdAt: highlight.createdAt.toISOString(),
      updatedAt: highlight.updatedAt.toISOString(),
    };
  }
}
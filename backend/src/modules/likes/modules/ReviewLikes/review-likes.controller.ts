import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
} from "@nestjs/common";
import { ReviewLikesService } from "./review-likes.service";
import { ApiResponse } from "../../../../common/interfaces/ApiResponse";
import { ToggleLikeDto } from "../../dto/toggle-like.dto";
import { LikeResponse } from "../../interfaces/LikeResponse";
import { LikeStatusResponse } from "../../interfaces/LikeStatusResponse";
import { LikeMapper } from "../../mappers/like.mapper";
import type { AuthenticatedRequest } from "../../../../common/interfaces/AuthenticatedRequest";

@Controller("review-likes")
export class ReviewLikesController {
  constructor(private readonly reviewLikesService: ReviewLikesService) {}

  @Post()
  async like(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ToggleLikeDto
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.reviewLikesService.like(req.user.id, dto.targetId);
    return {
      message: "Review liked successfully.",
      data: result,
    };
  }

  @Delete(":reviewId")
  async unlike(
    @Request() req: AuthenticatedRequest,
    @Param("reviewId", ParseUUIDPipe) reviewId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.reviewLikesService.unlike(req.user.id, reviewId);
    return {
      message: "Review unliked successfully.",
      data: result,
    };
  }

  @Get("review/:reviewId")
  async findManyByReview(
    @Param("reviewId", ParseUUIDPipe) reviewId: string
  ): Promise<ApiResponse<LikeResponse[]>> {
    const likes = await this.reviewLikesService.findManyByReview(reviewId);
    return {
      message: "Review likes retrieved successfully.",
      data: likes.map(LikeMapper.toResponse),
    };
  }

  @Get("status/:reviewId")
  async checkLikeStatus(
    @Request() req: AuthenticatedRequest,
    @Param("reviewId", ParseUUIDPipe) reviewId: string
  ): Promise<ApiResponse<LikeStatusResponse>> {
    const isLiked = await this.reviewLikesService.checkLikeStatus(req.user.id, reviewId);
    return {
      message: "Like status checked successfully.",
      data: { isLiked },
    };
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from "@nestjs/common";
import { CommentLikesService } from "./comment-likes.service";
import { ApiResponse } from "../../../../common/interfaces/ApiResponse";
import { ToggleLikeDto } from "../../dto/toggle-like.dto";
import { LikeResponse } from "../../interfaces/LikeResponse";
import { LikeStatusResponse } from "../../interfaces/LikeStatusResponse";
import { LikeMapper } from "../../mappers/like.mapper";
import type { AuthenticatedRequest } from "../../../../common/interfaces/AuthenticatedRequest";

@Controller("comment-likes")
export class CommentLikesController {
  constructor(private readonly commentLikesService: CommentLikesService) {}

  @Post()
  async like(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ToggleLikeDto
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.commentLikesService.like(req.user.id, dto.targetId);
    return {
      message: "Comment liked successfully.",
      data: result,
    };
  }

  @Delete(":commentId")
  async unlike(
    @Request() req: AuthenticatedRequest,
    @Param("commentId") commentId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.commentLikesService.unlike(req.user.id, commentId);
    return {
      message: "Comment unliked successfully.",
      data: result,
    };
  }

  @Get("comment/:commentId")
  async findManyByComment(
    @Param("commentId") commentId: string
  ): Promise<ApiResponse<LikeResponse[]>> {
    const likes = await this.commentLikesService.findManyByComment(commentId);
    return {
      message: "Comment likes retrieved successfully.",
      data: likes.map(LikeMapper.toResponse),
    };
  }

  @Get("status/:commentId")
  async checkLikeStatus(
    @Request() req: AuthenticatedRequest,
    @Param("commentId") commentId: string
  ): Promise<ApiResponse<LikeStatusResponse>> {
    const isLiked = await this.commentLikesService.checkLikeStatus(req.user.id, commentId);
    return {
      message: "Like status checked successfully.",
      data: { isLiked },
    };
  }
}
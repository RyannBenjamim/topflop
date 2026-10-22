import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { ApiResponse } from "../../common/interfaces/ApiResponse";
import { CommentResponse } from "./interfaces/CommentResponse";
import { CommentMapper } from "./mappers/comment.mapper";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import type { AuthenticatedRequest } from "../../common/interfaces/AuthenticatedRequest";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto
  ): Promise<ApiResponse<CommentResponse>> {
    const comment = await this.commentsService.create(req.user.id, createCommentDto);
    return {
      message: "Comment successfully posted.",
      data: CommentMapper.toResponse(comment),
    };
  }

  @Get("review/:reviewId")
  async findManyByReview(
    @Param("reviewId", ParseUUIDPipe) reviewId: string
  ): Promise<ApiResponse<CommentResponse[]>> {
    const comments = await this.commentsService.findManyByReview(reviewId);
    return {
      message: "Comments retrieved successfully.",
      data: comments.map(CommentMapper.toResponse),
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<ApiResponse<CommentResponse>> {
    const updatedComment = await this.commentsService.update(
      id,
      req.user.id,
      updateCommentDto
    );
    return {
      message: "Comment successfully updated.",
      data: CommentMapper.toResponse(updatedComment),
    };
  }

  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest
  ): Promise<ApiResponse<CommentResponse>> {
    const deletedComment = await this.commentsService.remove(id, req.user.id);
    return {
      message: "Comment successfully deleted.",
      data: CommentMapper.toResponse(deletedComment),
    };
  }
}
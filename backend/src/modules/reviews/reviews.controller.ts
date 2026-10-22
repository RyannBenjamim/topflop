import { ReviewsService } from "./reviews.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
} from "@nestjs/common";
import { ApiResponse } from "../../common/interfaces/ApiResponse";
import { ReviewMapper } from "./mappers/review.mapper";
import { ReviewResponse } from "./interfaces/ReviewResponse";
import { ReviewSummary } from "./interfaces/ReviewSummary";
import type { AuthenticatedRequest } from "../../common/interfaces/AuthenticatedRequest";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService
  ) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createReviewDto: CreateReviewDto
  ): Promise<ApiResponse<ReviewResponse>> {
    const review = await this.reviewsService.create(
      req.user.id,
      createReviewDto
    );

    return {
      message: "Review successfully created.",
      data: ReviewMapper.toResponse(review),
    };
  }

  @Get()
  async findAll():
  Promise<ApiResponse<ReviewSummary[]>> {
    const reviews = await this.reviewsService.findAll();
    return {
      message: "Reviews listed successfully.",
      data: reviews.map(ReviewMapper.toSummary),
    };
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ApiResponse<ReviewResponse>> {
    const review = await this.reviewsService.findOne(id);
    return {
      message: "Review successfully searched.",
      data: ReviewMapper.toResponse(review),
    };
  }

  @Get("movie/:tmdbId")
  async findByMovie(
    @Param("tmdbId", ParseIntPipe) tmdbId: number
  ): Promise<ApiResponse<ReviewSummary[]>> {
    const reviews = await this.reviewsService.findByMovie(tmdbId);
    return {
      message: "Movie reviews successfully searched.",
      data: reviews.map(ReviewMapper.toSummary),
    };
  }

  @Get("user/:userId")
  async findByAuthor(
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ApiResponse<ReviewSummary[]>> {
    const reviews = await this.reviewsService.findByAuthor(userId);
    return {
      message: "User reviews successfully searched.",
      data: reviews.map(ReviewMapper.toSummary),
    };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto
  ): Promise<ApiResponse<ReviewResponse>> {
    const review = await this.reviewsService.update(
      id,
      updateReviewDto
    );

    return {
      message: "Review successfully updated.",
      data: ReviewMapper.toResponse(review),
    };
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ApiResponse<ReviewResponse>> {
    const review = await this.reviewsService.remove(id);
    return {
      message: "Review successfully deleted.",
      data: ReviewMapper.toResponse(review),
    };
  }
}

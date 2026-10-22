import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Put,
  Request,
} from "@nestjs/common";
import { HighlightsService } from "./highlights.service";
import { ApiResponse } from "../../../common/interfaces/ApiResponse";
import { HighlightResponse } from "./interfaces/HighlightResponse";
import { HighlightMapper } from "./mappers/highlight.mapper";
import { CreateHighlightDto } from "./dto/create-highlight.dto";
import type { AuthenticatedRequest } from "../../../common/interfaces/AuthenticatedRequest";

@Controller("highlights")
export class HighlightsController {
  constructor(private readonly highlightsService: HighlightsService) {}

  @Put()
  async upsert(
    @Request() req: AuthenticatedRequest,
    @Body() createHighlightDto: CreateHighlightDto
  ): Promise<ApiResponse<HighlightResponse>> {
    const highlight = await this.highlightsService.upsertCurrentYear(
      req.user.id,
      createHighlightDto
    );
    return {
      message: "Annual highlights updated successfully.",
      data: HighlightMapper.toResponse(highlight),
    };
  }

  @Get("user/:userId")
  async findAllByUser(
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ApiResponse<HighlightResponse[]>> {
    const highlights = await this.highlightsService.findAllByUser(userId);
    return {
      message: "User highlights listed successfully.",
      data: highlights.map(HighlightMapper.toResponse),
    };
  }

  @Get("user/:userId/year/:year")
  async findOne(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Param("year", ParseIntPipe) year: number
  ): Promise<ApiResponse<HighlightResponse>> {
    const highlight = await this.highlightsService.findByUserAndYear(userId, year);
    return {
      message: "Annual highlight successfully retrieved.",
      data: HighlightMapper.toResponse(highlight),
    };
  }

  @Delete()
  async remove(
    @Request() req: AuthenticatedRequest
  ): Promise<ApiResponse<HighlightResponse>> {
    const deletedHighlight = await this.highlightsService.removeCurrentYear(
      req.user.id
    );
    return {
      message: "Annual highlights successfully deleted for this year.",
      data: HighlightMapper.toResponse(deletedHighlight),
    };
  }
}
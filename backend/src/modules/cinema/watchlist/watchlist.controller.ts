import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Request,
} from "@nestjs/common";
import { WatchlistService } from "./watchlist.service";
import { ApiResponse } from "../../../common/interfaces/ApiResponse";
import { WatchlistResponse } from "./interfaces/WatchlistResponse";
import { WatchlistMapper } from "./mappers/watchlist.mapper";
import { AddToWatchlistDto } from "./dto/add-to-watchlist.dto";
import type { AuthenticatedRequest } from "../../../common/interfaces/AuthenticatedRequest";

@Controller("watchlist")
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  async add(
    @Request() req: AuthenticatedRequest,
    @Body() addToWatchlistDto: AddToWatchlistDto
  ): Promise<ApiResponse<WatchlistResponse>> {
    const watchlistItem = await this.watchlistService.add(
      req.user.id,
      addToWatchlistDto
    );
    return {
      message: "Movie successfully added to your watchlist.",
      data: WatchlistMapper.toResponse(watchlistItem),
    };
  }

  @Get("user/:userId")
  async findAllByUser(
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ApiResponse<WatchlistResponse[]>> {
    const watchlist = await this.watchlistService.findAllByUser(userId);
    return {
      message: "Watchlist items listed successfully.",
      data: watchlist.map(WatchlistMapper.toResponse),
    };
  }

  @Delete("movie/:movieTmdbId")
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param("movieTmdbId", ParseIntPipe) movieTmdbId: number
  ): Promise<ApiResponse<WatchlistResponse>> {
    const removedItem = await this.watchlistService.remove(
      req.user.id,
      movieTmdbId
    );
    return {
      message: "Movie successfully removed from your watchlist.",
      data: WatchlistMapper.toResponse(removedItem),
    };
  }
}
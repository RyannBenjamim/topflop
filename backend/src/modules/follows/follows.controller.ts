import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  ParseUUIDPipe, 
  Post, 
  Request 
} from "@nestjs/common";
import { FollowsService } from "./follows.service";
import { ApiResponse } from "../../common/interfaces/ApiResponse";
import { FollowActionDto } from "./dto/follow-action.dto";
import { FollowerResponse } from "./interfaces/FollowerResponse";
import { FollowingResponse } from "./interfaces/FollowingResponse";
import { FollowStatusResponse } from "./interfaces/FollowStatusResponse";
import { FollowMapper } from "./mappers/follow.mapper";
import type { AuthenticatedRequest } from "../../common/interfaces/AuthenticatedRequest";

@Controller("follows")
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  async follow(
    @Request() req: AuthenticatedRequest,
    @Body() dto: FollowActionDto
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.followsService.follow(req.user.id, dto.followingId);
    return {
      message: "Successfully followed user.",
      data: result,
    };
  }

  @Delete(":followingId")
  async unfollow(
    @Request() req: AuthenticatedRequest,
    @Param("followingId", ParseUUIDPipe) followingId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.followsService.unfollow(req.user.id, followingId);
    return {
      message: "Successfully unfollowed user.",
      data: result,
    };
  }

  @Get("followers/:userId")
  async getFollowers(
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ApiResponse<FollowerResponse[]>> {
    const followers = await this.followsService.getFollowers(userId);
    return {
      message: "Followers listed successfully.",
      data: followers.map(FollowMapper.toFollowerResponse),
    };
  }

  @Get("following/:userId")
  async getFollowing(
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ApiResponse<FollowingResponse[]>> {
    const following = await this.followsService.getFollowing(userId);
    return {
      message: "Following listed successfully.",
      data: following.map(FollowMapper.toFollowingResponse),
    };
  }

  @Get("status/:followingId")
  async checkFollowStatus(
    @Request() req: AuthenticatedRequest,
    @Param("followingId", ParseUUIDPipe) followingId: string
  ): Promise<ApiResponse<FollowStatusResponse>> {
    const isFollowing = await this.followsService.checkFollowStatus(req.user.id, followingId);
    return {
      message: "Follow status checked successfully.",
      data: { isFollowing },
    };
  }
}
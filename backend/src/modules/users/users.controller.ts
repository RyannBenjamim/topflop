import { UsersService } from "./users.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Request,
} from "@nestjs/common";
import { ApiResponse } from "../../common/interfaces/ApiResponse";
import { UserSummary } from "./interfaces/UserSummary";
import { UserResponse } from "./interfaces/UserResponse";
import { UserMapper } from "./mappers/user.mapper";
import type { AuthenticatedRequest } from "../../common/interfaces/AuthenticatedRequest";
import { UpdateUsernameDto } from "./dto/UpdateUsername.dto";
import { UpdateNameDto } from "./dto/UpdateName.dto";
import { UpdateBioDto } from "./dto/UpdateBio.dto";
import { UserProfilePicture } from "./interfaces/UserProfilePicture";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<ApiResponse<UserSummary[]>> {
    const users = await this.usersService.findAll();
    return {
      message: "Users listed successfully.",
      data: users.map(UserMapper.toSummary),
    };
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.findOne(id);
    return {
      message: "User successfully searched.",
      data: UserMapper.toResponse(user),
    };
  }

  @Get(":id")
  async getUserProfilePicture(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ApiResponse<UserProfilePicture>> {
    const userProfilePicture = await this.usersService.getUserProfilePicture(id);
    return {
      message: "Profile Picture successfully searched.",
      data: userProfilePicture,
    };
  }

  @Patch("username")
  async updateUsername(
    @Request() req: AuthenticatedRequest,
    @Body() updateUsernameDto: UpdateUsernameDto
  ): Promise<ApiResponse<{ username: string }>> {
    const username = await this.usersService.updateUsername(
      req.user.id, 
      updateUsernameDto.username
    );

    return {
      message: "Username successfully updated.",
      data: username,
    };
  }

  @Patch("name")
  async updateName(
    @Request() req: AuthenticatedRequest,
    @Body() updateNameDto: UpdateNameDto
  ): Promise<ApiResponse<{ name: string | null }>> {
    const name = await this.usersService.updateName(
      req.user.id, 
      updateNameDto.name
    );

    return {
      message: "Name successfully updated.",
      data: name,
    };
  }

  @Patch("bio")
  async updateBio(
    @Request() req: AuthenticatedRequest,
    @Body() updateBioDto: UpdateBioDto
  ): Promise<ApiResponse<{ bio: string | null }>> {
    const bio = await this.usersService.updateBio(
      req.user.id, 
      updateBioDto.bio
    );

    return {
      message: "Bio successfully updated.",
      data: bio,
    };
  }

  @Delete(":id")
  async remove(
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiResponse<UserResponse>> {
    const deletedUser = await this.usersService.remove(req.user.id);
    return {
      message: "User successfully deleted.",
      data: UserMapper.toResponse(deletedUser),
    };
  }
}
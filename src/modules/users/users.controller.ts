import { UsersService } from "./users.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiResponse } from "../../common/interfaces/ApiResponse";
import { UserSummary } from "./interfaces/UserSummary";
import { UserResponse } from "./interfaces/UserResponse";
import { UserMapper } from "./mappers/user.mapper";
import { UpdateUserDto } from "./dto/update-user.dto";

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
  async updateUsername(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ApiResponse<{ username: string }>> {
    const username = await this.usersService.updateUsername(id, updateUserDto.username);
    return {
      message: "Username successfully updated.",
      data: UserMapper.toResponse(user),
    };
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ApiResponse<UserResponse>> {
    const deletedUser = await this.usersService.remove(id);
    return {
      message: "User successfully deleted.",
      data: UserMapper.toResponse(deletedUser),
    };
  }
}
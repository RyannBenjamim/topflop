import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

import { 
  userResponseWithPasswordSelect,
  userResponseSelect, 
  userSummarySelect, 
  profilePictureSelect, 
} from './prisma/users.selects'

import {
  UserResponseWithPasswordFromPrisma,
  UserResponseFromPrisma,
  UserSummaryFromPrisma,
  ProfilePictureFromPrisma
} from './prisma/users.types'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto
  ): Promise<UserResponseFromPrisma> {
    return this.prisma.user.create({ 
      data: createUserDto,
      select: userResponseSelect
    });
  }

  async findAll(): Promise<UserSummaryFromPrisma[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: userSummarySelect,
    });
  }

  async findOne(id: string): Promise<UserResponseFromPrisma> {
    return await this.prisma.user.findUniqueOrThrow({ 
      where: { id },
      select: userResponseSelect
    });
  }

  async findOneByEmail(
    email: string
  ): Promise<UserResponseWithPasswordFromPrisma | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: userResponseWithPasswordSelect
    })
  }

   async findOneByUsername(
    username: string
  ): Promise<UserResponseFromPrisma | null> {
    return await this.prisma.user.findUnique({
      where: { username },
      select: userResponseSelect
    })
  }

  async updateUsername(
    id: string, 
    newUsername: string
  ): Promise<{ username: string }> {
    return await this.prisma.user.update({
      data: { username: newUsername },
      where: { id },
      select: { username: true }
    })
  }

  async updateName(
    id: string, 
    newName: string
  ): Promise<{ name: string | null }> {
    return await this.prisma.user.update({
      data: { name: newName },
      where: { id },
      select: { name: true }
    })
  }

  async updateBio(
    id: string, 
    newBio: string
  ): Promise<{ bio: string | null }> {
    return await this.prisma.user.update({
      data: { bio: newBio },
      where: { id },
      select: { bio: true }
    })
  }

  async getUserProfilePicture(id: string): Promise<ProfilePictureFromPrisma> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: profilePictureSelect
    });
  } 

  async remove(id: string): Promise<UserResponseFromPrisma> {
    return this.prisma.user.delete({ 
      where: { id },
      select: userResponseSelect
    });
  }
}
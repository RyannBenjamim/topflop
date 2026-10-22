import { IsNotEmpty, IsUUID } from "class-validator";

export class FollowActionDto {
  @IsUUID()
  @IsNotEmpty()
  followingId!: string;
}
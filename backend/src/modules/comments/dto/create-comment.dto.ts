import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  content!: string;

  @IsUUID()
  @IsNotEmpty()
  reviewId!: string;
}
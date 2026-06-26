import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  Length
} from "class-validator";

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 5000)
  content!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  topPercentage!: number;

  @IsInt()
  movieTmdbId!: number;
}
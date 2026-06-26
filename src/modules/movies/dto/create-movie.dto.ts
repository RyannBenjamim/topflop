import { IsInt } from "class-validator";

export class CreateMovieDto {
  @IsInt()
  movieTmdbId!: number;
}
import { IsInt, IsNotEmpty } from "class-validator";

export class AddToWatchlistDto {
  @IsInt()
  @IsNotEmpty()
  movieTmdbId!: number;
}
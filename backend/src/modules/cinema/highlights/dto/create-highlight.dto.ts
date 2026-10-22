import { IsInt, IsOptional } from "class-validator";

export class CreateHighlightDto {
  @IsInt()
  @IsOptional()
  topMovieId?: number;

  @IsInt()
  @IsOptional()
  flopMovieId?: number;
}
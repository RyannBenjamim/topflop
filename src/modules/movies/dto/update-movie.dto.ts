import { IsInt } from "class-validator";

export class UpdateMovieDto {
  @IsInt()
  topSumNewValue!: number;
}
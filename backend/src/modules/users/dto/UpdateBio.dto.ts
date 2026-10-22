import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateBioDto {
  @IsString()
  @IsNotEmpty()
  bio!: string;
}
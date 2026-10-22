import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateNameDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_]+$/)
  name!: string;
}
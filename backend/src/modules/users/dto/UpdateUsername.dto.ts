import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username!: string;
}
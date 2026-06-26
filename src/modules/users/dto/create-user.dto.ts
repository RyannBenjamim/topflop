import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  Length, 
  Matches, 
  MinLength 
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username!: string

  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  password!: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name!: string
}
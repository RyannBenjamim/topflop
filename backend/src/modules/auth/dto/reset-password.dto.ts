import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'O token informado é inválido.' })
  @IsNotEmpty({ message: 'O token é obrigatório.' })
  token!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve conter ao menos 6 caracteres.' })
  password!: string;
}

import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendTokenDto {
  @IsEmail({}, { message: 'O e-mail informado é inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;
}
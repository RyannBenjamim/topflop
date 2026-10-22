import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './decorators/public.decorator'; 
import { SigninDto } from './dto/signin.dto';
import { ResendTokenDto } from './dto/resend-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Public() 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK) 
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto.email, signinDto.password);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK) 
  async resendVerification(@Body() resendTokenDto: ResendTokenDto) {
    await this.authService.sendNewToken(resendTokenDto.email);
    return { message: 'Novo link de verificação enviado para o e-mail informado.' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.sendPasswordResetToken(forgotPasswordDto.email);
    return { message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }
}
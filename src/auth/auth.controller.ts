import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {

constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  login(@Body() loginDto: LoginDto) {

    const { email, password } = loginDto;
    
    return this.authService.login(email, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  signUp(@Body() registerDto: RegisterDto) {

    return this.authService.signUp(registerDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void> {
    await this.authService.sendForgotPasswordEmail(email);
  }

  @Post('reset-password')
  async resetPassword(@Query('token') token: string, @Body() resetPasswordDto: ResetPasswordDto): Promise<void>{
    await this.authService.resetPassword(token, resetPasswordDto);
  }

}

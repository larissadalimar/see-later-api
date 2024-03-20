import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserGuard } from './guard/user.guard';

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

  @UseGuards(UserGuard)
  @Post('forgot-password')
  async forgotPassword(@Request() request, @Body('email') email: string): Promise<void> {

    const userId = request["user"].id;

    await this.authService.generateAndSendRandomNumber(userId, email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void>{

    await this.authService.resetPassword(resetPasswordDto);
  }

}

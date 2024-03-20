import { IsEmail, IsNotEmpty, IsNumberString, IsString, Length, MinLength } from "class-validator";

export class ResetPasswordDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @Length(6)
  @IsNumberString()
  verificationCode: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  confirm_newPassword: string;
}
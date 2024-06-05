import { Equals, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Name must be at least 4 characters long' })
    @MaxLength(20, { message: 'Name can not have more than 10 characters long' })
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;
  
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct confirm_email' })
    confirm_email: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
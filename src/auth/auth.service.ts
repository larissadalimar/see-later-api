import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { RegisterDto } from './dto/register.dto';
import { UsersRepository } from 'src/users/user.repository';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

@Injectable()

export class AuthService {

    constructor(private usersRepository: UsersRepository, private jwtService: JwtService) {}

    async login(email: string, password: string): Promise<{ name: any, token: string }> {

        const user = await this.usersRepository.findOne(email);

        if (!user) throw new UnauthorizedException(`Email or password not valid.`);
        
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) throw new UnauthorizedException(`Email or password not valid.`);

        const token = await this.jwtService.signAsync(
          { email: user.email },
          {
            subject: String(user.id),
            secret: process.env.JWT_SECRET 
          }
        );

        return { name: user.name, token: token };
    }

    async signUp(form: RegisterDto): Promise<{ token: string }> {

        const {name, email, confirm_email, password} = form;
        
        if(email !== confirm_email) throw new ConflictException('The confirm_email is not equal email');

        const user = await this.usersRepository.findOne(email);

        if (user) throw new ConflictException('This user already exists.');

        const hashedPassword = await bcrypt.hash(password, 10);

        const userToCreate = await this.usersRepository.createUser({
            ...form,
            password: hashedPassword
        });

        const token = await this.jwtService.signAsync(
          { email: userToCreate.email },
          {
            subject: String(userToCreate.id),
            secret: process.env.JWT_SECRET 
          }
        );

        return { token };
    }

    async createTransporter() {
          
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );
    
      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
      });

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            console.log(err);

            reject("Failed to create access token :(");
          }
          resolve(token);
        });
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          accessToken,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN
        },
        tls: {
          rejectUnauthorized: false
      }
      });

      return transporter;

    };

    async sendForgotPasswordEmail(email: string, verificationCode: number): Promise<void> {

        const emailContent = `
          <p>Olá,</p>
          <p>Envie o seguinte código para criar uma nova senha: (esse código expira em uma hora) </p>
          <h2>${verificationCode}</h2>
        `;
        
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Crie uma nova senha em See Later App',
          html: emailContent,
        };
    
        try {
          
          let emailTransporter = await this.createTransporter();
          await emailTransporter.sendMail(mailOptions);

        } catch (error) {
          console.log( error);

          throw error;
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {

      const { email, verificationCode, newPassword, confirm_newPassword } = resetPasswordDto;

      try {
        
        const userId = (await this.usersRepository.verifyCodeToResetPassword(email, verificationCode)).user_id;
      
        if( newPassword !== confirm_newPassword) throw new ConflictException('Passwords are not equal');

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.usersRepository.updatePassword(userId, hashedPassword);

      } catch (error) {
        
        console.log(error);
        throw error;
        
      }
    }

    async checkToken(token: string) {
        try {
          const data = await this.jwtService.verify(token);
          return data;
          
        } catch (error) {
          console.log(error);
          throw new BadRequestException(error);
        }
    }

    async generateAndSendRandomNumber(userId: number, email: string){

      
      const randomNumber = Math.floor(Math.random() * 900000) + 100000;

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);

      try {
        
        await this.usersRepository.saveVerificationCodeToResetPassword(userId, email, randomNumber, expirationDate);

        await this.sendForgotPasswordEmail(email, randomNumber);

      } catch (error) {
        
        console.log(error);
        throw error;
      }

    }


}

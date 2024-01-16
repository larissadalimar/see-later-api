import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { RegisterDto } from './dto/register.dto';
import { UsersRepository } from 'src/users/user.repository';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import * as nodemailer from 'nodemailer';

@Injectable()

export class AuthService {

    constructor(private usersRepository: UsersRepository, private jwtService: JwtService) {}

    async login(email: string, password: string): Promise<{ token: string }> {

        const user = await this.usersRepository.findOne(email);

        if (!user) throw new UnauthorizedException(`Email or password not valid.`);
        
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) throw new UnauthorizedException(`Email or password not valid.`);

        const token = await this.jwtService.signAsync({ email: user.email }, { subject: String(user.id)})

        return { token };
    }

    async signUp(form: RegisterDto): Promise<{ token: string }> {

        const {name, email, confirm_email, password} = form;

        const user = await this.usersRepository.findOne(email);

        if (user) throw new ConflictException('This user already exists.');

        if(email != confirm_email) throw new ConflictException('The confirm_email is not equal email');

        const hashedPassword = await bcrypt.hash(password, 10);

        const userToCreate = await this.usersRepository.createUser({
            ...form,
            password: hashedPassword
        });

        const token = await this.jwtService.signAsync({ email: userToCreate.email }, { subject: String(userToCreate.id)});

        return { token };
    }

    async sendForgotPasswordEmail(email: string): Promise<void> {

        const token = await this.jwtService.sign({ email });

        const emailContent = `
          <p>Olá,</p>
          <p>Clique no link abaixo para resetar sua senha:</p>
          <a href="http://${process.env.LINK_APP}/reset-password/${token}">Reset Password</a>
        `;
    
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'larissadalimar@gmail.com', 
            pass: '#rio20Lar', 
          },
        });

        const mailOptions = {
          from: 'larissadalimar@gmail.com',
          to: email,
          subject: 'Reset sua senha em See Later App',
          html: emailContent,
        };
    
        await transporter.sendMail(mailOptions);
    }

    async resetPassword(form: ResetPasswordDto): Promise<void> {

        const { token, newPassword } = form;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.usersRepository.updatePassword( this.jwtService.verify(token).email, hashedPassword);
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
}

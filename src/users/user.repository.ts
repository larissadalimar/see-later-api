import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService) {}
    
  async getAllUsers(): Promise<any[]> {
    const result = await this.databaseService.query('SELECT * FROM users');
    return result.rows;
  }

  async getUserById(id: number): Promise<any> {
    const result = await this.databaseService.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    throw new NotFoundException('Could not find the user');
  }

  async createUser(registerDto: RegisterDto): Promise<any> {
    const result = await this.databaseService.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [registerDto.name, registerDto.email, registerDto.password],
    );
    return result.rows[0];
  }

  async deleteById(id: number): Promise<any | null> {
    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }

    await this.databaseService.query('DELETE FROM users WHERE id = $1', [id]);
    return user;
  }

  async findOne(email: string): Promise<any | undefined> {
    const result = await this.databaseService.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return undefined;
  }

  async updatePassword(userId: number, newPassword: string): Promise<any | undefined> {

    try {

      const result = await this.databaseService.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return undefined;

    } catch (error) {

      console.error('Error updating password:', error);
    }
  }
  
  async saveVerificationCodeToResetPassword(userId: number, email: string, randomNumber: number, expirationDate: Date){

    try {

      await this.databaseService.query("INSERT INTO reset_password (verification_code, user_id, expiration_date, email) VALUES ($1, $2, $3, $4)", [randomNumber, userId, expirationDate, email]);

    } catch (error) {

      console.log("error save code: ", error);
    }
  }

  async verifyCodeToResetPassword(email: string, randomNumber: number){

    try {

      const result = await this.databaseService.query("SELECT * FROM reset_password WHERE verification_code = $1 AND email = $2", [randomNumber, email]);

      if(result.rows) throw new BadRequestException("Código ou usuário inválido");

      const expirationDate = result.rows[0].expiration_date;

      const currentTime = new Date();
      if(currentTime < expirationDate) return result.rows[0];
      else throw new UnauthorizedException();
      
    } catch (error) {

      console.log("error: ", error);
      throw error;
    }

  }

}

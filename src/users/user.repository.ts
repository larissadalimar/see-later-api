import { Injectable, NotFoundException } from '@nestjs/common';
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

  async updatePassword(email: string, newPassword: string): Promise<any | undefined> {
    try {
      const result = await this.databaseService.query('UPDATE users SET password= $1 WHERE email = $2', [newPassword, email]);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return undefined;
    } catch (error) {
      // Handle the error, log it, and possibly return a meaningful response.
      console.error('Error updating password:', error);
      return undefined;
    }
  }
  

}

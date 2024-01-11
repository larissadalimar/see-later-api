import { NotFoundException } from "@nestjs/common";
import { RegisterDto } from "src/auth/dto/register.dto";
import { UsersRepository } from "./user.repository";

export class UsersService {

  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async getAllUsers() {
    const users = this.usersRepository.getAllUsers();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.getUserById(id);
    if (user) {
      return user;
    }
    throw new NotFoundException('Could not find the user');
  }

  async createUser(registerDto: RegisterDto) {
    const newUser = await this.usersRepository.createUser(registerDto);
    return newUser;
  }

  async deleteById(id: number) {
    const user = await this.usersRepository.deleteById(id);
    return user;
  }


  async findOne(email: string): Promise<any | undefined> {
    return this.usersRepository.findOne(email);
  }

}
